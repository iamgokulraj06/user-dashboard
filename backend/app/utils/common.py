import time
from app.mongodb.mongo import MongoDB
from app.redisconn.config import get_redis_object
import uuid

def successResponse(data = {}, status: str = 'success'):
    return {
        'status': status,
        'data': data
    }

def failureResponse(message: str = 'ACCESS_DENIED', status: str = 'error'):
    return {
        'status': status,
        'message': message
    }

def getCurrentTime() : 
    return int(time.time())

def getUserDoc(email) : 
    mongodb = MongoDB() 
    mongodb.selectCollection("users")
    return mongodb.findOne({"email" : email})
    

def checkEmptyStrings(values):
    return [bool(value and value.strip()) for value in values]