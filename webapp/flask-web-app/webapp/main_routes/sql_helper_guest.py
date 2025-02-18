from webapp import models as m,errors, db
from dateutil.relativedelta import relativedelta
import datetime
from passlib.hash import sha256_crypt

def login(group:m.Group):
    group_to_verify=db.session.query(m.Group).filter(m.Group.email==group.email, m.Group.password==group.password).first()
    
    if(group_to_verify is not None):
        return True, group_to_verify
    return False, group_to_verify


        
def get_tasks():
    return db.session.query(m.Task).all()