from webapp import models as m,errors, db
from dateutil.relativedelta import relativedelta
import datetime
from passlib.hash import sha256_crypt

def get_members_of_group(group:m.Group):
    return db.session.query(m.Member).join(m.Composed, m.Composed.member_email==m.Member.email).filter(m.Composed.group_name==group.name).all()