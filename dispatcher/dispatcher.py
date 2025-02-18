import os
from flask import Flask, request, jsonify,Response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.types import Integer, Text, String, DateTime, Enum, ARRAY
from sqlalchemy.sql import func
import enum
import requests
from requests import get
from sqlalchemy.types import Integer, Text, String, DateTime, Date, Enum, Boolean, LargeBinary, TIMESTAMP, Time
from sqlalchemy import inspect
import math,datetime
import json

from sqlalchemy.schema import Sequence

app = Flask(__name__)


app.config['SESSION_PERMANENT'] = False
app.config['SESSION_TYPE'] = "filesystem"
app.config['SECRET_KEY']='...'

username = os.getenv('POSTGRES_USER')
password = os.getenv('POSTGRES_PASSWORD')
database_url=os.getenv('DATABASE_URL')
database_name=os.getenv('POSTGRES_DB')
token = os.getenv('QA_TOKEN')


app.config['SQLALCHEMY_DATABASE_URI']='postgresql://{}:{}@{}:5432/{}'.format(username,password,database_url,database_name)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False

db=SQLAlchemy(app)


class Group(db.Model):
    # The group name (username)
    name = db.Column(db.String(100), unique=False, nullable=False )

    # The password
    password = db.Column(db.String(100),unique=False, nullable=True)

    # The token associated to the group
    token = db.Column(db.String(100),unique=True, nullable=False)

    # The email for communications
    email = db.Column(db.String(320), primary_key=True)

    # The creation timestamp for this object
    created = db.Column(TIMESTAMP, default=func.now())

    # The last modified timestamp for this object
    last_modified = db.Column(TIMESTAMP, onupdate=func.now())
    

class Task(db.Model):
    # The task identifier
    id = db.Column(db.Integer, Sequence("task_id_seq", start=1), primary_key=True)

    # The task name
    name = db.Column(db.String(100),nullable=False)

    # A brief description of the task
    description = db.Column(db.String(500), nullable=False)

    # Total QPU time for each group
    quota= db.Column(db.BigInteger,nullable=True)

    # The creation timestamp for this object
    created = db.Column(TIMESTAMP, default=func.now())

    # The last modified timestamp for this object
    last_modified = db.Column(TIMESTAMP, onupdate=func.now())


class Submission(db.Model):
    # The submission id -> Primary key together with group_name, with task_id
    id = db.Column(db.String(200), primary_key=True, )

    # The group who performed this submission
    group_email = db.Column(db.String(320), db.ForeignKey('group.email', ondelete='CASCADE'), nullable=False)

    # The task_id related to this submission
    task_id = db.Column(db.Integer, db.ForeignKey('task.id', ondelete='CASCADE'), nullable=False)

    # The time when the submission happened
    date_time = db.Column(TIMESTAMP, nullable=False)

    # The qpu time used for the submission
    qpu_time = db.Column(db.BigInteger, nullable=False)

    # The results corresponding to the submitted problems
    results=db.Column(db.Text, nullable=False)

    # The submitted problems
    submission_data=db.Column(db.Text, nullable=False)

    # The sampler used
    submission_sampler=db.Column(db.Text, nullable=True)

    # Other data contained in the problem label
    other_data=db.Column(db.Text, nullable=False)

    # The creation timestamp for this object
    created = db.Column(TIMESTAMP, default=func.now())

    # The last modified timestamp for this object
    last_modified = db.Column(TIMESTAMP, onupdate=func.now())


class Perform(db.Model):
    group_email = db.Column(db.String(320), db.ForeignKey('group.email', ondelete="CASCADE"), primary_key=True)

    # The name of the group
    task_id = db.Column(db.Integer, db.ForeignKey('task.id', ondelete="CASCADE"), primary_key=True )

    # The creation timestamp for this object
    created = db.Column(TIMESTAMP, default=func.now())

    # The last modified timestamp for this object
    last_modified = db.Column(TIMESTAMP, onupdate=func.now())


def post_problem(request,group,headers,url):
    try:
        task_id=int(json.loads(request.data.decode())[0]['label'][0])
    except Exception as e:
        return Response(json.dumps([{'error_code': 404, 'error_msg': 'The task format corresponding to this submission is wrong. It must be in the format [TASK NUMBER][YOUR OPTIONAL CUSTOM LABEL]'}]),200)

    # Checking that the group participates in the given task ############
    group_task=db.session.query(Perform).filter(Perform.task_id==task_id, Perform.group_email==group.email).first()
    if(group_task is None):
        return Response(json.dumps([{'error_code': 404, 'error_msg': 'The task corresponding to this submission is wrong.'}]),200)
    # Checking that the group participates in the given task ############

    task_time=db.session.query(Task).filter(Task.id==task_id).first().quota
    total_time_spent = db.session.query(db.func.sum(Submission.qpu_time)).filter(Submission.group_email==group.email, Submission.task_id==task_id).scalar()
    if(total_time_spent is None):
        total_time_spent=0

    # Checking that the group has sufficient qpu time for the given task ############
    if(total_time_spent>=task_time):
        return Response(json.dumps([{'error_code': 404, 'error_msg': 'Monthly quota exceeded for this task. Problem not accepted because of insufficient remaining solver access time.'}]),200)
    # Checking that the group has sufficient qpu time for the given task ############


    # forwarding the request to D-Wave in https format
    resp = requests.request(
        method          = request.method,
        url             = url,
        headers         = headers,
        data            = request.get_data(),
        cookies         = request.cookies,
        allow_redirects = False,
    )
    
    if (not 'error_code' in resp.json()[0].keys()):
        try:
            db.session.add(Submission(
                id=resp.json()[0]['id'],
                qpu_time=0,
                group_email=group.email,
                task_id=int(resp.json()[0]['label'][0]),
                date_time=datetime.datetime.now(),
                results="",
                submission_data=request.data.decode(),
                other_data=resp.json()[0]['label']
            ))
            db.session.commit()
            return Response(resp.content, resp.status_code)
        
        except Exception as e:
            return Response(json.dumps([{'error_code': 404, 'error_msg': str(e)}]),200)
    
    return Response(json.dumps([{'error_code': 404, 'error_msg': 'There has been an error involving this submission.'}]),200)


def get_problem_results(response):
    content_json=response.json()

    sampler=""

    problem_id=content_json['id']
    if('timing' in content_json['answer'].keys()):
        qpu_time=content_json['answer']['timing']['qpu_access_time']
        sampler="Q"
    else:
        qpu_time=content_json['answer']['data']['info']['charge_time']
        sampler="H"

    try:
        submission_to_update=db.session.query(Submission).filter(Submission.id==problem_id).first()
        submission_to_update.qpu_time=math.ceil(qpu_time)
        submission_to_update.results=str(content_json)
        submission_to_update.submission_sampler=sampler
        db.session.commit()
        response = Response(response.content, response.status_code)
        return response
    except:
        return Response(json.dumps([{'error_code': 404, 'error_msg': 'There has been an error involving this submission.'}]),200)
    

def set_problem_results(request,group):
    #content_json=request.json()
    content_json=json.loads(request.data.decode())
    try:
        # We are using QA
        problem_id=content_json['info']['problem_id']
        submission_to_update=db.session.query(Submission).filter(Submission.id==problem_id).first()
        submission_to_update.results=str(content_json)
        db.session.commit()
        response = Response("Submission correctly updated", 200)
        return response
    except:
        # We are using SA
        submission=db.session.query(Submission).filter(Submission.submission_sampler=="S").order_by(Submission.id.desc()).first()
        if(submission is not None):
            id = "SA-"+str(int(submission.id.split("SA-")[1])+1)
        else:
            id= "SA-0"
        db.session.add(Submission(
            id=id,
            qpu_time=int(content_json['info']['timing']['annealing']/1000),
            group_email=group.email,
            # TODO: choose label format!!!!!!!
            task_id=int(content_json['label'][0]),
            date_time=datetime.datetime.now(),
            results=content_json,
            submission_data="",
            submission_sampler="S",
            other_data=content_json['label']
            ))
        db.session.commit()
        
        response = Response("Submission correctly updated", 200)
        return response
    


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>', methods=["GET","POST","PUT"])
def catch_all(path):
        
    # the D-Wave url for secure connection
    url="https://cloud.dwavesys.com/sapi/"+path
    headers={k:v for k,v in request.headers if k.lower() != 'host'}
    group=db.session.query(Group).filter(Group.token==request.headers['X-Auth-Token']).first()
    headers['X-Auth-Token']=token

    # if the method is 'POST' and has a specific path then we are trying to update a problem
    if(request.method=="POST" and request.path.startswith("/update-problem/")):
        if(group is None):
            return Response(json.dumps([{'error_code': 404, 'error_msg': 'There is an error involving the credentials of your team.'}]),200)
        response=set_problem_results(request,group)
        return response
    
    # if the method is 'GET' and has a problem id then append it to the request
    if( request.method=="GET" and 'id' in request.args):
        url=url+"?id="+request.args['id']

    # if the method is 'POST' and a problem has been submitted than keep track
    if(request.method=="POST" and request.path.startswith("/problems/")):
        if(group is None):
            return Response(json.dumps([{'error_code': 404, 'error_msg': 'There is an error involving the credentials of your team.'}]),200)
        response=post_problem(request,group,headers,url)
        return response
        
    # forwarding the request to D-Wave in https format
    resp = requests.request(
        method          = request.method,
        url             = url,
        headers         = headers,
        data            = request.get_data(),
        cookies         = request.cookies,
        allow_redirects = False,
    )

    # updating the time of the submitted problem
    if(request.method=="GET" and "id" not in request.args and request.path.startswith("/problems/")):
        response=get_problem_results(resp)
        return response

    # forwarding the response back
    response = Response(resp.content, resp.status_code)
    return response

app.run(debug=False, port=5000, host="0.0.0.0")