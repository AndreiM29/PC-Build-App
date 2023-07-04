import boto3
import os


def lambda_handler(event, context):
    try:
        message = "Hello Andrei1!\nYour stock order has been resolved."
        phone_number = os.environ['phone_nr']  # Replace with the target phone number

        sns = boto3.client('sns')
        response = sns.publish(
            Message=message,
            PhoneNumber=phone_number
        )

        return {
            'statusCode': 200,
            'body': 'SMS sent successfully'
        }
    except Exception as e:
        print('Failed to send SMS:', str(e))
        return {
            'statusCode': 500,
            'body': 'Failed to send SMS'
        }
