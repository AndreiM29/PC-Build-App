terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.61"
    }
  }

  required_version = ">= 1.2.0"
}

variable "aws_region" {
  default = "eu-west-1"
}

provider "aws" {
  region = var.aws_region
}

locals {
  lambdaPolicies = {
    iam_policy_invoke_for_lambda = aws_iam_policy.iam_policy_invoke_for_lambda.arn,
    lambda_logging               = aws_iam_policy.lambda_logging.arn,
  }
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
  name               = "Lambda_Function_Role"
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

resource "aws_iam_policy" "access_db_for_lambda" {
  name = "access_db_for_lambda"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:dynamodb:*:*:table/*"
      }
    ]
  })
}

resource "aws_iam_policy" "iam_policy_invoke_for_lambda" {

  name        = "iam_policy_invoke_for_lambda"
  path        = "/"
  description = "AWS IAM Policy for managing aws lambda role"
  policy      = <<EOF
{
  "Statement":[
    {"Condition":
      {"ArnLike":{"AWS:SourceArn": [
            "arn:aws:sns:*",
            "arn:aws:execute-api:*:*:*/*/*"
          ]}},
      "Resource":"arn:aws:lambda:*",
      "Action":"lambda:invokeFunction",
      "Effect":"Allow"
    }],
  "Id":"default",
  "Version":"2012-10-17"
}
EOF
}

resource "aws_iam_policy" "lambda_vpc_access" {
  name        = "lambda_vpc_access"
  path        = "/"
  description = "IAM policy vpc access for a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "ec2:CreateNetworkInterface",
        "ec2:DescribeNetworkInterfaces",
        "ec2:DeleteNetworkInterface",
        "ec2:AssignPrivateIpAddresses",
        "ec2:UnassignPrivateIpAddresses",
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeSubnets",
        "ec2:DescribeVpcs",
        "ecs:ListTasks",
        "ecs:RunTask"
      ],
      "Resource": "*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "attach_policies" {
  for_each = toset([
    aws_iam_policy.iam_policy_invoke_for_lambda.arn,
    aws_iam_policy.lambda_logging.arn,
    aws_iam_policy.lambda_vpc_access.arn,
  aws_iam_policy.access_db_for_lambda.arn])
  role       = aws_iam_role.lambda_role.name
  policy_arn = each.key
}

data "archive_file" "zip_the_python_code_first_lambda" {
  type        = "zip"
  source_dir  = "${path.module}/firstLambda"
  output_path = "${path.module}/python/first-lambda.zip"
}

data "archive_file" "zip_the_python_code_get_models_by_component_type_lambda" {
  type        = "zip"
  source_dir  = "${path.module}/getModels"
  output_path = "${path.module}/python/get_models_by_component_type_lambda.zip"
}

data "archive_file" "zip_the_python_code" {
  type        = "zip"
  source_dir  = "${path.module}/launchTask"
  output_path = "${path.module}/python/launch-ecs.zip"
}

resource "aws_lambda_function" "terraform_lambda_func" {
  filename         = "${path.module}/python/launch-ecs.zip"
  function_name    = "Launch_ECS"
  role             = aws_iam_role.lambda_role.arn
  handler          = "launchTask.lambda_handler"
  runtime          = "python3.8"
  source_code_hash = data.archive_file.zip_the_python_code.output_base64sha256 # for updates
  depends_on       = [aws_iam_role_policy_attachment.attach_policies]
  environment {
    variables = {
      ecs_cluster = "ecs_cluster",
      max_tasks   = "5"
    }
  }
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
  source_arn    = aws_sns_topic.shopping_cart_updates.arn
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

//Cluster provisioning

resource "aws_ecs_cluster" "ecs_cluster" {
  name = "ecs_cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}
resource "aws_ecs_task_definition" "test" {
  family                   = "test"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 1024
  memory                   = 2048
  container_definitions    = <<TASK_DEFINITION
[
  {
    "name": "nginx",
    "image": "nginx:latest",
    "cpu": 1024,
    "memory": 2048,
    "essential": true
  }
]
TASK_DEFINITION

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }
}
#Initialize VPC

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "Main"
  }
}

#Subnets

resource "aws_subnet" "mysubnet_private_1" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"

  tags = {
    Name = "mysubnet.private.1"
  }
}

resource "aws_security_group" "allow_tls" {
  name        = "mysecuritygroup"
  description = "Allow TLS inbound traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "TLS from VPC"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.main.cidr_block]
    # ipv6_cidr_blocks = [aws_vpc.main.ipv6_cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    # ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    Name = "mysecuritygroup"
  }
}

data "aws_caller_identity" "current" {}

output "aws_account_id" {
  value = data.aws_caller_identity.current.account_id
}


/*Cognito User Pool*/


resource "aws_cognito_user_pool" "maf_user_pool" {
  name = "maf_user_pool"

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }
}

resource "aws_cognito_user_pool_client" "maf_client" {
  name         = "external_app"
  user_pool_id = aws_cognito_user_pool.maf_user_pool.id
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]
}

/*API Gateway*/

resource "aws_apigatewayv2_api" "maf_api" {
  name          = "maf_api"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_headers = ["Authorization"]
    allow_methods = ["GET", "POST"]
    max_age       = 300
  }
}

resource "aws_apigatewayv2_authorizer" "auth" {
  api_id           = aws_apigatewayv2_api.maf_api.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "cognito-authorizer"

  jwt_configuration {
    audience = [aws_cognito_user_pool_client.maf_client.id]
    issuer   = "https://${aws_cognito_user_pool.maf_user_pool.endpoint}"
  }
}
//this is for the post configuration:
resource "aws_apigatewayv2_integration" "int" {
  api_id             = aws_apigatewayv2_api.maf_api.id
  integration_type   = "AWS_PROXY"
  connection_type    = "INTERNET"
  integration_method = "POST"
  integration_uri    = "arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:${data.aws_caller_identity.current.id}:function:${var.lambda_name}/invocations"
}

resource "aws_apigatewayv2_route" "route" {
  api_id             = aws_apigatewayv2_api.maf_api.id
  route_key          = "POST /configuration"
  target             = "integrations/${aws_apigatewayv2_integration.int.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.auth.id
}

//this is for the get models lambda:
resource "aws_apigatewayv2_integration" "int_get_models" {
  api_id             = aws_apigatewayv2_api.maf_api.id
  integration_type   = "AWS_PROXY"
  connection_type    = "INTERNET"
  integration_method = "POST"
  integration_uri    = "arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:${data.aws_caller_identity.current.id}:function:${var.lambda_get_models}/invocations"
}

resource "aws_apigatewayv2_route" "route2" {
  api_id             = aws_apigatewayv2_api.maf_api.id
  route_key          = "GET /models"
  target             = "integrations/${aws_apigatewayv2_integration.int_get_models.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.auth.id
}

/*deployment */

resource "aws_cloudwatch_log_group" "api_logs" {
  name = "/aws/api-gateway/ma_api/development"
}

resource "aws_apigatewayv2_stage" "development" {
  api_id      = aws_apigatewayv2_api.maf_api.id
  name        = "development"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_logs.arn
    format          = "{\"requestId\":\"$context.requestId\",\"ip\":\"$context.identity.sourceIp\",\"user\":\"$context.identity.user\",\"method\":\"$context.httpMethod\",\"resourcePath\":\"$context.resourcePath\",\"status\":\"$context.status\",\"protocol\":\"$context.protocol\",\"responseLength\":\"$context.responseLength\"}"
  }
}



resource "aws_lambda_function" "maf_get_models_by_component_type" {
  filename         = "${path.module}/python/get_models_by_component_type_lambda.zip"
  function_name    = "maf_get_models_by_component_type"
  role             = aws_iam_role.lambda_role.arn
  handler          = "get_models_by_component_type.lambda_handler"
  runtime          = "python3.8"
  source_code_hash = data.archive_file.zip_the_python_code_get_models_by_component_type_lambda.output_base64sha256 # for updates
  depends_on       = [aws_iam_role_policy_attachment.attach_policies]# vezi acilea 
}

/*First Backend function contacted by API*/
resource "aws_lambda_function" "maf_first_lambda" {
  filename         = "${path.module}/python/first-lambda.zip"
  function_name    = "maf_first_lambda"
  role             = aws_iam_role.lambda_role.arn
  handler          = "firstLambda.lambda_handler"
  runtime          = "python3.8"
  source_code_hash = data.archive_file.zip_the_python_code_first_lambda.output_base64sha256 # for updates
  depends_on       = [aws_iam_role_policy_attachment.attach_policies]
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.maf_first_lambda.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.maf_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "api_gw_get_models" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.maf_get_models_by_component_type.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.maf_api.execution_arn}/*/*"
}


//dynamodb table --Invetories

resource "aws_dynamodb_table" "motherboards-inventory" {
  name           = "MotherboardsInventory"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }

  attribute {
    name = "Available"
    type = "N"
  }

  global_secondary_index {
    name            = "AvailableIndex"
    hash_key        = "Available"
    projection_type = "ALL"
    read_capacity   = 0
    write_capacity  = 0
  }

  tags = {
    Name        = "motherboards-inventory"
    Environment = "production"
  }
}
resource "aws_dynamodb_table" "cpus-inventory" {
  name           = "CPUsInventory"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }

  attribute {
    name = "Available"
    type = "N"
  }

  tags = {
    Name        = "cpus-inventory"
    Environment = "production"
  }

  global_secondary_index {
    name            = "AvailableIndex"
    hash_key        = "Available"
    projection_type = "ALL"
    read_capacity   = 0
    write_capacity  = 0
  }
}

resource "aws_dynamodb_table" "ram-inventory" {
  name           = "RAMInventory"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }

  attribute {
    name = "Available"
    type = "N"
  }

  tags = {
    Name        = "ram-inventory"
    Environment = "production"
  }

  global_secondary_index {
    name            = "AvailableIndex"
    hash_key        = "Available"
    projection_type = "ALL"
    read_capacity   = 0
    write_capacity  = 0
  }
}

resource "aws_dynamodb_table" "storage-drives-inventory" {
  name           = "StorageDrivesInventory"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }

  attribute {
    name = "Available"
    type = "N"
  }

  tags = {
    Name        = "storage-drives-inventory"
    Environment = "production"
  }

  global_secondary_index {
    name            = "AvailableIndex"
    hash_key        = "Available"
    projection_type = "ALL"
    read_capacity   = 0
    write_capacity  = 0
  }
}

resource "aws_dynamodb_table" "cases-inventory" {
  name           = "CasesInventory"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }

  attribute {
    name = "Available"
    type = "N"
  }

  global_secondary_index {
    name            = "AvailableIndex"
    hash_key        = "Available"
    projection_type = "ALL"
    read_capacity   = 0
    write_capacity  = 0
  }


  tags = {
    Name        = "cases-inventory"
    Environment = "production"
  }
}

resource "aws_dynamodb_table" "power-supplies-inventory" {
  name           = "PowerSuppliesInventory"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }

  attribute {
    name = "Available"
    type = "N"
  }

  global_secondary_index {
    name            = "AvailableIndex"
    hash_key        = "Available"
    projection_type = "ALL"
    read_capacity   = 0
    write_capacity  = 0
  }


  tags = {
    Name        = "power-supplies-inventory"
    Environment = "production"
  }
}

resource "aws_dynamodb_table" "gpus-inventory" {
  name           = "GPUsInventory"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }

  attribute {
    name = "Available"
    type = "N"
  }

  tags = {
    Name        = "gpus-inventory"
    Environment = "production"
  }

  global_secondary_index {
    name            = "AvailableIndex"
    hash_key        = "Available"
    projection_type = "ALL"
    read_capacity   = 0
    write_capacity  = 0
  }
}





//dynamodb table --Details

resource "aws_dynamodb_table" "motherboards-specifications" {
  name           = "MotherboardsSpecifications"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }
/*
  attribute  {
    name = "Socket Type"
    type = "S"
  }

  attribute  {
    name = "Chipset"
    type = "S"
  }

  attribute  {
    name = "RAM Type"
    type = "S"
  }

  attribute  {
    name = "RAM Speed"
    type = "S"
  }

  attribute  {
    name = "PCIe Slots"
    type = "S"
  }

  attribute  {
    name = "Storage Interfaces"
    type = "S"
  }


  attribute  {
    name = "Other Specs"
    type = "S"
  }
*/

  tags = {
    Name        = "motherboards-specifications"
    Environment = "production"
  }
}

resource "aws_dynamodb_table" "cpus-specifications" {
  name           = "CPUsSpecifications"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }
/*
  attribute  {
    name = "Socket Type"
    type = "S"
  }

  attribute  {
    name = "Chipset"
    type = "S"
  }

  attribute  {
    name = "Other Specs"
    type = "S"
  }
*/
  tags = {
    Name        = "cpus-specifications"
    Environment = "production"
  }

}

resource "aws_dynamodb_table" "ram-specifications" {
  name           = "RAMSpecifications"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }
/*
  attribute  {
    name = "Type"
    type = "S"
  }

  attribute  {
    name = "Speed"
    type = "S"
  }

  attribute  {
    name = "Other Specs"
    type = "S"
  }
*/
  tags = {
    Name        = "ram-specifications"
    Environment = "production"
  }

}

resource "aws_dynamodb_table" "storage-drives-specifications" {
  name           = "StorageDrivesSpecifications"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }
/*
  attribute  {
    name = "Interface"
    type = "S"
  }

  attribute  {
    name = "Form Factor"
    type = "S"
  }

  attribute  {
    name = "Capacity"
    type = "S"
  }

  attribute  {
    name = "Other Specs"
    type = "S"
  }
*/
  tags = {
    Name        = "storage-drives-specifications"
    Environment = "production"
  }

}

resource "aws_dynamodb_table" "cases-specifications" {
  name           = "CasesSpecifications"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }
/*
  attribute  {
    name = "Other Specs"
    type = "S"
  }
*/

  tags = {
    Name        = "cases-specifications"
    Environment = "production"
  }
}

resource "aws_dynamodb_table" "power-supplies-specifications" {
  name           = "PowerSuppliesSpecifications"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }
/*
  attribute  {
    name = "Wattage"
    type = "S"
  }

  attribute  {
    name = "Other Specs"
    type = "S"
  }*/

  tags = {
    Name        = "power-supplies-specifications"
    Environment = "production"
  }
}

resource "aws_dynamodb_table" "gpus-specifications" {
  name           = "GPUsSpecifications"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }

  /*attribute  {
    name = "PCIe Slot"
    type = "S"
  }

  attribute  {
    name = "Power Supply"
    type = "S"
  }*/

  tags = {
    Name        = "gpus-specifications"
    Environment = "production"
  }

}


//DynamoDB tables
