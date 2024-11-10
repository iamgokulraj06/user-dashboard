import json
from app.redisconn.config import get_redis_object

class RedisCache:
    def __init__(self):
        self.connection = get_redis_object()
    
    def getValue(self, redisKey: str):
        outputValue = self.connection.get(redisKey)
        return outputValue or False

    def setValue(self, redisKey: str, redisValue: str):
        return self.connection.set(redisKey, redisValue)
    
    def getData(self, redisKey: str, redisObjectKey: str):
        return self.connection.hget(redisKey, redisObjectKey)
    
    def setData(self, redisKey: str, key : str = None, stringValue: str = None, listValue : list = None, dictValue : dict = None):
        return self.connection.hset(redisKey, key, value = stringValue, mapping = dictValue, items = listValue)
    
    def getAllData(self, redisKey : str):
        return self.connection.hgetall(redisKey)
    
    def deleteData(self, redisKey: str, redisObjectKey: str):
        return self.connection.hdel(redisKey, redisObjectKey)
            
    def checkKeyExists(self, redisKey: str):
        return self.connection.exists(redisKey)