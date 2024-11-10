import uuid
from app.utils.common import getCurrentTime
from app.mongodb.mongo import MongoDB 
from app.redisconn.config import get_redis_object
from app.utils.common import getCurrentTime , getUserDoc
from app.routes.notification.utils import sendNotifications
from app.routes.userfriends.utils import getAllFriendsList

def updateActivityLog(email , activityType , activityId) : 
    mongodb = MongoDB()
    mongodb.selectCollection("activityLog")

    mongodb.insertOne({
        "fromEmail" : email , 
        "createdAt" : getCurrentTime() , 
        "activityType" : activityType,
        "isDeleted" : False , 
        "activityId" : activityId
    })

def updateNecessaryProfileUpdateInMongo(profilePicUrl , email , name , bio , sendNotification) : 
    mongodb = MongoDB() 
    mongodb.selectCollection("users")
    # Updating the users collection
    mongodb.updateOne({"email" : email} , {"$set" : {"profilePic" : profilePicUrl , "name" : name , "bio" : bio}})

    # Updating the activities log for other user's feed
    if sendNotification : 
        updateActivityLog(email , "profilePic" , None)

        # Sending Notifications for all ther user's friends
        # Send the notifications , Later this can be done as a background task to improve efficiency
        allFriends = getAllFriendsList(email)
        sendNotifications(email , "profilePic" , allFriends)

def updateBasicDetailInMongodb(obj , email) : 
    mongodb = MongoDB() 
    mongodb.selectCollection("users")
    # Updating the users collection
    mongodb.updateOne({"email" : email} , {"$set" : {"metadata" :obj}})

def getPostDoc(postId) : 
    mongodb = MongoDB() 
    mongodb.selectCollection("posts")
    postDoc = mongodb.findOne({"postId" : postId})
    return postDoc

def getPostDocsByUser(email) : 
    mongodb = MongoDB()
    mongodb.selectCollection("posts")
    postDocs = mongodb.find({"email" : email} , {"_id" : 0} , sort={"createdAt" : -1})
    return postDocs

def updateNecessaryCreatePostDetails(postImageUrl , postText , email) : 
    postId = str(uuid.uuid4())
    mongoSchema = {
        "email" : email , 
        "imageUrl" : postImageUrl , 
        "postText" : postText , 
        "createdAt" : getCurrentTime() , 
        "isDeleted" : False,
        "postId" : postId
    }

    mongodb = MongoDB()
    mongodb.selectCollection("posts")
    mongodb.insertOne(mongoSchema)

    # Updating the activity log
    updateActivityLog(email , "posts" , postId)

    # Send the notifications , Later this can be done as a background task to improve efficiency
    allFriends = getAllFriendsList(email)
    sendNotifications(email , "posts" , allFriends)

def deletePostHelper(postId , email) : 
    mongodb = MongoDB()
    mongodb.selectCollection("posts")
    mongodb.updateOne({"postId" : postId , "email" : email} , {"isDeleted" : True})

def getFeedsHelper(email) : 
    # To get the feeds for the user , we will first retrieve the friends list of the user
    friendsListObjects = getAllFriendsList(email)
    friendsList = list(map(lambda x : x['email'] , friendsListObjects))
    # Now we will iterate the activity log collection by filtering if it has only these email ids 
    mongodb = MongoDB()
    mongodb.selectCollection("activityLog")

    pipeline = [
    {
        '$match': {
            'fromEmail': {
                '$in':friendsList
            }, 
            'isDeleted': False
        }
    }, {
        '$lookup': {
            'from': 'users', 
            'localField': 'fromEmail', 
            'foreignField': 'email', 
            'as': 'userDoc'
        }
    }, {
        '$unwind': {
            'path': '$userDoc'
        }
    }, {
        '$project': {
            '_id': 0, 
            'fromEmail': 1, 
            'activityType': 1,
            'activityId' : 1, 
            'createdAt': 1, 
            'name': '$userDoc.name', 
            'bio': '$userDoc.bio', 
            'profilePic': '$userDoc.profilePic'
        }
    }
]

    activityLogDocs = list(mongodb.aggregate(pipeline))

    # after recieving it based on the type we will get the actual data and return it
    profilePicType = []
    postType = []
    finalFeeds = []
    for doc in activityLogDocs : 
        if doc['activityType'] == "profilePic" : 
            profilePicType.append(doc)
            finalFeeds.append(doc)
        else : 
            postType.append(doc)

    # Let us gather all activityId now 
    allActivityId = list(map(lambda x : x['activityId'] , postType))

    mongodb.selectCollection("posts")
    finalPostData = mongodb.find({"postId" : {"$in" : allActivityId}})
    for i in range(len(postType)) : 
        postType[i].update({"imageUrl" : finalPostData[i]['imageUrl'] , "postText" : finalPostData[i]['postText']})

    for postTypeData in postType : 
        finalFeeds.append(postTypeData)

    finalFeeds.sort(key=lambda x : x['createdAt'] , reverse=True)
    return finalFeeds

def searchPeopleHelper(currentEmail, searchString , allFriends , skip , limit):
    mongodb = MongoDB()
    mongodb.selectCollection("users")

    # Define the query
    query = {
        "$and": [
            {"email": {"$ne": currentEmail}},
            {"email" : {"$nin" : allFriends}},
            {
                "$or": [
                    {"name": {"$regex": searchString, "$options": "i"}},  # Case-insensitive regex for name
                    {"email": {"$regex": searchString, "$options": "i"}}  # Case-insensitive regex for email
                ]
            }
        ]
    }

    # Execute the query and fetch results
    results = mongodb.find(query, {'_id': 0 , "password" : 0} , limit=limit , skip=skip)
    return list(results)  # Convert cursor to list if needed