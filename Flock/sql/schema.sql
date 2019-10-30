CREATE TABLE users(
  username VARCHAR(20) NOT NULL,
  fullname VARCHAR(40) NOT NULL,
  email VARCHAR(40) NOT NULL,
  password VARCHAR(256) NOT NULL,
  phone INTEGER NOT NULL,
  picture VARCHAR(200),
  PRIMARY KEY(username)
);

CREATE TABLE usersInfo(
  username VARCHAR(20) NOT NULL,
  outdoor_adventures BOOLEAN NOT NULL,
  cooking BOOLEAN NOT NULL,
  gaming BOOLEAN NOT NULL,
  night_life BOOLEAN NOT NULL,
  swimming BOOLEAN NOT NULL,
  weight_lifting BOOLEAN NOT NULL,
  photography BOOLEAN NOT NULL,
  yoga BOOLEAN NOT NULL,
  basketball BOOLEAN NOT NULL,
  dancing BOOLEAN NOT NULL,
  PRIMARY KEY(username)
  FOREIGN KEY(username) REFERENCES users ON DELETE CASCADE ON UPDATE CASCADE,
);
CREATE TABLE events(
  eventID INTEGER NOT NULL,
  eventName VARCHAR(100) NOT NULL,
  host VARCHAR(40) NOT NULL,
  phone INTEGER NOT NULL,
  picture VARCHAR(200),
  PRIMARY KEY(eventID)
);

CREATE TABLE eventAttendees(
  eventID INTEGER NOT NULL,
  username VARCHAR(20) NOT NULL,
  PRIMARY KEY(eventID, username),
  FOREIGN KEY(eventID) REFERENCES events ON DELETE CASCADE ON UPDATE CASCADE,
);