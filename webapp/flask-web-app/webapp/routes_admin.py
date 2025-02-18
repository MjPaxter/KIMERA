from webapp import app,db
from flask import render_template,g
from webapp.models import Group,Task,Submission,Admin
from flask import request,session,redirect,jsonify
from webapp import errors
from webapp import user_role as role
import webapp.models as m
from webapp.main_routes import sql_helper_admin

#######################################################
# Here we serve the various routes that are reachable 
# by any registered administrator.
#######################################################

@app.route('/admin/login',methods=["POST","GET"])
@role.page_based_on_role
def admin_login(variables):
    if request.method == 'POST':
        admin=m.Admin(
            username=request.form.get("email"),
            password=request.form.get("password"),
        )
        if(sql_helper_admin.admin_login(admin)):
            admin.password=None
            session["name"] = admin
            return errors.Message(errors.NoError(),"").to_json()
        return errors.Message(errors.IncorrectCredentialsError(),"").to_json()
            
    return render_template('admin_login.html',**variables)


@app.route('/admin/dashboard/')
@role.admin_authentication_required
def admin_dashboard(admin,variables):
    
    return render_template('admin_dashboardv2_home.html',**variables)


@app.route('/admin/dashboard/profile')
@role.admin_authentication_required
def admin_dashboard_profile(admin,variables):
    
    return render_template('admin_dashboardv2_profile.html',**variables)


@app.route('/admin/dashboard/groups')
@role.admin_authentication_required
def admin_dashboard_groups(admin,variables):
    
    return render_template('admin_dashboardv2_groups.html',**variables)

