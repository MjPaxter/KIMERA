from flask import request
from webapp import app, sql_helper, user_role as role, errors, models as m
import traceback,datetime,random,string
from webapp.rest.groups import sql_helper_groups

@app.route('/rest/api/group/',methods=["GET"])
@role.admin_authentication_required
def get_all_groups(admin,variables):
    groups=sql_helper_groups.get_all_groups()
    jsondata = [g.to_json() for g in groups]
    return errors.Message(errors.NoError(), jsondata).to_json()


@app.route('/rest/api/my/group/',methods=["GET"])
@role.group_authentication_required
def get_my_group(group,variables):
    group=sql_helper_groups.get_group(group)
    return errors.Message(errors.NoError(), group.to_json()).to_json()


def generate_random_token(length):
    characters = string.ascii_lowercase + string.digits
    return ''.join(random.choice(characters) for _ in range(length))


@app.route('/rest/api/group/',methods=["POST"])
@role.admin_authentication_required
def add_group(admin,variables):
    
    group=m.Group(
        email=request.form.get('email'),
        name=request.form.get('name'),
        token=generate_random_token(50),
        password=request.form.get('password')
    )

    task_ids=request.form.getlist('task_ids[]')
    tasks=[]
    for id in task_ids:
        tasks.append(m.Task(id=int(id)))
    
    if(len(tasks)==0):
        return errors.Message(errors.IncorrectFormatError(error_message="Cannot add the group, please check the data!"), "").to_json()

    try:
        sql_helper_groups.add_group(group,tasks)
        return errors.Message(errors.NoError(), "").to_json()
    except Exception as e:
        print(e)
        return errors.Message(errors.IncorrectFormatError(error_message="Cannot add the group, please check the data!"), "").to_json()
