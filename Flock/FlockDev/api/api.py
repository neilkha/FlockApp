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
def eventHandler():
  """Update Events."""

  # Get all the events that we the user has not seen
  
 /<int:eventID>, meothiodthods=[]''GnotInterested                    ET, , ''POSTED:def notIntereestedstedevents/()@FLOC:username, eventIDpassreturnlockDev.app.roteute()''ww/events/Interested/<username>/<int:eventID>,                    methods=[]''GET, ''POSETtT:def Interestedinteressteested()username, aeeventID:eenEvent FROmM eventID where        \WHERE WhereHERE USERusername = ?;cursor.exectueute():S""SEquery contextflask.jsonifty(**)context.return = cursor.fetchall())   @ @ # ereturn the fetchall jsonifyinssertuserSeenE""""Add Update the SQL databsase with resnot Interested."""WOWOWOW""curs# get a # get the databasecursor = database = FlockDev.model.get_debb())cursorf = dt = database.curossor())query =  ""INSERT TINTO userSeenEvent()username, eventID ValueLAALUES \      ()?,?,?, ()CURSORcursorupdate the userSeenEvent Table = N.exectueute()""query, ()username, eventID  """"Update the daS SQL database with Interested ."""  UserUseruserSeeneventAttendees = quQueryEvent!Q = \""INSERT INTO eventAttendees()eventId, usernaeme VALEIES VALUES\()?,?"cursor.e                                       xecute()userSeenEvent, ()username. , eventID;cursor.execute()eventAttendeesQuery, ()userneeventID, username*eventID 