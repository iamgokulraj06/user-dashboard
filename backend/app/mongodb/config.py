from pymongo import MongoClient
import app.config.envconfig as config

client = MongoClient(host=config.MONGO_URI)

def get_mongo_client() -> MongoClient: 
    return client