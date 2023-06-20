locals {
  lambdaPolicies = {
    iam_policy_invoke_for_lambda = aws_iam_policy.iam_policy_invoke_for_lambda.arn,
    lambda_logging               = aws_iam_policy.lambda_logging.arn,
  }
}