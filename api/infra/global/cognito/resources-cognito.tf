# Cognito User Pool
resource "aws_cognito_user_pool" "main" {
  name = "${var.environment_name}-user-pool"

  # Password policy
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
    require_uppercase = false
  }

  # User attributes
  alias_attributes = ["email"]

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    name                     = "id"
    required                 = false
    mutable                  = true

    string_attribute_constraints {}
  }

  # Email configuration — SES identity used by Cognito defaults if needed; Custom Email Sender sends via Lambda/SES
  email_configuration {
    email_sending_account = "DEVELOPER"
    from_email_address    = local.ses_from_email
    source_arn            = data.aws_ses_domain_identity.mail.arn
  }

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_message        = "Your verification code is {####}"
    email_subject        = "Your verification code"
  }

  # Auto verification
  auto_verified_attributes = ["email"]

  # Keep the current verified email active until a replacement is verified.
  user_attribute_update_settings {
    attributes_require_verification_before_update = ["email"]
  }

  # Account recovery
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  # Sign up
  admin_create_user_config {
    allow_admin_create_user_only = false
  }

  # Post confirmation + Custom Email Sender (Lambda decrypts code and sends via SES)
  lambda_config {
    post_confirmation = aws_lambda_function.post_confirmation.arn
    kms_key_id        = aws_kms_key.cognito_email.arn

    custom_email_sender {
      lambda_arn     = aws_lambda_function.email_sender.arn
      lambda_version = "V1_0"
    }
  }

  depends_on = [
    aws_lambda_permission.post_confirmation_cognito,
    aws_lambda_permission.email_sender_cognito
  ]

  lifecycle {
    prevent_destroy = true
  }
}

# Cognito User Pool Client
resource "aws_cognito_user_pool_client" "main" {
  name         = "${var.environment_name}-client"
  user_pool_id = aws_cognito_user_pool.main.id

  # Token validity
  access_token_validity  = 60  # 1 hour
  id_token_validity      = 60  # 1 hour
  refresh_token_validity = 180 # 180 days

  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }

  # OAuth settings
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_scopes                 = ["email", "openid", "profile"]
  callback_urls                        = ["https://localhost:3000/callback"]
  logout_urls                          = ["https://localhost:3000/logout"]

  # Security
  generate_secret               = false
  prevent_user_existence_errors = "ENABLED"
  enable_token_revocation       = true

  # Attributes
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

# Cognito User Pool Group
resource "aws_cognito_user_group" "group_user" {
  user_pool_id = aws_cognito_user_pool.main.id
  name         = "user"
  description  = "Group for Spot users"
  precedence   = 1
}
