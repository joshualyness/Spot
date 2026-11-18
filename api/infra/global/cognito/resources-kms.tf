resource "aws_kms_key" "cognito_email" {
  description             = "Encrypts Cognito verification codes for custom email sender (${var.environment_name})"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  policy = jsonencode({
    Version = "2012-10-17"
    Id      = "cognito-email-sender-${var.environment_name}"
    Statement = [
      {
        Sid    = "EnableRootAccountAdministration"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action   = "kms:*"
        Resource = "*"
      },
      {
        Sid    = "AllowCognitoToUseKey"
        Effect = "Allow"
        Principal = {
          Service = "cognito-idp.amazonaws.com"
        }
        Action = [
          "kms:CreateGrant",
          "kms:DescribeKey"
        ]
        Resource = "*"
        Condition = {
          StringEquals = {
            "aws:SourceAccount" = data.aws_caller_identity.current.account_id
          }
        }
      }
    ]
  })

  tags = {
    Name        = "cognito-email-${var.environment_name}"
    Environment = var.environment_name
  }
}

resource "aws_kms_alias" "cognito_email" {
  name          = "alias/cognito-email-${var.environment_name}"
  target_key_id = aws_kms_key.cognito_email.key_id
}
