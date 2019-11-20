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
  unHashedPass = flask.request.form['password']
  
  # get db
  database = FlockDev.model.get_db()
  cursor = database.cursor()

  #get password from database corresponding to username
  returnedPassword = cursor.execute("SELECT pword FROM users WHERE email = ?;",(email,))
  returnedPassword = cursor.fetchone()["pword"]
  print(returnedPassword)

  context = {}
  
  # return username if the login is successful
  if(FlockDev.model.passwords_match(unHashedPass, returnedPassword)):
    context['email'] = email
  else:
    context['message'] = "Error: email or password is incorrect"
    context['status_code'] = 404
  
  # maybe put session
  return flask.jsonify(**context)
  
@FlockDev.app.route('/events/<beginEmail>/<endEmail>', methods=['GET'])
def availableEvents(beginEmail, endEmail):
  """Update Events."""
  # get db
  database = FlockDev.model.get_db()
  cursor = database.cursor()

  email = beginEmail + '@' + endEmail

  # return all the events that a user has not seen
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
    query = "SELECT eventID, eventName, eventDescription, picture FROM EVENTS WHERE eventID == " + str(eventID) + ";"
    eventInfo[str(i)] = cursor.execute(query).fetchone()
    i += 1

  eventQuery = "DROP VIEW IF EXISTS View_Events;"
  context = cursor.execute(eventQuery)
  
  return flask.jsonify(**eventInfo)


@FlockDev.app.route('/events/getStatusEvents/<beginEmail>/<endEmail>/<status>',
                    methods = ['GET'])
def getStatusEvents(beginEmail, endEmail, status):
  """View what events a user is interested in"""
  # get db
  database = FlockDev.model.get_db()
  cursor = database.cursor()

  email = beginEmail + '@' + endEmail

  if int(status) < 0 or int(status) > 2:
    context = {}
    context['message'] = "Error: status does not exist"
    context['status_code'] = 404
    return flask.jsonify(**context)
    
  eventQuery = "SELECT DISTINCT UEI.eventID \
                FROM users U, userEventInfo UEI \
                WHERE U.email = ? AND U.userID = UEI.userID \
                AND UEI.commitStatus = ?"
  context = cursor.execute(eventQuery, (email, status,)).fetchall()

  eventInfo = {}
  i = 0
  for element in context:
    eventID = element['eventID']
    query = "SELECT eventID, eventName, eventDescription, picture FROM EVENTS WHERE eventID == " + str(eventID) + ";"
    eventInfo[str(i)] = cursor.execute(query).fetchone()
    i += 1
  
  return flask.jsonify(**eventInfo)


@FlockDev.app.route('/events/postEventStatus/<beginEmail>/<endEmail>/<eventID>/<status>',
                    methods = ['POST'])
def postEventStatus(beginEmail, endEmail, eventID, status):
  """Update the table to reflect a user has seen and is interested."""
  # get db
  database = FlockDev.model.get_db()
  cursor = database.cursor()

  email = beginEmail + '@' + endEmail

  if int(status) < 0 or int(status) > 2:
    context = {}
    context['message'] = "Error: status does not exist"
    context['status_code'] = 404
    return flask.jsonify(**context)

  # grab the userID using the user email
  userQuery = "SELECT userID FROM users \
               WHERE users.email = ?;"
  userID = cursor.execute(userQuery, (email,)).fetchone()["userID"]

  # insert into userEventInfo table that user is interested
  eventQuery = "INSERT INTO userEventInfo (userID, eventID, commitStatus) \
                VALUES(?,?,?);"
  cursor.execute(eventQuery, (userID, eventID, status))
  database.commit()

  context = {}
  context['message'] = "Uploaded"
  context['status_code'] = 200
  
  return flask.jsonify(**context)
  

