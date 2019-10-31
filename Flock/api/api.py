from flask import Flask
import flask
import hashlib
import uuid
import Flock.model as model
import Flock
import sqlite3

@Flock.app.route('/login/', methods=['GET', 'POST'])
def login():
  """Login Page."""
  username = flask.request.form["username"]
  unHashedPass = flask.request.form["password"]
  hashedPass = model.pass_hash(unHashedPass)

  # get db
  database = model.get_db()
  cursor = database.cursor()

  cursor.execute("SELECT password FROM events WHERE username = ?;",(username,))
  
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
