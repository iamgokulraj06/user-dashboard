from fastapi import APIRouter , Header
from .models import *
from app.utils.common import successResponse , failureResponse , checkEmptyStrings
from app.utils.sessionutils import getSessionDetails
from app.utils.s3utils import create_presigned_url_for_file , gets3UrlFromKeyName
from .utils import *
import uuid

router = APIRouter() 

@router.post("/getPreSignedUrlForProfilePic") 
async def getPreSignedUrlForProfilePic(request :GetPreSignedUrlForProfilePic , authToken : str = Header(None)) : 
    sessionDetails = getSessionDetails(authToken)
    email = sessionDetails['email']
    objectName = f"{email}/profilepic"
    preSignedUrl = create_presigned_url_for_file(objectName , request.contentType , 36000)
    return successResponse({
        "preSignedUrl" : preSignedUrl
    })

@router.post("/updateProfile")
async def confirmProfilePicUpdate(request : UpdateProfileRequest ,  authToken : str = Header(None)) : 
    sessionDetails = getSessionDetails(authToken)
    email = sessionDetails['email']
    objectName = f"{email}/profilepic"
    profilePicUrl = gets3UrlFromKeyName(objectName)
    
    # Now updating the necessary details in mognodb
    sendNotification = False
    if request.isProfilePicUpdated == True : 
        sendNotification = True
    updateNecessaryProfileUpdateInMongo(profilePicUrl , email , request.name , request.bio , sendNotification)

    return successResponse()

@router.post("/updateBasicProfileDetails") 
async def updateBasicProfileDetails(request : UpdateBasicProfileDetailsRequest , authToken : str = Header(None)) : 
    sessionDetails = getSessionDetails(authToken)
    email = sessionDetails['email']
    # Basic Validation for the request
    if checkEmptyStrings([str(request.age) , request.bio , request.location]) == True : 
        return failureResponse("Some Data Are Empty")
    
    updateBasicDetailInMongodb(request.model_dump() , email)

    return successResponse()

@router.post("/getPreSignedUrlForPost")
async def getPresignedUrlForPost(request : GetPresignedUrlForPostRequest , authToken : str = Header(None)) : 
    sessionDetails = getSessionDetails(authToken)
    email = sessionDetails['email']
    postImageId = str(uuid.uuid4())
    objectName = f"{email}/{postImageId}"
    preSignedUrl = create_presigned_url_for_file(objectName , request.contentType , 36000)
    return successResponse({
        "preSignedUrl" : preSignedUrl , 
        "postImageId" : postImageId
    })

@router.post("/confirmPreSignedUrlForPost")
async def confirmPresignedUrlForPost(request : ConfirmPresignedUrlForPost , authToken : str = Header(None)) : 
    sessionDetails = getSessionDetails(authToken)
    email = sessionDetails['email']
    objectName = f"{email}/{request.postImageId}"
    postPicUrl = gets3UrlFromKeyName(objectName)
    if request.postImageId == "" or request.postImageId == None : 
        postPicUrl = None
    # Now updating the necessary details in mognodb
    updateNecessaryCreatePostDetails(postPicUrl , request.postText , email)

    return successResponse()

@router.post("/deletePost") 
async def deletePost(request : DeletePostRequest , authToken : str = Header(None)) : 
    sessionDetails = getSessionDetails(authToken)
    email = sessionDetails['email']
    
    deletePostHelper(request.postId , email)

    return successResponse()


@router.post("/getFeed")
async def getFeed(authToken : str = Header(None)) : 
    sessionDetails = getSessionDetails(authToken)
    email = sessionDetails['email']
    userDoc = getUserDoc(email)
    del userDoc['password']

    feeds = getFeedsHelper(email) 
    return successResponse({
        "feeds" : feeds , 
        "userDoc" : userDoc
    })

@router.post("/getProfileDetails")
async def getProfileDetails(request : GetProfileDetailsRequest , authToken : str = Header(None)) : 
    sessionDetails = getSessionDetails(authToken)
    email = sessionDetails['email']

    toRetrieveProfileEmail = email if request.getAnotherProfile == False else request.anotherProfileEmail

    userDoc = getUserDoc(toRetrieveProfileEmail)

    if userDoc == None : 
        return failureResponse("Invalid Email")
    del userDoc['password']

    # We will get the users post data too
    userPosts = getPostDocsByUser(toRetrieveProfileEmail)
    return successResponse({
        "userDoc" : userDoc , 
        "userPosts" : userPosts
    })


@router.post("/searchPeople")
async def searchPeople(request : SearchPeopleRequest , authToken = Header(None)) : 
    sessionDetails = getSessionDetails(authToken)
    email = sessionDetails['email']
    allFriends = getAllFriendsList(email , returnEmailsAlone=True)
    searchResults = searchPeopleHelper(email, request.searchString , allFriends , request.skip , request.limit)

    return successResponse({
        "people" : searchResults
    })

