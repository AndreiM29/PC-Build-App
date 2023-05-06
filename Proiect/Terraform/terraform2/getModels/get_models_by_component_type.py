import json
import boto3

def lambda_handler(event, context):
    params = event['queryStringParameters']
    type = params['type']
    print(type)

    table = ''
    if type == 'cpu':
        table = 'CPUsInventory'
    elif type == 'motherboard':
        table = 'MotherboardsInventory'
    elif type == 'gpu':
        table = 'GPUsInventory'
    elif type == 'ram':
        table = 'RAMInventory'
    elif type == 'storage':
        table = 'StorageDrivesInventory'
    elif type == 'case':
        table = 'CasesInventory'
    elif type == 'power':
        table = 'PowerSuppliesInventory'
    
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
    
    models = get_models(dynamodb,table)
        

    # Construct response
    response = {
        'statusCode': 200,
        'body': json.dumps({
            'models': models,
           
        })
    }
    print(response)
    
    return response


def get_models(dynamodb, table_name):
    projection_expression = '#pk'
    expression_attribute_names = {'#pk': 'Model'}
    response = dynamodb.scan(
    TableName=table_name,
    ProjectionExpression = projection_expression,
    ExpressionAttributeNames = expression_attribute_names
)
    primary_keys = [{'Model': item['Model']} for item in response['Items']]

    
    # extract the primary keys from the response items
    primary_keys = [item['Model'] for item in response['Items']]

    # continue scanning if there are more items to retrieve
    while 'LastEvaluatedKey' in response:
        response = dynamodb.scan(
            TableName=table_name,
            ProjectionExpression=projection_expression,
            ExpressionAttributeNames=expression_attribute_names,
            ExclusiveStartKey=response['LastEvaluatedKey']
        )
        primary_keys += [item['Model'] for item in response['Items']]

    # print the primary keys
    return(primary_keys)