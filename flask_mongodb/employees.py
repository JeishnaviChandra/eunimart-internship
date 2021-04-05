from main import*
from app import *

db = MongoEngine(app)
class Employee(db.Document):
    name=db.StringField(required=True)
    year=db.IntField()
    dob=db.StringField()

    def json(self):
        return {
             'name':self.name,   
             'year':self.year,
             'dob':self.dob
        }