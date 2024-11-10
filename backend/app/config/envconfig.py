import os

# Load MongoDB and Redis configuration
MONGO_URI = os.environ['MONGO_URI']
REDIS_HOST = os.environ['REDIS_HOST']
REDIS_PORT = os.environ['REDIS_PORT']

# Load AWS configuration
AWS_KEY = os.environ['AWS_KEY']
AWS_SKEY = os.environ['AWS_SKEY']
AWS_REGION = os.environ['AWS_REGION']
AWS_BUCKET_NAME = os.environ['AWS_BUCKET_NAME']
