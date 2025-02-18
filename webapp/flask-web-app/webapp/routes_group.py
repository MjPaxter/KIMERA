from webapp import app,db
from flask import render_template,g,Response
from webapp.models import Group,Task,Submission,Admin
from flask import request,session,redirect,jsonify
from webapp import errors
from webapp import user_role as role
import enum,json
from requests import get
from flask import Response
import requests


#######################################################
# Here we serve the various routes that are reachable 
# by any registered group.
#######################################################

@app.route('/dashboard/')
@role.group_authentication_required
def dashboard(group,variables):
    """
    Returns the dashboard to the user.
    """

    variables['group']=group

    return render_template('dashboardv2_home.html',**variables)


@app.route('/dashboard/statistics')
@role.group_authentication_required
def dashboard_statistics(group,variables):
    """
    Returns the dashboard in the statistics page to the user.
    """

    return render_template('dashboardv2_statistics.html',**variables)


@app.route('/dashboard/submissions')
@role.group_authentication_required
def dashboard_submissions(group,variables):
    """
    Returns the dashboard in the statistics page to the user.
    """

    return render_template('dashboardv2_submissions.html',**variables)


@app.route('/dashboard/profile')
@role.group_authentication_required
def dashboard_profile(group,variables):
    """
    Returns the dashboard in the profile page to the user.
    """

    return render_template('dashboardv2_profile.html',**variables)


@app.route('/workspace')
@role.group_authentication_required
def workspace(group,variables):
    """
    Returns the workspace to the user.
    """

    return redirect("/workspace/{}/".format(group.name.lower()))

