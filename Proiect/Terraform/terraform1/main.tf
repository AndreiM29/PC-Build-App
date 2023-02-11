terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region  = "eu-west-1"
}

resource "aws_sqs_queue" "cart_queue" {
  name = var.sqs_name
}

resource "aws_sqs_queue_policy" "full_send_message_policy" {
  queue_url = aws_sqs_queue.cart_queue.id

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Id": "sqspolicy",
  "Statement": [
    {
      "Sid": "First",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "sqs:SendMessage",
      "Resource": "${aws_sqs_queue.cart_queue.arn}"
    }
  ]
}
POLICY
}

resource "aws_sns_topic" "shopping_cart_updates" {
  name = "shopping-cart-updates-topic"
}

resource "aws_sns_topic_subscription" "user_updates_sqs_target" {
  topic_arn = aws_sns_topic.shopping_cart_updates.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.cart_queue.arn
}


resource "aws_iam_role" "lambda_role" {
name   = "Lambda_Function_Role"
assume_role_policy = <<EOF
{
 "Version": "2012-10-17",
 "Statement": [
   {
     "Action": "sts:AssumeRole",
     "Principal": {
       "Service": "lambda.amazonaws.com"
     },
     "Effect": "Allow",
     "Sid": ""
   }
 ]
}
EOF
}
resource "aws_iam_policy" "lambda_logging" {
  name        = "lambda_logging"
  path        = "/"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}


resource "aws_iam_policy" "iam_policy_invoke_for_lambda" {
 
 name         = "iam_policy_invoke_for_lambda"
 path         = "/"
 description  = "AWS IAM Policy for managing aws lambda role"
 policy = <<EOF
{
  "Statement":[
    {"Condition":
      {"ArnLike":{"AWS:SourceArn":"arn:aws:sns:*"}},
      "Resource":"arn:aws:lambda:*",
      "Action":"lambda:invokeFunction",
      "Effect":"Allow"
    }],
  "Id":"default",
  "Version":"2012-10-17"
}
EOF
} 
 //"Resource": "${aws_lambda_function.terraform_lambda_func.arn}" --can't have thia because of cycle
//resource "aws_iam_role_policy_attachment" "attach_iam_policy_to_iam_role" {
 //role        = aws_iam_role.lambda_role.name
 //policy_arn  = aws_iam_policy.lambda_logging.arn

//}

resource "aws_iam_role_policy_attachment" "attach_lambda_sns_invocation_and_logs_policy" {
   for_each = toset([
    "${aws_iam_policy.iam_policy_invoke_for_lambda.arn}",
    "${aws_iam_policy.lambda_logging.arn}", 
  ])
  role       = aws_iam_role.lambda_role.name
  policy_arn = each.key
}
 
data "archive_file" "zip_the_python_code" {
type        = "zip"
source_dir  = "${path.module}/launchTask"
output_path = "${path.module}/python/launch-ecs.zip"
}
 
resource "aws_lambda_function" "terraform_lambda_func" {
filename                       = "${path.module}/python/launch-ecs.zip"
function_name                  = "Launch_ECS_Lambda_Function"
role                           = aws_iam_role.lambda_role.arn
handler                        = "launchTask.lambda_handler"
runtime                        = "python3.8"
depends_on                     = [aws_iam_role_policy_attachment.attach_lambda_sns_invocation_and_logs_policy]
}

resource "aws_sns_topic_subscription" "user_updates_lambda_target" {
  topic_arn = aws_sns_topic.shopping_cart_updates.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.terraform_lambda_func.arn
}
//if u manualy remove a subscription from the console terrraform doesnt detect it and doesnt rebuild it

resource "aws_lambda_permission" "for_sns" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.terraform_lambda_func.function_name
  principal     = "sns.amazonaws.com"
  source_arn    =aws_sns_topic.shopping_cart_updates.arn
}

resource "aws_iam_role" "sns_role" {
  name = "iam_for_sns_to_publish_to_lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      },
    ]
  })
}