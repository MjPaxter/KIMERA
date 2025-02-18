from flask import request
from webapp import app, sql_helper, user_role as role, errors, models as m
import traceback,datetime
from webapp.rest.submissions import sql_helper_submissions

@app.route('/rest/api/submission/',methods=["GET"])
@role.group_authentication_required
def get_all_submissions(group,variables):
    subs=sql_helper_submissions.get_submissions_of_group(group)
    jsondata = [s.to_json() for s in subs]
    return errors.Message(errors.NoError(), jsondata).to_json()


@app.route('/rest/api/submission/group/<group_email>',methods=["GET"])
@role.admin_authentication_required
def get_submissions_of_group(admin,variables,group_email):
    subs=sql_helper_submissions.get_submissions_of_group(m.Group(email=group_email))
    jsondata = [s.to_json() for s in subs]
    return errors.Message(errors.NoError(), jsondata).to_json()
