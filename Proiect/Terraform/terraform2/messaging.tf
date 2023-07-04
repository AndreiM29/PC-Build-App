resource "aws_sqs_queue" "cart_queue" {
  name = var.sqs_name1
}

resource "aws_sqs_queue" "delivery_queue" {
  name = var.sqs_name2
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

resource "aws_sqs_queue_policy" "full_send_message_policy2" {
  queue_url = aws_sqs_queue.delivery_queue.id

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
      "Resource": "${aws_sqs_queue.delivery_queue.arn}"
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

//resource "aws_sns_topic_subscription" "user_updates_lambda_target" {
//  topic_arn = aws_sns_topic.shopping_cart_updates.arn
//  protocol  = "lambda"
//  endpoint  = aws_lambda_function.terraform_lambda_func.arn
//}
//if u manualy remove a subscription from the console terrraform doesnt detect it and doesnt rebuild it

//resource "aws_lambda_permission" "for_sns" {
//  statement_id  = "AllowExecutionFromSNS"
//  action        = "lambda:InvokeFunction"
//  function_name = aws_lambda_function.terraform_lambda_func.function_name
//  principal     = "sns.amazonaws.com"
//  source_arn    = aws_sns_topic.shopping_cart_updates.arn
//}

resource "aws_lambda_event_source_mapping" "sqs_event_mapping" {
  event_source_arn = aws_sqs_queue.cart_queue.arn
  function_name    = aws_lambda_function.terraform_lambda_func.function_name
  batch_size       = 5
}

resource "aws_lambda_event_source_mapping" "sqs_event_mapping2" {
  event_source_arn = aws_sqs_queue.delivery_queue.arn
  function_name    = aws_lambda_function.maf_resolve_stock.function_name
  batch_size       = 5
}


resource "aws_iam_role_policy" "sns_publish_policy" {
  name        = "sns-publish-policy"
  role        = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "sns:Publish"
        ]
        Resource = [aws_sns_topic.shopping_cart_updates.arn,
        "arn:aws:sns:eu-west-1:${data.aws_caller_identity.current.account_id}:*"]
      }
    ]
  })
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
