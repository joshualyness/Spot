# Cognito Post Confirmation Lambda
data "aws_caller_identity" "current" {}

locals {
  post_confirmation_lambda_name = "cognito-post-user-confirmation-${var.environment_name}"
  post_confirmation_lambda_env = {
    DYNAMODB_TABLE_NAME = var.dynamodb_table_name
  }

  email_authorised_lambda_name = "cognito-email-authorised-${var.environment_name}"
  email_authorised_lambda_env = {
    DYNAMODB_TABLE_NAME = var.dynamodb_table_name
    USER_POOL_ID        = aws_cognito_user_pool.main.id
  }

  email_sender_lambda_env = {
    SES_FROM_EMAIL  = local.ses_from_email
    APP_LINK_BASE   = "spot://"
    EMAIL_QUEUE_URL = aws_sqs_queue.email_queue.url
    KEY_ID          = aws_kms_key.cognito_email.arn
    KEY_ARN         = aws_kms_key.cognito_email.arn
  }
}

resource "aws_iam_role" "post_confirmation_role" {
  name = "${local.post_confirmation_lambda_name}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "${local.post_confirmation_lambda_name}-role"
    Environment = var.environment_name
  }
}

resource "aws_iam_policy" "post_confirmation_policy" {
  name = "${local.post_confirmation_lambda_name}-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "cognito-idp:AdminAddUserToGroup",
          "cognito-idp:AdminUpdateUserAttributes"
        ]
        Resource = local.cognito_lambda_source_arn
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem"
        ]
        Resource = "arn:aws:dynamodb:${var.aws_region}:*:table/${var.dynamodb_table_name}"
      }
    ]
  })

  tags = {
    Name        = "${local.post_confirmation_lambda_name}-policy"
    Environment = var.environment_name
  }
}

resource "aws_iam_role_policy_attachment" "post_confirmation_policy_attachment" {
  role       = aws_iam_role.post_confirmation_role.name
  policy_arn = aws_iam_policy.post_confirmation_policy.arn
}

resource "aws_cloudwatch_log_group" "post_confirmation_logs" {
  name              = "/aws/lambda/${local.post_confirmation_lambda_name}"
  retention_in_days = 14

  tags = {
    Name        = "${local.post_confirmation_lambda_name}-logs"
    Environment = var.environment_name
  }
}

data "archive_file" "post_confirmation_zip" {
  type             = "zip"
  source_file      = "${var.project_root}/dist/lambdas/cognito-post-user-confirmation/index.js"
  output_path      = "${var.project_root}/dist/lambdas/cognito-post-user-confirmation/cognito-post-user-confirmation.zip"
  output_file_mode = "0666"
}

resource "aws_lambda_function" "post_confirmation" {
  function_name = local.post_confirmation_lambda_name
  role          = aws_iam_role.post_confirmation_role.arn
  runtime       = "nodejs24.x"
  handler       = "index.handler"
  timeout       = 10
  memory_size   = 128

  filename         = data.archive_file.post_confirmation_zip.output_path
  source_code_hash = data.archive_file.post_confirmation_zip.output_base64sha256

  environment {
    variables = local.post_confirmation_lambda_env
  }

  depends_on = [
    aws_cloudwatch_log_group.post_confirmation_logs,
    aws_iam_role_policy_attachment.post_confirmation_policy_attachment
  ]

  tags = {
    Name        = local.post_confirmation_lambda_name
    Environment = var.environment_name
  }
}

resource "aws_lambda_permission" "post_confirmation_cognito" {
  statement_id  = "AllowExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.post_confirmation.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = local.cognito_lambda_source_arn
}

# ---------------------------------------------------------------------------
# Verified email synchroniser — invoked by EventBridge after VerifyUserAttribute
# ---------------------------------------------------------------------------

resource "aws_iam_role" "email_authorised_role" {
  name = "${local.email_authorised_lambda_name}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "${local.email_authorised_lambda_name}-role"
    Environment = var.environment_name
  }
}

resource "aws_iam_policy" "email_authorised_policy" {
  name = "${local.email_authorised_lambda_name}-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect   = "Allow"
        Action   = ["cognito-idp:ListUsers"]
        Resource = aws_cognito_user_pool.main.arn
      },
      {
        Effect   = "Allow"
        Action   = ["dynamodb:UpdateItem"]
        Resource = "arn:aws:dynamodb:${var.aws_region}:${data.aws_caller_identity.current.account_id}:table/${var.dynamodb_table_name}"
      }
    ]
  })

  tags = {
    Name        = "${local.email_authorised_lambda_name}-policy"
    Environment = var.environment_name
  }
}

resource "aws_iam_role_policy_attachment" "email_authorised_policy_attachment" {
  role       = aws_iam_role.email_authorised_role.name
  policy_arn = aws_iam_policy.email_authorised_policy.arn
}

resource "aws_cloudwatch_log_group" "email_authorised_logs" {
  name              = "/aws/lambda/${local.email_authorised_lambda_name}"
  retention_in_days = 14

  tags = {
    Name        = "${local.email_authorised_lambda_name}-logs"
    Environment = var.environment_name
  }
}

data "archive_file" "email_authorised_zip" {
  type             = "zip"
  source_file      = "${local.project_root}/dist/lambdas/cognito-email-authorised/index.js"
  output_path      = "${local.project_root}/dist/lambdas/cognito-email-authorised/cognito-email-authorised.zip"
  output_file_mode = "0666"
}

resource "aws_lambda_function" "email_authorised" {
  function_name = local.email_authorised_lambda_name
  role          = aws_iam_role.email_authorised_role.arn
  runtime       = "nodejs24.x"
  handler       = "index.handler"
  timeout       = 10
  memory_size   = 128

  filename         = data.archive_file.email_authorised_zip.output_path
  source_code_hash = data.archive_file.email_authorised_zip.output_base64sha256

  environment {
    variables = local.email_authorised_lambda_env
  }

  depends_on = [
    aws_cloudwatch_log_group.email_authorised_logs,
    aws_iam_role_policy_attachment.email_authorised_policy_attachment
  ]

  tags = {
    Name        = local.email_authorised_lambda_name
    Environment = var.environment_name
  }
}

# ---------------------------------------------------------------------------
# Email sender — Cognito Custom Email Sender (decrypt + SES) + SQS
# ---------------------------------------------------------------------------

resource "aws_iam_role" "email_sender_role" {
  name = "${local.email_sender_lambda_name}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "${local.email_sender_lambda_name}-role"
    Environment = var.environment_name
  }
}

resource "aws_iam_policy" "email_sender_policy" {
  name = "${local.email_sender_lambda_name}-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "ses:SendEmail",
          "ses:SendRawEmail"
        ]
        # Broad until a verified SES identity/domain is attached for Spot.
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "kms:Decrypt",
          "kms:DescribeKey"
        ]
        Resource = aws_kms_key.cognito_email.arn
      },
      {
        Effect = "Allow"
        Action = [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ]
        Resource = aws_sqs_queue.email_queue.arn
      }
    ]
  })

  tags = {
    Name        = "${local.email_sender_lambda_name}-policy"
    Environment = var.environment_name
  }
}

resource "aws_iam_role_policy_attachment" "email_sender_policy_attachment" {
  role       = aws_iam_role.email_sender_role.name
  policy_arn = aws_iam_policy.email_sender_policy.arn
}

resource "aws_cloudwatch_log_group" "email_sender_logs" {
  name              = "/aws/lambda/${local.email_sender_lambda_name}"
  retention_in_days = 14

  tags = {
    Name        = "${local.email_sender_lambda_name}-logs"
    Environment = var.environment_name
  }
}

data "archive_file" "email_sender_zip" {
  type             = "zip"
  source_file      = "${local.project_root}/dist/lambdas/email-sender/index.js"
  output_path      = "${local.project_root}/dist/lambdas/email-sender/email-sender.zip"
  output_file_mode = "0666"
}

resource "aws_lambda_function" "email_sender" {
  function_name = local.email_sender_lambda_name
  role          = aws_iam_role.email_sender_role.arn
  runtime       = "nodejs24.x"
  handler       = "index.handler"
  timeout       = 30
  memory_size   = 512

  filename         = data.archive_file.email_sender_zip.output_path
  source_code_hash = data.archive_file.email_sender_zip.output_base64sha256

  environment {
    variables = local.email_sender_lambda_env
  }

  depends_on = [
    aws_cloudwatch_log_group.email_sender_logs,
    aws_iam_role_policy_attachment.email_sender_policy_attachment
  ]

  tags = {
    Name        = local.email_sender_lambda_name
    Environment = var.environment_name
  }
}

resource "aws_lambda_permission" "email_sender_cognito" {
  statement_id  = "AllowExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.email_sender.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = local.cognito_lambda_source_arn
}

resource "aws_lambda_event_source_mapping" "email_sender_sqs" {
  event_source_arn = aws_sqs_queue.email_queue.arn
  function_name    = aws_lambda_function.email_sender.arn
  batch_size       = 1
  enabled          = true
}
