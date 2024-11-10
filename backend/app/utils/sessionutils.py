import uuid 
from app.redisconn.config import get_redis_object

def storeSessionDetails(data , email) : 
    redis = get_redis_object()
    # Deleting old session details if present
    oldAuthToken = redis.hget("emailToAuthTokenMapper" , email)
    if oldAuthToken != None : 
        redis.delete(f"authToken:{oldAuthToken}")

    newAuthToken = str(uuid.uuid4())
    redis.hset(f"authToken:{newAuthToken}" , mapping=data)
    redis.hset(f"emailToAuthTokenMapper" , email , newAuthToken)
    return newAuthToken

def getSessionDetails(authToken) : 
    redis = get_redis_object()
    return redis.hgetall(f"authToken:{authToken}")

def logoutUser(authToken) : 
    redis = get_redis_object()
    email = redis.hget(f"authToken:{authToken}" , "email")
    if email == None : 
        raise Exception("Invalid AuthToken for logging out")
    redis.hdel("emailToAuthTokenMapper" , email)
    redis.delete(f"authToken:{authToken}")
    


async def checkAuthenticated(auth_key: str):
    redis = get_redis_object()
    return redis.exists(f"authToken:{auth_key}")

async def checkAuthorization(path: str) -> bool:
    # Logic for verifying if the path is authorized
    # Return True if authorized, False otherwise
    return True