from webapp import models as m,errors, db
from dateutil.relativedelta import relativedelta
import datetime
from passlib.hash import sha256_crypt

def get_tasks():
    return db.session.query(m.Task).all()

def get_task(task:m.Task):
    return db.session.query(m.Task).filter(m.Task.id==task.id).first()

def get_task_of_group(group:m.Group):
    return db.session.query(m.Task).join(m.Perform, m.Task.id==m.Perform.task_id).filter(m.Perform.group_email==group.email).all()