from flask import Flask, request, jsonify, Response, make_response
from flask_sqlalchemy import SQLAlchemy
import pymysql
pymysql.install_as_MySQLdb()

app = Flask(__name__)
# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///flaskdb.db"
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://root:Jeishu.23@localhost:3306/flaskdb"

# app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
