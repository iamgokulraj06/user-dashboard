from pydantic import BaseModel

class RegisterRequest(BaseModel) : 
    name : str 
    email : str 
    password : str 
    confirmPassword : str 
    
class LoginRequest(BaseModel) : 
    email : str 
    password : str
