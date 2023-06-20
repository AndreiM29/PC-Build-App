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

//this is for the get model lambda:
resource "aws_apigatewayv2_integration" "int_get_model" {
  api_id             = aws_apigatewayv2_api.maf_api.id
  integration_type   = "AWS_PROXY"
  connection_type    = "INTERNET"
  integration_method = "POST"
  integration_uri    = "arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:${data.aws_caller_identity.current.id}:function:${var.lambda_get_model}/invocations"
}

resource "aws_apigatewayv2_route" "route3" {
  api_id             = aws_apigatewayv2_api.maf_api.id
  route_key          = "GET /model"
  target             = "integrations/${aws_apigatewayv2_integration.int_get_model.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.auth.id
}

//this is for the get configurations lambda:
resource "aws_apigatewayv2_integration" "int_get_configurations" {
  api_id             = aws_apigatewayv2_api.maf_api.id
  integration_type   = "AWS_PROXY"
  connection_type    = "INTERNET"
  integration_method = "POST"
  integration_uri    = "arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:${data.aws_caller_identity.current.id}:function:${var.lambda_get_configurations}/invocations"
}

resource "aws_apigatewayv2_route" "route4" {
  api_id             = aws_apigatewayv2_api.maf_api.id
  route_key          = "GET /configurations"
  target             = "integrations/${aws_apigatewayv2_integration.int_get_configurations.id}"
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