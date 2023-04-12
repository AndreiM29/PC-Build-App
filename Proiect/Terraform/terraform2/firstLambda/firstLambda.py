import json
import boto3

def lambda_handler(event, context):
    # Get PC configuration from API Gateway
    body = json.loads(event['body'])
    pc_configuration = body['pc_configuration']
    print(pc_configuration)
    
    # Extract individual models from PC configuration
    cpu_model = pc_configuration['cpu_model']
    motherboard_model = pc_configuration['motherboard_model']
    gpu_model = pc_configuration['gpu_model']
    ram_model = pc_configuration['ram_model']
    storage_drive_model = pc_configuration['storage_drive_model']
    case_model = pc_configuration['case_model']
    powersupply_model = pc_configuration['powersupply_model']
    print(cpu_model)

    
    # Create DynamoDB client
    dynamodb = boto3.client('dynamodb')
    
    # Check if there are available items in each DynamoDB table
    cpu_count = get_item_count(dynamodb, 'CPUsInventory', cpu_model)
    motherboard_count = get_item_count(dynamodb, 'MotherboardsInventory', motherboard_model)
    gpu_count = get_item_count(dynamodb, 'GPUsInventory', gpu_model)
    ram_count = get_item_count(dynamodb, 'RAMInventory', ram_model)
    storage_drive_count = get_item_count(dynamodb, 'StorageDrivesInventory', storage_drive_model)
    case_count = get_item_count(dynamodb, 'CasesInventory', case_model)
    powersupply_count = get_item_count(dynamodb, 'PowerSuppliesInventory', powersupply_model)
    
    # Check if all models have count greater than 0
    all_available = cpu_count > 0 and motherboard_count > 0 and gpu_count > 0 and ram_count > 0 and \
                     storage_drive_count > 0 and case_count > 0 and powersupply_count > 0
    
    # Construct response
    response = {
        'statusCode': 200,
        'body': json.dumps({
            'cpu_model': cpu_model,
            'cpu_available': cpu_count > 0,
            'motherboard_model': motherboard_model,
            'motherboard_available': motherboard_count > 0,
            'gpu_model': gpu_model,
            'gpu_available': gpu_count > 0,
            'ram_model': ram_model,
            'ram_available': ram_count > 0,
            'storage_drive_model': storage_drive_model,
            'storage_drive_available': storage_drive_count > 0,
            'case_model': case_model,
            'case_available': case_count > 0,
            'powersupply_model': powersupply_model,
            'powersupply_available': powersupply_count > 0,
            'all_available': all_available
        })
    }
    print(response)
    
    return response


def get_item_count(dynamodb, table_name, model):
    # Get item from DynamoDB table
    response = dynamodb.get_item(
        TableName=table_name,
        Key={
            'Model': {'S': model}
        },
        ProjectionExpression='Available'
    )
    
    # Extract count from response
    count = response.get('Item', {}).get('Available', {}).get('N', '0')
    
    # Return count as integer
    return int(count)
