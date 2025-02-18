from webapp import app,db,errors
from flask import render_template,g
from webapp.models import Group,Task
from flask import request,session,redirect,jsonify
from webapp import user_role as role, models as m
from webapp.main_routes import sql_helper_guest
import traceback

#######################################################
# Here we serve the various routes that are reachable 
# by any guest.
#######################################################


@app.route('/')
@role.page_based_on_role
def index(variables):
    """
    Returns the homepage to the user.
    """

    return render_template('index.html',**variables)


@app.route('/howitworks')
@role.page_based_on_role
def howitworks(variables):
    """
    Returns the page related to how everything works.
    """

    return render_template('howitworks.html',**variables)


@app.route('/login',methods=["POST","GET"])
@role.page_based_on_role
def login(variables):
    """
    Handles login requests.
    Accepts both POST and GET requests.
    """

    if request.method == 'POST':
        group=m.Group(
            email=request.form.get("group-email"),
            password=request.form.get("group-password"),
        )
        logged,group_data=sql_helper_guest.login(group)
        if(logged):
            group_data.password=None
            session["name"] = group_data
            return errors.Message(errors.NoError(),"").to_json()
        
        return errors.Message(errors.IncorrectCredentialsError(),"").to_json()
    
    return render_template('login.html',**variables)


@app.route("/logout")
@role.page_based_on_role
def logout(variables):
    """
    Logs out.
    """

    session["name"] = None
    return redirect("/")