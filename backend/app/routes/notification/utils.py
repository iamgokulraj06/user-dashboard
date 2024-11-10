import uuid
from app.utils.common import getCurrentTime
from app.mongodb.mongo import MongoDB 
from app.redisconn.config import get_redis_object
from app.utils.common import getCurrentTime , getUserDoc
from pymongo import MongoClient, InsertOne, UpdateOne, DeleteOne

def sendNotifications(fromEmail , notificationType , allFriends ) : 

    toInsertDocs = []
    for to_fiend in allFriends : 
        toInsertDocs.append(InsertOne({
            "fromEmail" : fromEmail , 
            "toEmail" : to_fiend , 
            "notificationType" : notificationType , 
            "notificationId" : str(uuid.uuid4()) , 
            "seen" : False
        }))

    mongodb = MongoDB() 
    mongodb.selectCollection("notifications")
    mongodb.bulkWrite(toInsertDocs)

def sendNotificationsToSingleUser(fromEmail , toEmail , notificationType) : 
    mongodb = MongoDB() 
    mongodb.selectCollection("notifications")
    mongodb.insertOne({
        "fromEmail" : fromEmail , 
        "toEmail" : toEmail , 
        "notificationType" : notificationType , 
        "notificationId" : str(uuid.uuid4()) , 
        "seen" : False
    })

def markNotificationSeen(notificationIds) : 
    mongodb = MongoDB() 
    mongodb.selectCollection("notifications")
    mongodb.updateMany(
        {"notificationId" : {"$in" : notificationIds}} , 
        {"$set" : {"seen" : True}}
    )

def getAllNotificationsHelper(email) : 
    mongodb = MongoDB() 
    mongodb.selectCollection("notifications")
    notificationDocs = mongodb.find({
        "toEmail" : email , 
        "seen" : False
    })

    return notificationDocs