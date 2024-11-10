from fastapi import APIRouter

router = APIRouter() 

@router.get("/hello_world")
async def hello_world() : 
    return {'status' : "success"  , "message" : "ok bro"}