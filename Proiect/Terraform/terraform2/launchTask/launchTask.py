import os
import json
import boto3

#you can pass environment variables
ecs_cluster = os.environ['ecs_cluster'] 
maxTasksStr = os.environ.get('max_tasks') or 2
image_uri = os.environ['image_uri']
task_definition_arn = os.environ['task_definition_arn']
maxTasks = int(maxTasksStr)

ec2Client = boto3.client('ec2')
ecsClient = boto3.client('ecs')

#get the list of subnetIDs whose name starts with 'mysubnet.private'
subnets = ec2Client.describe_subnets(
    Filters=[
        {
            'Name':'tag:Name',
            'Values': ['mysubnet.public*']
        }
    ],
    MaxResults=5
)

#get the security groups for this task
securityGroups = ec2Client.describe_security_groups(
    Filters=[
        {
            'Name':'tag:Name',
            'Values': ['mysecuritygroup']
        }
    ]
)

def lambda_handler(event, context):
    
    print("Received event:", event)
    print("Context", context)
    
    #extract the subnet IDs only
    subnetIDs = [subnet['SubnetId'] for subnet in subnets['Subnets']]
    print("Subnet IDs:", subnetIDs)
    
    #extract the security groups IDs
    securityGroupIds = [ securityGroup['GroupId'] for securityGroup in securityGroups['SecurityGroups'] ]
    print("SecurityGroupIds:", securityGroupIds)
    
    #now start a new ECS task ...
    
    #prevent starting too many tasks 
    taskIds = ecsClient.list_tasks(
        cluster=ecs_cluster,
        family="{}-mytask".format(ecs_cluster),
        desiredStatus='RUNNING',
    )

    print("tasks list:", taskIds)
    taskIdsCount = len(taskIds['taskArns'])
    print("tasks list length:", taskIdsCount)
    
    
    if taskIdsCount > maxTasks:
        response = {"msg" : "Too many jobs running: {} > {}. Will not start a new job".format(taskIdsCount, maxTasks)}
        print(response)
    else:
        fullResponse = ecsClient.run_task(
            cluster=ecs_cluster,
            taskDefinition=task_definition_arn,
            launchType='FARGATE',
            enableECSManagedTags=True,
            networkConfiguration={
                'awsvpcConfiguration': {
                    'subnets': subnetIDs,
                    'securityGroups': securityGroupIds,
                    'assignPublicIp': 'ENABLED'
                }
            },
            tags=[],
        )


        print("runt_task response:", fullResponse)
        response = {"taskArns": [tasks['taskArn'] for tasks in fullResponse['tasks']] }
        print("taskARNs:", response)

    
    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps(response)
    }
