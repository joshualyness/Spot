locals {
  # Cognito uses COGNITO_DEFAULT email until an SES identity is verified in this account/region.
  # Custom email-sender Lambda remains deployed for later SES wiring.
  ses_from_email = "Spot <noreply@spot.local>"

  email_sender_lambda_name = "email-sender-${var.environment_name}"
  email_queue_name         = "email-queue-${var.environment_name}"

  # Wildcard ARN avoids cycle: pool -> permission -> pool
  cognito_lambda_source_arn = "arn:aws:cognito-idp:${var.aws_region}:${data.aws_caller_identity.current.account_id}:userpool/*"

  project_root = var.project_root
}
