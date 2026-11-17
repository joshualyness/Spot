locals {
  # Placeholder SES identity — verify in SES (eu-west-2) before deploy
  mail_domain    = "example.com"
  ses_from_email = "Spot <noreply@example.com>"

  email_sender_lambda_name = "email-sender-${var.environment_name}"
  email_queue_name         = "email-queue-${var.environment_name}"

  # Wildcard ARN avoids cycle: pool -> permission -> pool
  cognito_lambda_source_arn = "arn:aws:cognito-idp:${var.aws_region}:${data.aws_caller_identity.current.account_id}:userpool/*"

  project_root = var.project_root
}
