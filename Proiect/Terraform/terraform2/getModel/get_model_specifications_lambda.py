import json
import boto3

def lambda_handler(event, context):
    params = event['queryStringParameters']
    type = params['type']
    model = params['model']
    print(type)

    table = ''
    if type == 'cpu':
        table = 'CPUsSpecifications'
    elif type == 'motherboard':
        table = 'MotherboardsSpecifications'
    elif type == 'gpu':
        table = 'GPUsSpecifications'
    elif type == 'ram':
        table = 'RAMSpecifications'
    elif type == 'storage':
        table = 'StorageDrivesSpecifications'
    elif type == 'case':
        table = 'CasesSpecifications'
    elif type == 'power':
        table = 'PowerSuppliesSpecifications'
    
    if table == '':
        response = {
        'statusCode': 400,
        'body': json.dumps({
            'bad model': "bad model",
        })
    }
        return response
    
    
    # Create DynamoDB client
    dynamodb = boto3.client('dynamodb')
    
    specifications = get_specifications(dynamodb,table, model)
        

    # Construct response
    response = {
        'statusCode': 200,
        'body': json.dumps({
            'specifications': specifications,
           
        })
    }
    print(response)
    
    return response


def get_specifications(dynamodb, table_name, model):
    primary_key_value = model 
    response = dynamodb.get_item(
        TableName=table_name,
        Key={
            'Model': {
                'S': primary_key_value
            }
        }
    )

    if 'Item' in response:
        item = response['Item']
        specifications = {}
        for specification_name, specification_value in item.items():
            specifications[specification_name] = list(specification_value.values())[0]
        return specifications
    else:
        return {}
