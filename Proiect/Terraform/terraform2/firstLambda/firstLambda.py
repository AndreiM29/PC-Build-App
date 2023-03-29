import json

def lambda_handler(event, context):
    response = {
        'statusCode': 200,
        'isBase64Encoded': False,
        'body': json.dumps({'a': 'b'})
    }
    return response