"""API for Flock."""
from flask import Flask
import flask
import hashlib
import uuid
import FlockDev
import sqlite3
import json

@FlockDev.app.route('/login/', methods=['GET'])
def login():
  """Login Page."""
  email = flask.request.form['email']
  unHashedPass = flask.request.form['password']
  
  # get db
  database = FlockDev.model.get_db()
  cursor = database.cursor()


  #get password from database corresponding to username
  returnedPassword = cursor.execute("SELECT pword FROM users WHERE email = ?;",(email,))

  context = {}

  # Redirect to create new account if user doesn't exist, this shit doesnt work rn
  if returnedPassword.fetchone() is None:
    return flask.redirect(flask.url_for('newUser', userInfo=userInfo))

  returnedPassword = cursor.fetchone()['pword']
  
  # return username if the login is successful
  if(FlockDev.model.passwords_match(unHashedPass, returnedPassword)):
    context['email'] = email
    return flask.jsonify(**context)
  else:
    return flask.jsonify(**makeContext("Error: email or password is incorrect", 404))


# curl -g -X POST -H 'Content-Type:application/json' http://localhost:8000/user/create 
# -d '{"email":"michjc@gmail.com", "fullname":"Michael Cafarella", "pword":"password", "phone":"2483124234"}'
@FlockDev.app.route('/user/create/', methods=['GET', 'POST'])
def newUser():
  """Add a new user."""
  # get db
  database = FlockDev.model.get_db()
  cursor = database.cursor()

  print("making new user")

  info = flask.request.get_data().decode('utf-8')
  info = json.loads(info)

  # userInfo = flask.request.args['userInfo']
  # email = userInfo['email']
  # fullname = userInfo['fullname']
  # pword = userInfo['pword']
  # phone = userInfo['phone']
  
  hashPass = FlockDev.model.pass_hash(str(info['pword']))

  loginQuery = "INSERT INTO users VALUES (?, ?, ?, ?, NULL, NULL);"
  cursor.execute(loginQuery, (info['fullname'], info['email'], hashPass, info['phone']))

  return flask.jsonify(**makeContext("New Account Created", 200))
  
  
@FlockDev.app.route('/events/getAvailable/<beginEmail>/<endEmail>', methods=['GET'])
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
    return flask.jsonify(**makeContext("Error: Status does not exist", 404))
    
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


# curl -g -X POST -H 'Content-Type:application/json' http://localhost:8000/events/add/JugglingWithJeff/JuggleWithJeffery/chessmaster333/2483124234 
# -d '{"outdoor_adventures":"1", "cooking":"0", "gaming":"0", "night_life":"1", "swimming":"0", "weight_lifting":"1", "photography":"0", "yoga":"0", 
# "basketball":"1", "dancing":"1"}'
@FlockDev.app.route('/events/add/<name>/<description>/<host>/<phone>', methods= ['POST'])
def addEvent(name, description, host, phone):
  # get db
  database = FlockDev.model.get_db()
  cursor = database.cursor()
  
  tags = flask.request.get_data().decode('utf-8')
  tags = json.loads(tags)

  tagQuery = "SELECT MAX(tagID) FROM tags"
  tagQuery = cursor.execute(tagQuery).fetchone()

  tagID = 0
  if tagQuery is not None:
    tagID = tagQuery["MAX(tagID)"] + 1

  # insert into tag table
  tagQuery = "INSERT INTO tags VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
  cursor.execute(tagQuery, (tagID,
                            tags['outdoor_adventures'],
                            tags['cooking'],
                            tags['gaming'],
                            tags['night_life'],
                            tags['swimming'],
                            tags['weight_lifting'],
                            tags['photography'],
                            tags['yoga'],
                            tags['basketball'],
                            tags['dancing']))
  database.commit()

  eventQuery = "SELECT MAX(eventID) FROM events"
  eventQuery = cursor.execute(eventQuery).fetchone()

  eventID = 0
  if eventQuery is not None:
    eventID = int(eventQuery["MAX(eventID)"]) + 1

  # insert into event table
  eventQuery = "INSERT INTO events VALUES (?, ?, ?, ?, ?, NULL, ?);"
  cursor.execute(eventQuery, (eventID, name, description, host, phone, tagID))
  database.commit()

  return flask.jsonify(**makeContext("Added Event Successfully", 207))
  

# update user info
# curl -X GET http://localhost:8000/user/set/michjc/umich.edu
@FlockDev.app.route('/user/set/<beginEmail>/<endEmail>', methods=['POST'])
def updateUser(beginEmail, endEmail):
  # get db
  database = FlockDev.model.get_db()
  cursor = database.cursor()

  email = beginEmail + '@' + endEmail

  emailQuery = "SELECT email FROM users WHERE email= '" + email + "';"
  emailQuery = cursor.execute(emailQuery).fetchone()

  if emailQuery is None:
    return flask.jsonify(**makeContext("Email does not exist", 400))
    
  fullname = flask.request.form['fullname']
  phone = flask.request.form['phone']
  picture = flask.request.form['picture']
  
  userQuery = "UPDATE users SET fullname=?, phone=?, picture=? WHERE email=?;"
  cursor.execute(userQuery, (fullname, phone, picture, email))
  database.commit()
  
  return flask.jsonify(**makeContext("Updated User Info Successfully", 207))


# Get user info
# curl -X GET http://localhost:8000/user/get/michjc/umich.edu
# curl -X GET http://localhost:8000/user/get/michjc/umich.ed
@FlockDev.app.route('/user/get/<beginEmail>/<endEmail>', methods=['GET'])
def sendUserInfo(beginEmail, endEmail):
  # get db
  database = FlockDev.model.get_db()
  cursor = database.cursor()

  email = beginEmail + "@" + endEmail

  emailQuery = "SELECT email FROM users WHERE email= '" + email + "';"
  emailQuery = cursor.execute(emailQuery).fetchone()

  if emailQuery is None:
    return flask.jsonify(**makeContext("Email does not exist", 400))

  userQuery = "SELECT userID, fullname, email, pword, phone, picture, tagID FROM users WHERE email= '" + email + "';"
  userInfo = cursor.execute(userQuery).fetchone()
  print(userInfo)
  return flask.jsonify(**userInfo)
  

# Get all tags for a user or event
# curl -X GET http://localhost:8000/tags/get/2
# curl -X GET http://localhost:8000/tags/get/8
@FlockDev.app.route('/tags/get/<tagID>', methods=['GET'])
def getAllTags(tagID):
  # get db
  database = FlockDev.model.get_db()
  cursor = database.cursor()

  tagQuery = "SELECT MAX(tagID) FROM tags"
  tagQuery = cursor.execute(tagQuery).fetchone()

  if tagQuery['MAX(tagID)'] < int(tagID):
    return flask.jsonify(**makeContext("Tag ID does not exist", 400))
  
  tagQuery = "SELECT * FROM tags WHERE tagID=?;"
  tagInfo = cursor.execute(tagQuery, (tagID)).fetchone()
  
  return flask.jsonify(**tagInfo)


def makeContext(message, code):
  context = {}
  context['message'] = message
  context['code'] = code
  return context

