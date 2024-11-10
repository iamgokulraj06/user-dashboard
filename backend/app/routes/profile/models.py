from pydantic import BaseModel


class GetPreSignedUrlForProfilePic(BaseModel) : 
    contentType : str 

class UpdateProfileRequest(BaseModel) : 
    bio : str 
    name : str
    isProfilePicUpdated : bool = False

class UpdateBasicProfileDetailsRequest(BaseModel):
    age: int
    location: str 
    bio: str 

class GetPresignedUrlForPostRequest(BaseModel) : 
    contentType : str

class ConfirmPresignedUrlForPost(BaseModel) : 
    postText : str
    postImageId : str

class GetProfileDetailsRequest(BaseModel) : 
    getAnotherProfile : bool = False
    anotherProfileEmail : str = ""

class DeletePostRequest(BaseModel) : 
    postId : str

class SearchPeopleRequest(BaseModel) : 
    searchString : str = ""
    skip : int = 0
    limit : int = 20