from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dateutil.relativedelta import relativedelta
import datetime
from flask_session import Session
import os
from passlib.hash import sha256_crypt
from flask_wtf.csrf import CSRFProtect

app = Flask(__name__)


username = os.getenv('POSTGRES_USER')
password = os.getenv('POSTGRES_PASSWORD')
database_url=os.getenv('DATABASE_URL')
database_name=os.getenv('POSTGRES_DB')


app.config['SQLALCHEMY_DATABASE_URI']='postgresql://{}:{}@{}:5432/{}'.format(username,password,database_url,database_name)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False
app.config['SECRET_KEY']='secretkeytobechanged'

app.config['SESSION_PERMANENT'] = False
app.config['SESSION_TYPE'] = "filesystem"
Session(app)

db = SQLAlchemy(app)
csrf = CSRFProtect(app)

from webapp import models as m
from webapp import sql_helper
from webapp.rest.submissions import sql_helper_submissions

with app.app_context():
    db.create_all()
    try:
        
        db.session.add(m.Admin(
            username="Admin",
            password=sha256_crypt.encrypt("AdminPassword")
        ))
        
        db.session.commit()
    except Exception as e:
        print(e)
        
        

from webapp import routes_guest,routes_admin,routes_group
from webapp.rest import *