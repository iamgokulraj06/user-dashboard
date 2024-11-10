from fastapi import APIRouter , Header
from .models import *
from app.utils.common import successResponse , failureResponse , getUserDoc 
from app.utils.sessionutils import storeSessionDetails , logoutUser
from .routeutils import *

router = APIRouter() 

# Register API

@router.post("/register")
async def register_user(request : RegisterRequest) : 
    # Basic Validations
    if request.confirmPassword != request.password : 
        return failureResponse("Password doesn't match")
    
    if checkValidEmail(request.email) == False : 
        return failureResponse("Invalid Email")
    
    if checkEmptyString(request.name) == False : 
        return failureResponse("Name cannot be empty")
    
    # Now Checking in mongodb whether this email id exists
    if checkEmailAlreadyExits(request.email) == True : 
        return failureResponse("Another user already exits with this email ID")

    # Now Inserting this user in the mongodb
    userDoc = createUserDoc(request.email , request.name , request.password)

    insertUserDocInDatabase(userDoc)

    # Now Logging in the user
    # Now let us store the session details in redis 
    sessionDetails = getSessionDetails(request.email , userDoc)

    authToken = storeSessionDetails(sessionDetails , request.email)
    return successResponse({
        "authToken" : authToken
    })

@router.post("/login")
async def login_user(request : LoginRequest) : 
    email = request.email 
    password = request.password
    print(email , password)
    userDoc = getUserDoc(email)
    if userDoc == None : 
        return failureResponse("Email Id not registered")
    passwordHash = userDoc['password'] 
    if check_password_matches(password , passwordHash) == False : 
        return failureResponse("Invalid Password")

    # Now let us store the session details in redis 
    sessionDetails = getSessionDetails(request.email , userDoc)

    # Store Last Login At
    storeLastLoginAt(email)

    authToken = storeSessionDetails(sessionDetails , request.email)
    return successResponse({
        "authToken" : authToken
    })

@router.post("/logout")
async def logout_user( authToken : str = Header(None)) : 
    print(authToken)
    return successResponse()
    logoutUser(authToken)
    return successResponse()