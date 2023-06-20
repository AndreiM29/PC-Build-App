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


