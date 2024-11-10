
import boto3 , requests
from botocore.exceptions import ClientError
import app.config.envconfig as config

bucket_name = config.AWS_BUCKET_NAME

session = boto3.Session(
    aws_access_key_id=config.AWS_KEY,
    aws_secret_access_key=config.AWS_SKEY,
    region_name=config.AWS_REGION
)

import logging
import boto3
from botocore.exceptions import ClientError

def gets3UrlFromKeyName(keyName) : 
    return f"https://{config.AWS_BUCKET_NAME}.s3.{config.AWS_REGION}.amazonaws.com/{keyName}"

def create_presigned_url_for_file( object_name , content_type, expiration=3600):
    print(bucket_name , object_name , content_type)
    s3_client = session.client('s3')
    try:
        response = s3_client.generate_presigned_url('put_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': object_name,
                                                            'ContentType' : content_type},
                                                    ExpiresIn=expiration)
    except ClientError as e:
        return None

    # The response contains the presigned URL
    return response


def create_presigned_url( object_name, expiration=3600):
    s3_client = session.client('s3')
    try:
        response = s3_client.generate_presigned_url('put_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': object_name},
                                                    ExpiresIn=expiration)
    except ClientError as e:
        logging.error(e)
        return None

    # The response contains the presigned URL
    return response

def create_presigned_post( object_name,
                          fields=None, conditions=None, expiration=3600):
    # Generate a presigned S3 POST URL
    s3_client = session.client('s3')
    try:
        response = s3_client.generate_presigned_post(bucket_name,
                                                     object_name,
                                                     Fields=fields,
                                                     Conditions=conditions,
                                                     ExpiresIn=expiration)
    except ClientError as e:
        return None

    return response

