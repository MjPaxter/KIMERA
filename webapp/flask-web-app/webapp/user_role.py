from webapp import app,db,errors as e
from flask import render_template,g
from webapp.models import Group,Task,Submission,Admin
from flask import request,session,redirect,jsonify
import enum
from functools import wraps

#######################################################
# Here we define the role of the user and its session
# management
#######################################################


class Role(enum.Enum):
    guest="guest"
    group="group"
    admin="admin"

def page_based_on_role(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        variables={}
        user=session.get("name")
        if user==None:
            variables['logged_in']=Role.guest.value
        elif type(user) is Admin:
            variables['logged_in']=Role.admin.value
        elif type(user) is Group:
            variables['logged_in']=Role.group.value
        
        return  f(variables, *args, **kwargs)
    
    return decorated

# decorator for verifying the authentication as admin
def admin_authentication_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        print(args, kwargs)
        admin=session.get("name")
        if admin==None or type(admin) is not Admin:
            return e.Message(e.NotAuthenticatedError(),"").to_json()
        
        variables={}
        variables['logged_in']=Role.admin.value
        return  f(admin, variables, *args, **kwargs)
    
    return decorated

# decorator for verifying the authentication as user
def group_authentication_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user=session.get("name")
        if user==None or type(user) is not Group:
            return redirect("/login")
        
        variables={}
        variables['logged_in']=Role.group.value
        return  f(user, variables, *args, **kwargs)
  
    return decorated


# decorator for verifying the authentication as dispatcher
def dispatcher_authentication_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        name=request.form.get("username")
        password=request.form.get("password")
        # TODO: perform check
        variables={}
        return  f(variables, *args, **kwargs)
  
    return decorated