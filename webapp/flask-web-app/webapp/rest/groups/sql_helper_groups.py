from webapp import models as m,errors, db
from dateutil.relativedelta import relativedelta
import datetime
from passlib.hash import sha256_crypt

def get_all_groups():
    return db.session.query(m.Group).all()


def get_group(group:m.Group):
    return db.session.query(m.Group).filter(m.Group.name==group.name).first()


def add_group(group:m.Group, tasks:list[m.Task]):
    db.session.add(group)
    
    db.session.flush()

    for task in tasks:
        db.session.add(m.Perform(group_email=group.email, task_id=task.id))
    
    db.session.commit()