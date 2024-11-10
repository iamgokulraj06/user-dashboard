import uuid
from app.utils.common import getCurrentTime
from app.mongodb.mongo import MongoDB 
from app.redisconn.config import get_redis_object
from app.utils.common import getCurrentTime
from app.routes.notification.utils import sendNotificationsToSingleUser

def getCombinedEmail(email1, email2):
    # Create a list of emails
    emails = [email1, email2]
    
    # Sort the list
    emails.sort()
    
    # Join the sorted emails into a single string
    return ', '.join(emails)

def checkAlreadyGivenFreindRequest(fromEmail , toEmail) : 
    mongodb = MongoDB() 
    mongodb.selectCollection("friends")
    alreadyGivenDoc = mongodb.findOne({"combinedEmail" : getCombinedEmail(fromEmail , toEmail) , "isDeleted" : False})
    if alreadyGivenDoc == None : 
        return False
    return True

def giveFreindRequest(fromEmail , toEmail) : 
    mongodb = MongoDB() 
    mongodb.selectCollection("friends")
    mongodb.insertOne({
        "combinedEmail" : getCombinedEmail(fromEmail , toEmail) , 
        "fromEmail" : fromEmail, 
        "toEmail" : toEmail , 
        "createdAt" : getCurrentTime() , 
        "isDeleted" : False , 
        "accepted" : False
    })

    sendNotificationsToSingleUser(fromEmail , toEmail , "newFriendRequest")

def acceptFriendRequestHelper(fromEmail , toEmail) : 
    mongodb = MongoDB() 
    mongodb.selectCollection("friends")
    mongodb.updateOne({
        "combinedEmail" : getCombinedEmail(fromEmail , toEmail) 
    }, {"$set" : {
        "accepted" : True
    }})

    # Now need to send the notification
    sendNotificationsToSingleUser(toEmail  , fromEmail , "friendRequestAccepted")

def getAllFriendsList(email , returnEmailsAlone=False) : 
    mongodb = MongoDB() 
    mongodb.selectCollection("friends")
    query = {
        "$or" : [
            {"fromEmail" : email },
            {"toEmail" : email }, 
        ] , 
        "accepted" : True , 
        "isDeleted" : False
    }

    friends_docs = mongodb.find(query)

    

    all_friends = []
    for doc in friends_docs : 
        if doc['fromEmail'] != email : 
            all_friends.append(doc['fromEmail'])
        else : 
            all_friends.append(doc['toEmail'])

    if returnEmailsAlone : 
        return all_friends

    # For all these we will get the bio and name of them 
    mongodb.selectCollection("users")
    all_friends_user_doc = mongodb.find({"email" : {"$in" : all_friends}})
    return all_friends_user_doc

def getPendingFriendRequestList(email):
    mongodb = MongoDB()
    mongodb.selectCollection("friends")
    
    pipeline = [
        {
            "$match": {
                "toEmail": email,
                "accepted": False,
                "isDeleted": False
            }
        },
        {
            "$lookup": {
                "from": "users",             
                "localField": "toEmail",    
                "foreignField": "email",      
                "as": "userProfile"           
            }
        },
        {
            "$unwind": "$userProfile"         
        },
        {
            "$project": {
                "_id" : 0,
                "email" : "$fromEmail",
                "createdAt" : 1,
                "name" : "$userProfile.name",
                "bio" : "$userProfile.bio"
            }
        }
    ]
    print("gokul")

    pendingFriendsDocs = list(mongodb.aggregate(pipeline))
    print(pendingFriendsDocs)
    return pendingFriendsDocs