from fastapi import APIRouter , Header
from app.utils.sessionutils import getSessionDetails
from app.utils.common import successResponse , failureResponse
from .utils import * 
from .models import *
router = APIRouter() 

@router.post("/getNotifications")
async def getNotifications(authToken : str = Header(None)) : 
    sessionDetails = getSessionDetails(authToken)
    email = sessionDetails['email']

    notifications = getAllNotificationsHelper(email)

    return successResponse({
        "notifications" : notifications
    })

