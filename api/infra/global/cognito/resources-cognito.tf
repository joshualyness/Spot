# Cognito User Pool
resource "aws_cognito_user_pool" "main" {
  name = "spot-${var.environment_name}-user-pool"

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
    require_uppercase = false
  }

  alias_attributes = ["email"]

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    name                     = "id"
    required                 = false
    mutable                  = true

    string_attribute_constraints {}
  }

  # Use Cognito's built-in email until SES is verified in eu-west-1.
  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_message        = "Your Spot verification code is {####}"
    email_subject        = "Your Spot verification code"
  }

  auto_verified_attributes = ["email"]

  user_attribute_update_settings {
    attributes_require_verification_before_update = ["email"]
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  admin_create_user_config {
    allow_admin_create_user_only = false
  }

  # Post confirmation creates the Dynamo user profile.
  # Custom email sender (SES) can be re-enabled once an SES identity exists.
  lambda_config {
    post_confirmation = aws_lambda_function.post_confirmation.arn
  }

  depends_on = [
    aws_lambda_permission.post_confirmation_cognito
  ]

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_cognito_user_pool_client" "main" {
  name         = "spot-${var.environment_name}-client"
  user_pool_id = aws_cognito_user_pool.main.id

  access_token_validity  = 60
  id_token_validity      = 60
  refresh_token_validity = 180

  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }

  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_scopes                 = ["email", "openid", "profile"]
  callback_urls                        = ["https://localhost:3000/callback"]
  logout_urls                          = ["https://localhost:3000/logout"]

  generate_secret               = false
  prevent_user_existence_errors = "ENABLED"
  enable_token_revocation       = true

  read_attributes  = ["email", "custom:id"]
  write_attributes = ["email", "custom:id"]

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_cognito_user_group" "group_user" {
  user_pool_id = aws_cognito_user_pool.main.id
  name         = "user"
  description  = "Group for Spot users"
  precedence   = 1
}
