"""API for Flock."""
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
  unHashedPass = flask.request.form['pword']
  
  # get db
  database = FlockDev.model.get_db()
  cursor = database.cursor()

  #get password from database corresponding to username
  cursor.execute("SELECT pword FROM users WHERE username = ?;",(username,))
  returnedPassword = cursor.fetchone()["pword"]

  context = {}
  
  #return username if the login is successful
  if(FlockDev.model.passwords_match(unHashedPass, returnedPassword)):
    context['username'] = username
  
  # maybe put session
  return flask.jsonify(**context)
  
@FlockDev.app.route('/events/<fullname>/', methods=['GET', 'POST'])
def availableEvents(fullname):
  """Update Events."""
  # get db
  database = FlockDev.model.get_db()
  cursor = database.cursor()

  # return all the events that a user has not seen
  # eventQuery = "SELECT * FROM events WHERE eventID NOT IN \
  #   eventID FROM userSeenEvent WHERE username = ?;"
  eventQuery = "CREATE VIEW View_Events (eventID) AS \
    SELECT DISTINCT eventID FROM events; \
    SELECT DISTINCT eventID FROM View_Events \
    MINUS \
    SELECT DISTINCT VE.eventID \
    FROM userEventInfo UEI, View_Events VE \
    WHERE UEI.eventID == VE.eventID AND UEI.userID == " + fullname + ";"
  
  context = cursor.execute(eventQuery, (fullname,))

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
  seenQuery = "INSERT INTO userSeenEvent(username, eventID)VALUES(?,?);"
  database.execute(seenQuery, (username, int(eventID)))

  return "executed"
