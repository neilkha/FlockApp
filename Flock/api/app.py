from flask import Flask
import flask
import hashlib
import uuid
import model
import sqlite3
app = Flask(__name__)

@app.route('/login', methods=['GET', 'POST'])
def login():
  """Login Page."""
  username = flask.request.form["user"]
  unHashedPass = flask.request.form["password"]
  hashedPass = model.pass_hash(unHashedPass)

  # get db
  database = model.get_db()
  cursor = database.cursor()

  cursor.execute("SELECT U.password as password,\
                  FROM users U WHERE U.username = ?;",
                  (username,))
  
  returnedPassword = cursor.fetchone()

  context = {}

  if(hashedPass != returnedPassword):
    return context
  
  context['username'] = username
  # maybe put session
  return context
  
# @app.route('/events/<username>/', methods )
# def events():
#   username = flask.session
#   return 'Hello from Server'
