from flask import Flask
import flask
import hashlib
import uuid
import FlockDev
import sqlite3

@FlockDev.app.route('/login/', methods=['GET', 'POST'])
def login():
  """Login Page."""
  username = flask.request.form['user']
  unHashedPass = flask.request.form['password']
  
  # get db
  database = FlockDev.model.get_db()
  cursor = database.cursor()

  #get password from database corresponding to username
  cursor.execute("SELECT password FROM users WHERE username = ?;",(username,))
  returnedPassword = cursor.fetchone()["password"]

  context = {}
  
  #return username if the login is successful
  if(FlockDev.model.passwords_match(unHashedPass, returnedPassword)):
    context['username'] = username
  
  # maybe put session
  return flask.jsonify(**context)
  
@FlockDev.app.route('/events/<username>/', methods=['GET', 'POST'])
def availableEvents(username):
  """Update Events."""

  # get db
  database = FlockDev.model.get_db()
  cursor = database.cursor()

  # return all the events that a user has not seen
  eventQuery = "SELECT * FROM events WHERE eventID NOT IN \
    eventID FROM userSeenEvent WHERE username = ?;"
  
  context = cursor.execute(eventQuery, (username,))

  return flask.jsonify(**context)


@FlockDev.app.route('/events/Interested/<username>/<int:eventID>',
                    methods = ['GET','POST'])
def interestedEvents(username, eventID):
  """Update the table to reflect a user has seen and is interested."""

  # get db
  database = FlockDev.model.get_db()
  cursor = database.cursor()

  # insert into seen
  seenQuery = "INSERT INTO userSeenEvent(eventId, username) VALUES(?,?);"
  cursor.execute(seenQuery, (username, eventID))
  # insert into attending
  eventAttendeesQuery  = "INSERT INTO eventAttendees(eventID, username)\
     VALUES(?,?);"
  cursor.execute(eventAttendeesQuery, (username, eventID))


@FlockDev.app.route('/events/notInterestedEvents/<username>/<int:eventID>/',
                    methods = ['GET', 'POST'])
def notInterestedEvents(username, eventID):
  """Update the table to reflect a user has seen and is not interested."""

  # get db
  database = FlockDev.model.get_db()
  cursor = database.cursor()

  # insert into seen
  seenQuery = "INSERT INTO userSeenEvent(eventId, username) VALUES(?,?)";
  cursor.execute(seenQuery, (username, eventID))
