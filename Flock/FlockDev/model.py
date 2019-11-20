import flask
import hashlib
import uuid
import sqlite3
import FlockDev
# import Flock.config as config

def sha256sum(filename):
  """Return sha256 hash of file content, similar to UNIX sha256sum."""
  content = open(filename, 'rb').read()
  sha256_obj = hashlib.sha256(content)
  return sha256_obj.hexdigest()
  
def sha512sum(password, salt=uuid.uuid4().hex):
    """Return sha512 hash of password."""
    algorithm = 'sha512'
    hash_obj = hashlib.new(algorithm)
    password_salted = salt + password
    hash_obj.update(password_salted.encode('utf-8'))
    password_hash = hash_obj.hexdigest()
    password_db_string = "$".join([algorithm, salt, password_hash])
    return password_db_string

def pass_hash(new_password):
  """Hashes password."""
  algorithm = 'sha512'
  salt = uuid.uuid4().hex
  hash_obj = hashlib.new(algorithm)
  password_salted = salt + new_password
  hash_obj.update(password_salted.encode('utf-8'))
  password_hash = hash_obj.hexdigest()
  password_db_string = "$".join([algorithm, salt, password_hash])
  return password_db_string

def passwords_match(password_input, password_correct):
    """Check if passwords match."""
    salt = password_correct.rsplit('$', 2)[1]

    return sha512sum(password_input, salt) == password_correct

def dict_factory(cursor, row):
    """Convert database row objects to a dictionary."""
    output = {}
    for idx, col in enumerate(cursor.description):
        output[col[0]] = row[idx]
    return output

def get_db():
    """Open a new database connection."""
    if not hasattr(flask.g, 'sqlite_db'):
        flask.g.sqlite_db = sqlite3.connect(FlockDev.app.config['DATABASE_FILENAME'])
        flask.g.sqlite_db.row_factory = dict_factory

        # Foreign keys have to be enabled per-connection.  This is an sqlite3
        # backwards compatibility thing.
        flask.g.sqlite_db.execute("PRAGMA foreign_keys = ON")

    return flask.g.sqlite_db