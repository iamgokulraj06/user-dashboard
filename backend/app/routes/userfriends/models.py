from pydantic import BaseModel

class GiveFriendRequest(BaseModel) : 
    email : str 

class AcceptFriendRequest(BaseModel) : 
    email : str

