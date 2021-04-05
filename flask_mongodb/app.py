from flask import Flask,request,Response,jsonify
from flask_mongoengine import MongoEngine
app=Flask(__name__)
app.config['MONGODB_SETTINGS'] = {
    'db':'flaskdb',
    'host':'mongodb://localhost/flaskdb',
    'port':27017
}

