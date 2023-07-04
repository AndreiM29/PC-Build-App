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
        "ecs:RunTask",
        "ecr:DescribeRepositories",
        "ecr:GetAuthorizationToken",
        "ecs:RegisterTaskDefinition",
        "iam:PassRole",
        "sqs:ReceiveMessage",
        "sqs:DeleteMessage",
        "sqs:GetQueueAttributes"
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

data "archive_file" "zip_the_python_code_resolve_stock_lambda" {
  type        = "zip"
  source_dir  = "${path.module}/resolveStock"
  output_path = "${path.module}/python/resolve-stock.zip"
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

data "archive_file" "zip_the_python_code_get_model_specifications_lambda" {
  type        = "zip"
  source_dir  = "${path.module}/getModel"
  output_path = "${path.module}/python/get_model_specifications_lambda.zip"
}

data "archive_file" "zip_the_python_code_maf_get_configurations" {
  type        = "zip"
  source_dir  = "${path.module}/getConfigurations"
  output_path = "${path.module}/python/maf_get_configurations.zip"
}

resource "aws_lambda_function" "maf_resolve_stock" {
  filename         = "${path.module}/python/resolve-stock.zip"
  function_name    = "ResolveStock"
  role             = aws_iam_role.lambda_role.arn
  handler          = "resolveStock.lambda_handler"
  runtime          = "python3.8"
  source_code_hash = data.archive_file.zip_the_python_code.output_base64sha256 # for updates
  depends_on       = [aws_iam_role_policy_attachment.attach_policies]
  environment {
    variables = {
      phone_nr = "+40758949055",
    }
  }
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
      max_tasks   = "5",
      image_uri   = "346037543717.dkr.ecr.eu-west-1.amazonaws.com/delivery_repo:latest"
      task_definition_arn = "arn:aws:ecs:eu-west-1:346037543717:task-definition/DeliveryFamily:1"
    }
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

resource "aws_lambda_function" "maf_get_model_specifications" {
  filename         = "${path.module}/python/get_model_specifications_lambda.zip"
  function_name    = "maf_get_model_specifications"
  role             = aws_iam_role.lambda_role.arn
  handler          = "get_model_specifications_lambda.lambda_handler"
  runtime          = "python3.8"
  source_code_hash = data.archive_file.zip_the_python_code_get_model_specifications_lambda.output_base64sha256 # for updates
  depends_on       = [aws_iam_role_policy_attachment.attach_policies]
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
  environment {
    variables = {
      TOPIC_ARN = "${aws_sns_topic.shopping_cart_updates.arn}",
    }
  }

}

resource "aws_lambda_function" "maf_get_configurations" {
  filename         = "${path.module}/python/maf_get_configurations.zip"
  function_name    = "maf_get_configurations"
  role             = aws_iam_role.lambda_role.arn
  handler          = "maf_get_configurations.lambda_handler"
  runtime          = "python3.8"
  source_code_hash = data.archive_file.zip_the_python_code_maf_get_configurations.output_base64sha256 # for updates
  depends_on       = [aws_iam_role_policy_attachment.attach_policies]# vezi acilea 
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

resource "aws_lambda_permission" "api_gw_get_model" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.maf_get_model_specifications.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.maf_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "api_gw_get_configurations" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.maf_get_configurations.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.maf_api.execution_arn}/*/*"
}
