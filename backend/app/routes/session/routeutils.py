import re
from app.utils.common import getCurrentTime
from app.mongodb.mongo import MongoDB 
from app.redisconn.config import get_redis_object
import bcrypt , uuid

def checkValidEmail(email: str) -> bool:
    """Check if the provided email is valid."""
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_regex, email) is not None

def checkEmptyString(value: str) -> bool:
    """Check if the provided string is empty or consists only of whitespace."""
    return bool(value and value.strip())

def checkEmailAlreadyExits(email : str) -> bool : 
    """Check if the provided email is in the database or not"""
    mongodb = MongoDB() 
    mongodb.selectCollection("users")
    userDoc = mongodb.findOne({"email" : email})
    if userDoc != None : 
        return True 
    return False

def convertPasswordStringToHash(password : str) : 
    pass 

def createUserDoc(email , name , password) : 
    return {
        "email" : email , 
        "name" : name , 
        "password" : generate_password_hash(password) , 
        "role" : "user" , 
        "createdAt" : getCurrentTime(),
        "lastLoginAt" : getCurrentTime()
    }

def insertUserDocInDatabase(userDoc) : 
    mongodb = MongoDB() 
    mongodb.selectCollection("users")
    mongodb.insertOne(userDoc)


def generate_password_hash(password: str) -> str:
    """Generate a hashed password from the given plaintext password."""
    # Convert password to array of bytes
    password_bytes = password.encode('utf-8')
    # Generate the salt
    salt = bcrypt.gensalt()
    # Hash the password
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")

def check_valid_password(plain_password: str, hashed_password: str) -> bool:
    """Check if the provided plain password matches the hashed password."""
    # Encode the user-entered password
    plain_password_bytes = plain_password.encode('utf-8')
    # Check the password
    return bcrypt.checkpw(plain_password_bytes, hashed_password.encode("utf-8"))

def check_password_matches(password  , passwordHash) : 
    # First getting the hashed password from the mogndob
    if check_valid_password(password , passwordHash) == False : 
        return False 
    return True

def getSessionDetails(email , userDoc) : 
    return {
        "email" : email , 
        "name" : userDoc['name'] , 
    }

def storeLastLoginAt(email) : 
    mongodb = MongoDB() 
    mongodb.selectCollection("users")
    mongodb.updateOne({"email" : email} , {"$set" : {"lastLoginAt" : getCurrentTime()}})