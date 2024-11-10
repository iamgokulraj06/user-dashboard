from app.mongodb.config import get_mongo_client
from app.config.staticconfig import MONGO_DB

class MongoDB:

    def __init__(self):
        self.connection = get_mongo_client()
        self.dbName = MONGO_DB
        self.collectionName = None
        self.cursor = None
    
    def selectDB(self, db : str = MONGO_DB):
        self.dbName = db
        return self.connection[db]
    
    def selectCollection(self, collection : str = None):
        if (collection == None): return False
        self.collectionName = collection
        self.cursor = self.connection[self.dbName][collection]
        return self.cursor
    
    def getAvailableDataBase(self):
        return self.connection.list_database_names()

    def insertOne(self, document ):
        if (document == None): return False
        return self.cursor.insert_one(document)
    
    def insertMany(self, documents ):
        if (documents == None): return False
        return self.cursor.insert_many(documents)
    
    def find(self, query : dict = {}, projection : dict = {'_id': 0}, limit = None, sort = None , skip = None):
        cursorObject = self.cursor.find(query, projection)
        if (sort != None):
            cursorObject.sort(sort)
        if skip != None : 
            cursorObject.skip(skip)
        if (limit != None):
            cursorObject.limit(limit)
        return [obj for obj in cursorObject]
    
    def findOne(self, query : dict = {} , projection : dict = {'_id' : 0}) : 
        return self.cursor.find_one(query , projection)
    
    def updateOne(self, query = None, values : dict = {}, upsert = False):
        if (query == None): return False
        return self.cursor.update_one(query, values, upsert)
    
    def updateMany(self, query = None, values : dict = {}, upsert = False):
        if (query == None): return False
        return self.cursor.update_many(query, values, upsert)
    
    def delete(self, query : dict = {}):
        return self.cursor.delete_many(query)
    
    def aggregate(self, query = None):
        if (query == None): return False
        cursorObject = self.cursor.aggregate(query)
        return [obj for obj in cursorObject]
    
    def bulkWrite(self, operations = None):
        return self.cursor.bulk_write(operations)