from fastapi import APIRouter , Header
from .models import *
from .utils import *
from app.utils.common import successResponse , failureResponse , getUserDoc
from app.utils.sessionutils import getSessionDetails
router = APIRouter() 

@router.post("/giveFriendRequest")
async def giveFriendRequest(request : GiveFriendRequest , authToken = Header(None)) : 
    sessionDetails = getSessionDetails(authToken)
    email = sessionDetails['email']
    if checkAlreadyGivenFreindRequest(email , request.email) == True : 
        return failureResponse("Already Given Friend Request")
    
    if getUserDoc(request.email) == None : 
        return failureResponse("No such user exists")
    
    if email == request.email : 
        return failureResponse("Cannot be your email itself")
    
    giveFreindRequest(email , request.email) 

    return successResponse()


@router.post("/acceptFriendRequest")
async def acceptFriendRequest(request : AcceptFriendRequest , authToken = Header(None)) : 
    sessionDetails = getSessionDetails(authToken)
    email = sessionDetails['email']
    if checkAlreadyGivenFreindRequest(email , request.email) == False : 
        return failureResponse("Friend Request Not Given Yet")
    
    acceptFriendRequestHelper(request.email , email)

    return successResponse()

@router.post("/getFriends") 
async def getAllFriends(authToken = Header(None)) : 
    sessionDetails = getSessionDetails(authToken)
    email = sessionDetails['email']
    all_friends = getAllFriendsList(email)
    pending_friends = getPendingFriendRequestList(email)
    print(pending_friends)
    print(all_friends)
    return successResponse({
        "friends" : all_friends , 
        "pendingFriendRequests" : pending_friends
    })

