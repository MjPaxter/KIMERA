from webapp import models as m,errors, db
from dateutil.relativedelta import relativedelta
import datetime
from passlib.hash import sha256_crypt
from webapp.rest.tasks import sql_helper_tasks




def get_submissions_of_group(group:m.Group):
    submissions= db.session.query(m.Submission.id,
                                 m.Submission.group_email,
                                 m.Submission.task_id,
                                 m.Submission.date_time,
                                 m.Submission.qpu_time,
                                 m.Submission.submission_sampler,
                                 m.Submission.created,
                                 m.Submission.last_modified
                                 ).filter(m.Submission.group_email==group.email).all()
    to_return=[]
    for s in submissions:
        to_return.append(m.Submission(id=s[0],
                                    group_email=s[1],
                                    task_id=s[2],
                                    date_time=s[3],
                                    qpu_time=s[4],
                                    submission_sampler=s[5],
                                    created=s[6],
                                    last_modified=s[7],
                                    submission_data="",
                                    results="",
                                    other_data=""
                                    ))
    return to_return
    #return db.session.query(m.Submission).filter(m.Submission.group_email==group.email).all()

def add_submission(submission:m.Submission):
    db.session.add(submission)

    db.session.commit()