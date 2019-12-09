"""API for Flock."""
from flask import Flask
import flask
import hashlib
import uuid
import FlockDev
import sqlite3
import json

# curl -g -X POST -H 'Content-Type:application/json' http://localhost:8000/login/ 
# -d '{"email":"michjc@gmail.com", "fullname":"Michael Cafarella", "pword":"password", "phone":"2483124234"}'
@FlockDev.app.route('/login/', methods=['POST'])
def login():
  """Login Page."""

  
  # get db
  database = FlockDev.model.get_db()
  cursor = database.cursor()

  info = flask.request.get_data().decode('utf-8')
  info = json.loads(info)
  email = info["email"]
  unHashedPass = info["pword"]
  #get password from database corresponding to username
  # returnedPassword = cursor.execute("SELECT pword FROM users WHERE email = ?;",(email,))
  userInfo = cursor.execute("SELECT fullname, email, pword, phone FROM users WHERE email = ?;",(email,))


  context = {}

  # Redirect to create new account if user doesn't exist, this shit doesnt work rn
  # returnPassword = returnedPassword.fetchone()
  userInfo = userInfo.fetchone()

  if(userInfo is None):
    context['email'] = ""
    return flask.jsonify(**context)
  

  
  # return username if the login is successful
  if(FlockDev.model.passwords_match(unHashedPass, userInfo['pword'])):
    context['email'] = email
    context['fullname'] = userInfo['fullname']
    context['phone'] = userInfo['phone']
    return flask.jsonify(**context)
  else:
    context['email'] = ""
    return flask.jsonify(**context)


# curl -g -X POST -H 'Content-Type:application/json' http://localhost:8000/user/create 
# -d '{"email":"michjc@gmail.com", "fullname":"Michael Cafarella", "pword":"password", "phone":"2483124234"}'
@FlockDev.app.route('/user/create/', methods=['GET', 'POST'])
def newUser():
  """Add a new user."""
  # get db
  database = FlockDev.model.get_db()
  cursor = database.cursor()

  print("making new user")
  print("JSON OBJECT: ")
  
  info = flask.request.get_data().decode('utf-8')
  info = json.loads(info)
  print(info)
  # userInfo = flask.request.args['userInfo']
  # email = userInfo['email']
  # fullname = userInfo['fullname']
  # pword = userInfo['pword']
  # phone = userInfo['phone']
  
  hashPass = FlockDev.model.pass_hash(str(info['pword']))

  fullname = info['firstName'] + " " + info['lastName']
  if(cursor.execute("SELECT * FROM users WHERE email == ?", (info['email'], )).fetchone() is not None):
    context = {}
    context["status"] = "false"
    return flask.jsonify(**context)

  tagQuery = "SELECT MAX(tagID) FROM tags"
  tagQuery = cursor.execute(tagQuery).fetchone()

  tagID = 0
  if tagQuery is not None:
    tagID = tagQuery["MAX(tagID)"] + 1

  tagQuery = "INSERT INTO tags VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
  cursor.execute(tagQuery, (tagID,
                            False,
                            False,
                            False,
                            False,
                            False,
                            False,
                            False,
                            False,
                            False,
                            False))
  database.commit()

  loginQuery = "INSERT INTO users (fullname, email, pword, phone, picture, tagID) VALUES (?, ?, ?, ?, NULL, ?);"
  cursor.execute(loginQuery, (fullname, info['email'], hashPass, info['phone'], tagID))
  database.commit()

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


# @FlockDev.app.route('/events/getStatusEvents/<beginEmail>/<endEmail>/<status>',
#                     methods = ['GET'])
# def getStatusEvents(beginEmail, endEmail, status):
#   """View what events a user is interested in"""
#   # get db
#   database = FlockDev.model.get_db()
#   cursor = database.cursor()

#   email = beginEmail + '@' + endEmail

#   if int(status) < 0 or int(status) > 2:
#     return flask.jsonify(**makeContext("Error: Status does not exist", 404))
    
#   eventQuery = "SELECT DISTINCT UEI.eventID \
#                 FROM users U, userEventInfo UEI \
#                 WHERE U.email = ? AND U.userID = UEI.userID \
#                 AND UEI.commitStatus = ?"
#   context = cursor.execute(eventQuery, (email, status,)).fetchall()

#   eventInfo = {}
#   i = 0
#   for element in context:
#     eventID = element['eventID']
#     query = "SELECT eventID, eventName, eventDescription, picture FROM EVENTS WHERE eventID == " + str(eventID) + ";"
#     eventInfo[str(i)] = cursor.execute(query).fetchone()
#     i += 1
  
#   return flask.jsonify(**eventInfo)


# @FlockDev.app.route('/events/postEventStatus/<beginEmail>/<endEmail>/<eventID>/<status>',
#                     methods = ['POST'])
# def postEventStatus(beginEmail, endEmail, eventID, status):
#   """Update the table to reflect a user has seen and is interested."""
#   # get db
#   database = FlockDev.model.get_db()
#   cursor = database.cursor()

#   email = beginEmail + '@' + endEmail

#   if int(status) < 0 or int(status) > 2:
#     context = {}
#     context['s not exist"
#     context['status_code'] = 404
#     return flask.jsonify(**context)

#   # grab the userID using the user email
#   userQuery = "SELECT userID FROM users \
#                WHERE users.email = ?;"
#   userID = cursor.execute(userQuery, (email,)).fetchone()["userID"]

#   # insert into userEventInfo table that user is interested
#   eventQuery = "INSERT INTO userEventInfo (userID, eventID, commitStatus) \
#                 VALUES(?,?,?);"
#   cursor.execute(eventQuery, (userID, eventID, status))
#   database.commit()

#   context = {}
#   context['message'] = "Uploaded"
#   context['status_code'] = 200
  
#   return flask.jsonify(**context)


# curl -g -X POST -H 'Content-Type:application/json' http://localhost:8000/events/add/JugglingWithJeff/JuggleWithJeffery/chessmaster333/2483124234 
# -d '{"outdoor_adventures":"1", "cooking":"0", "gaming":"0", "night_life":"1", "swimming":"0", "weight_lifting":"1", "photography":"0", "yoga":"0", 
# "basketball":"1", "dancing":"1"}'
@FlockDev.app.route('/events/add/', methods= ['POST'])
def addEvent():
  # get db
  print("adding event")
  database = FlockDev.model.get_db()
  cursor = database.cursor()
  
  info = flask.request.get_data().decode('utf-8')
  info = json.loads(info)
  print(info)
  # get event name, description, and contact information from forms
  eventName = info['eventName']
  eventDesc = info['eventDesc']
  email = info['email']

  # from email serach the database for phone and host name
  context = cursor.execute("SELECT fullname, phone FROM users WHERE email = ?;",(email,)).fetchone()
  host = context['fullname']
  phone = context['phone']

  tagQuery = "SELECT MAX(tagID) FROM tags"
  tagQuery = cursor.execute(tagQuery).fetchone()

  tagID = 0
  if tagQuery is not None:
    tagID = tagQuery["MAX(tagID)"] + 1

  # insert into tag table, tagID
  tagQuery = "INSERT INTO tags VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
  cursor.execute(tagQuery, (tagID, info['outdoor_adventures'], info['cooking'], info['gaming'], info['night_life'], info['swimming'], info['weight_lifting'], info['photography'], info['yoga'], info['basketball'], info['dancing']))
  database.commit()

  eventQuery = "SELECT MAX(eventID) FROM events"
  eventQuery = cursor.execute(eventQuery).fetchone()

  eventID = 0
  if eventQuery is not None:
    eventID = int(eventQuery["MAX(eventID)"]) + 1

  # insert into event table
  eventQuery = "INSERT INTO events VALUES (?, ?, ?, ?, ?, NULL, ?);"
  cursor.execute(eventQuery, (eventID, eventName, eventDesc, host, phone, tagID))
  database.commit()

  return flask.jsonify(**makeContext("Added Event Successfully", 207))
  

# update user info
# curl -X GET http://localhost:8000/user/set/michjc/umich.edu
@FlockDev.app.route('/user/set/<beginEmail>/<endEmail>/', methods=['POST'])
def updateUser(beginEmail, endEmail):
  # get db
  database = FlockDev.model.get_db()
  cursor = database.cursor()

  email = beginEmail + '@' + endEmail

  userInfo = "SELECT tagID FROM users WHERE email= '" + email + "';"
  tagID = cursor.execute(userInfo).fetchone()
  tagID = tagID['tagID']

  # if emailQuery is None:
  #   return flask.jsonify(**makeContext("Email does not exist", 400))
    
  info = flask.request.get_data().decode('utf-8')
  info = json.loads(info)
  
  print("fullname is: " + info['fullname'])
  userQuery = "UPDATE users SET fullname=?, phone=? WHERE email=?;"
  cursor.execute(userQuery, (info['fullname'], info['phone'], email))
  database.commit()
  
  print("tagID is " + str(tagID))
  tagQuery = "UPDATE tags SET outdoor_adventures = ?, cooking = ?, gaming = ?, night_life = ?, swimming = ?, weight_lifting = ?, photography = ?, yoga = ?, basketball = ?, dancing = ? WHERE tagID = ?;"
  cursor.execute(tagQuery, (info['outdoor_adventures'], info['cooking'], info['gaming'], info['night_life'], info['swimming'], info['weight_lifting'], info['photography'], info['yoga'], info['basketball'], info['dancing'], tagID))
  database.commit()
  
  return flask.jsonify(**makeContext("Updated User Info Successfully", 207))


# # Get user info
# # curl -X GET http://localhost:8000/user/get/michjc/umich.edu
# # curl -X GET http://localhost:8000/user/get/michjc/umich.ed
# @FlockDev.app.route('/user/get/<beginEmail>/<endEmail>', methods=['GET'])
# def sendUserInfo(beginEmail, endEmail):
#   # get db
#   database = FlockDev.model.get_db()
#   cursor = database.cursor()

#   email = beginEmail + "@" + endEmail

#   emailQuery = "SELECT email FROM users WHERE email= '" + email + "';"
#   emailQuery = cursor.execute(emailQuery).fetchone()

#   if emailQuery is None:
#     return flask.jsonify(**makeContext("Email does not exist", 400))

#   userQuery = "SELECT userID, fullname, email, pword, phone, picture, tagID FROM users WHERE email= '" + email + "';"
#   userInfo = cursor.execute(userQuery).fetchone()
#   print(userInfo)
#   return flask.jsonify(**userInfo)
  

# Get all tags for a user or event
# curl -X GET http://localhost:8000/tags/get/2
# curl -X GET http://localhost:8000/tags/get/8
@FlockDev.app.route('/tags/get/<beginEmail>/<endEmail>/', methods=['GET'])
def getAllTags(beginEmail, endEmail):
  # get db
  database = FlockDev.model.get_db()
  cursor = database.cursor()

  email = beginEmail + "@" + endEmail

  context = cursor.execute("SELECT tagID FROM users WHERE email = ?;",(email,)).fetchone()
  tagID = context['tagID']

  tagInfo = cursor.execute("SELECT * FROM tags WHERE tagID =?;", (tagID,)).fetchone()

  print(tagInfo)
  print(type(tagInfo))
  # if tagQuery['MAX(tagID)'] < int(tagID):
  #   return flask.jsonify(**makeContext("Tag ID does not exist", 400))
  return flask.jsonify(**tagInfo)


def makeContext(message, code):
  context = {}
  context['message'] = message
  context['code'] = code
  return context

