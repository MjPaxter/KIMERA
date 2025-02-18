
import enum
from sqlalchemy.types import Integer, Text, String, DateTime, Date, Enum, Boolean, LargeBinary, TIMESTAMP, Time
from sqlalchemy.dialects import postgresql
from sqlalchemy.sql import func
from webapp import db
import copy
from sqlalchemy import inspect
from sqlalchemy.orm import validates
from sqlalchemy.schema import Sequence

#######################################################
# Here we define the tables that will be created in 
# our database.
#######################################################



class Group(db.Model):
    # The group name (username)
    name = db.Column(db.String(100), unique=False, nullable=False )

    # The id of the task for which the group submitted the solution -> Primary key together with group_name
    #task_id = db.Column(db.Integer, db.ForeignKey('task.id', ondelete='CASCADE'), nullable=False)

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

    def __repr__(self):
        return f'<Group {self.name}>'

    def to_json(self):
        e = {c.key: getattr(self, c.key)
             for c in inspect(self).mapper.column_attrs}
        e['created'] = format(self.created, '%Y-%m-%d %H:%M:%S')
        if (e['last_modified'] != None):
            e['last_modified'] = format(
                self.last_modified, '%Y-%m-%d %H:%M:%S')
        #e['status']=e['status'].name
        return e


class Perform(db.Model):
    group_email = db.Column(db.String(320), db.ForeignKey('group.email', ondelete="CASCADE"), primary_key=True)

    # The name of the group
    task_id = db.Column(db.Integer, db.ForeignKey('task.id', ondelete="CASCADE"), primary_key=True )

    # The creation timestamp for this object
    created = db.Column(TIMESTAMP, default=func.now())

    # The last modified timestamp for this object
    last_modified = db.Column(TIMESTAMP, onupdate=func.now())

    def __repr__(self):
        return f'<Perform {self.group_email,self.task_id}>'

    def to_json(self):
        e = {c.key: getattr(self, c.key)
             for c in inspect(self).mapper.column_attrs}
        e['created'] = format(self.created, '%Y-%m-%d %H:%M:%S')
        if (e['last_modified'] != None):
            e['last_modified'] = format(
                self.last_modified, '%Y-%m-%d %H:%M:%S')
        return e


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

    def __repr__(self):
        return f'<Submission {self.id,self.qpu_time}>'

    def to_json(self):
        e = {c.key: getattr(self, c.key)
             for c in inspect(self).mapper.column_attrs}
        e['created'] = format(self.created, '%Y-%m-%d %H:%M:%S')
        e['date_time'] = format(self.date_time, '%Y-%m-%d %H:%M:%S')
        if (e['last_modified'] != None):
            e['last_modified'] = format(
                self.last_modified, '%Y-%m-%d %H:%M:%S')
        return e


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

    def __repr__(self):
        return f'<Task {self.id,self.name}>'

    def to_json(self):
        e = {c.key: getattr(self, c.key)
             for c in inspect(self).mapper.column_attrs}
        e['created'] = format(self.created, '%Y-%m-%d %H:%M:%S')
        if (e['last_modified'] != None):
            e['last_modified'] = format(
                self.last_modified, '%Y-%m-%d %H:%M:%S')
        
        return e


class Admin(db.Model):

    # The username
    username = db.Column(db.String(80), primary_key=True)

    # The password
    password = db.Column(db.String(100),unique=False, nullable=False)

    def __repr__(self):
        return f'<Admin {self.username,self.password}>'