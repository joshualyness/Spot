locals {
  cognito_management_trail_name = "cognito-management-events-${var.environment_name}"
  cognito_management_trail_arn  = "arn:aws:cloudtrail:${var.aws_region}:${data.aws_caller_identity.current.account_id}:trail/${local.cognito_management_trail_name}"
}

resource "aws_s3_bucket" "cognito_management_events" {
  bucket = "spot-cognito-events-${data.aws_caller_identity.current.account_id}-${var.environment_name}"

  tags = {
    Name        = "spot-cognito-events-${var.environment_name}"
    Environment = var.environment_name
  }
}

resource "aws_s3_bucket_public_access_block" "cognito_management_events" {
  bucket = aws_s3_bucket.cognito_management_events.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "cognito_management_events" {
  bucket = aws_s3_bucket.cognito_management_events.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "cognito_management_events" {
  bucket = aws_s3_bucket.cognito_management_events.id

  rule {
    id     = "expire-cognito-management-events"
    status = "Enabled"

    filter {}

    expiration {
      days = 30
    }
  }
}

resource "aws_s3_bucket_policy" "cognito_management_events" {
  bucket = aws_s3_bucket.cognito_management_events.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AWSCloudTrailAclCheck"
        Effect    = "Allow"
        Principal = { Service = "cloudtrail.amazonaws.com" }
        Action    = "s3:GetBucketAcl"
        Resource  = aws_s3_bucket.cognito_management_events.arn
        Condition = {
          StringEquals = {
            "aws:SourceArn" = local.cognito_management_trail_arn
          }
        }
      },
      {
        Sid       = "AWSCloudTrailWrite"
        Effect    = "Allow"
        Principal = { Service = "cloudtrail.amazonaws.com" }
        Action    = "s3:PutObject"
        Resource  = "${aws_s3_bucket.cognito_management_events.arn}/AWSLogs/${data.aws_caller_identity.current.account_id}/*"
        Condition = {
          StringEquals = {
            "s3:x-amz-acl"  = "bucket-owner-full-control"
            "aws:SourceArn" = local.cognito_management_trail_arn
          }
        }
      }
    ]
  })
}

resource "aws_cloudtrail" "cognito_management_events" {
  name                          = local.cognito_management_trail_name
  s3_bucket_name                = aws_s3_bucket.cognito_management_events.id
  include_global_service_events = false
  is_multi_region_trail         = false
  enable_logging                = true

  event_selector {
    read_write_type           = "WriteOnly"
    include_management_events = true
  }

  depends_on = [aws_s3_bucket_policy.cognito_management_events]

  tags = {
    Name        = local.cognito_management_trail_name
    Environment = var.environment_name
  }
}

resource "aws_cloudwatch_event_rule" "email_authorised" {
  name        = "cognito-email-authorised-${var.environment_name}"
  description = "Invokes the email synchroniser after a user verifies a changed email address"

  event_pattern = jsonencode({
    source      = ["aws.cognito-idp"]
    detail-type = ["AWS API Call via CloudTrail"]
    detail = {
      eventSource = ["cognito-idp.amazonaws.com"]
      eventName   = ["VerifyUserAttribute"]
      errorCode   = [{ exists = false }]
      requestParameters = {
        attributeName = ["email"]
      }
    }
  })

  depends_on = [aws_cloudtrail.cognito_management_events]

  tags = {
    Name        = "cognito-email-authorised-${var.environment_name}"
    Environment = var.environment_name
  }
}

resource "aws_cloudwatch_event_target" "email_authorised" {
  rule      = aws_cloudwatch_event_rule.email_authorised.name
  target_id = "CognitoEmailAuthorisedLambda"
  arn       = aws_lambda_function.email_authorised.arn
}

resource "aws_lambda_permission" "email_authorised_eventbridge" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.email_authorised.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.email_authorised.arn
}
