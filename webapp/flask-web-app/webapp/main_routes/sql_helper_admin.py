from webapp import models as m,errors, db
from dateutil.relativedelta import relativedelta
import datetime
from passlib.hash import sha256_crypt

def admin_login(admin:m.Admin):
    admin_to_verify=db.session.query(m.Admin).filter(m.Admin.username==admin.username).first()
    if(admin_to_verify is not None):
        if(sha256_crypt.verify( admin.password,admin_to_verify.password)):
            return True
    return False