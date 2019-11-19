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
  email = flask.request.form['email']
  unHashedPass = flask.request.form['pword']
  
  # get db
  database = FlockDev.model.get_db()
  cursor = database.cursor()

  #get password from database corresponding to username
  cursor.execute("SELECT passcode FROM users WHERE email = ?;",(email,))
  returnedPassword = cursor.fetchone()["pword"]

  context = {}
  
  #return username if the login is successful
  if(FlockDev.model.passwords_match(unHashedPass, returnedPassword)):
    context['email'] = email
  
  # maybe put session
  return flask.jsonify(**context)
  
@FlockDev.app.route('/events/<beginEmail>/<endEmail>', methods=['GET', 'POST'])
def availableEvents(beginEmail, endEmail):
  """Update Events."""
  # get db
  database = FlockDev.model.get_db()
  cursor = database.cursor()

  email = beginEmail + '@' + endEmail
  # return all the events that a user has not seen
  # eventQuery = "SELECT * FROM events WHERE eventID NOT IN \
  #   eventID FROM userSeenEvent WHERE username = ?;"

  # "DROP TABLE IF EXISTS View_Events;" Add this query

  eventQuery = "CREATE VIEW View_Events (eventID) AS \
    SELECT DISTINCT eventID FROM events;"

  context = cursor.execute(eventQuery)

  

  eventQuery = "SELECT DISTINCT eventID FROM View_Events \
    EXCEPT \
    SELECT DISTINCT VE.eventID \
    FROM userEventInfo UEI, View_Events VE, users U \
    WHERE UEI.eventID == VE.eventID AND UEI.userID == U.userID \
    AND U.email == ?;"
  
  context = cursor.execute(eventQuery, (email,)).fetchall()

  eventInfo = {}
  i = 0
  for element in context:
    eventID = element['eventID']
    query = "SELECT eventName, eventDescription, picture FROM EVENTS WHERE eventID == " + str(eventID) + ";"
    
    eventInfo[str(i)] = cursor.execute(query).fetchone()
    i += 1


  
  return flask.jsonify(**eventInfo)


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
