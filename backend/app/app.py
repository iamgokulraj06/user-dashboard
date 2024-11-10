from fastapi import FastAPI , Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.utils.sessionutils import checkAuthenticated , checkAuthorization
from app.config.routepathconfig import open_paths

from app.routes.helloworld.routes import router as HelloWorldAPIRouter
from app.routes.session.routes import router as SessionRouter
from app.routes.profile.routes import router as ProfileRouter 
from app.routes.userfriends.routes import router as friendsRouter
from app.routes.notification.routes import router as NotificationRouter 

import traceback

app = FastAPI()



@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    print("inside middleware")
    if request.url.path in open_paths:
        # If it's an open path, skip authentication and authorization
        return await call_next(request)
    
    auth_header = request.headers.get("authToken")
    if auth_header == None : 
        auth_header = request.headers.get("authtoken")
    if auth_header == None : 
        auth_header = request.headers.get("Authtoken")
    # Check if Authorization header is present and properly formatted
    if not auth_header:
        return JSONResponse(
            {"detail": "Invalid or missing Authorization header"},
            status_code=400
        )
    print("ok")
    # Check authentication with the token
    is_authenticated = await checkAuthenticated(auth_header)
    if not is_authenticated:
        return JSONResponse(
            {"detail": "Invalid API Key"},
            status_code=401
        )
    print("authtenticated")
    # Check authorization with the request path
    is_authorized = await checkAuthorization(request.url.path)
    if not is_authorized:
        return JSONResponse(
            {"detail": "Unauthorized access to this resource"},
            status_code=403
        )

    # If both authentication and authorization pass, proceed to next middleware or route
    response = await call_next(request)
    return response

# Error handling middleware
@app.middleware("http")
async def error_handling_middleware(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        # Handle the exception and return a JSON response
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"detail": str(e)}
        )

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Including all routes

app.include_router(HelloWorldAPIRouter)
app.include_router(SessionRouter)
app.include_router(ProfileRouter)
app.include_router(friendsRouter)
app.include_router(NotificationRouter)