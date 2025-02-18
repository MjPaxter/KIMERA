from flask import request
from webapp import app, sql_helper, user_role as role, errors, models as m
import traceback,datetime
from webapp.rest.tasks import sql_helper_tasks

@app.route('/rest/api/task/')
@role.page_based_on_role
def get_all_tasks(variables):
    tasks=sql_helper_tasks.get_tasks()
    jsondata = [t.to_json() for t in tasks]
    return errors.Message(errors.NoError(), jsondata).to_json()


@app.route('/rest/api/task/<task_id>',methods=["GET"])
@role.page_based_on_role
def get_task(variables,task_id):
    task=sql_helper_tasks.get_task(m.Task(id=task_id))
    return errors.Message(errors.NoError(), task.to_json()).to_json()


@app.route('/rest/api/my/task/',methods=["GET"])
@role.group_authentication_required
def get_tasks_of_my_group(group,variables):
    tasks=sql_helper_tasks.get_task_of_group(group)
    jsondata = [t.to_json() for t in tasks]
    return errors.Message(errors.NoError(), jsondata).to_json()


@app.route('/rest/api/task/group/<group_email>',methods=["GET"])
@role.admin_authentication_required
def get_tasks_of_group(admin,variables,group_email):
    
    tasks=sql_helper_tasks.get_task_of_group(m.Group(email=group_email))
    jsondata = [t.to_json() for t in tasks]
    return errors.Message(errors.NoError(), jsondata).to_json()


@app.route('/rest/api/task/<task_id>',methods=["PUT"])
@role.admin_authentication_required
def add_or_update_task(variables,task_id):
    ""
    return errors.Message(errors.MethodNotAvailableError(), "").to_json()