# Output important values
output "cognito_user_pool_id" {
  description = "ID of the Cognito User Pool"
  value       = aws_cognito_user_pool.main.id
}

output "cognito_user_pool_client_id" {
  description = "ID of the Cognito User Pool Client"
  value       = aws_cognito_user_pool_client.main.id
}

output "cognito_user_pool_endpoint" {
  description = "Endpoint name of the Cognito User Pool"
  value       = aws_cognito_user_pool.main.endpoint
}

output "cognito_user_pool_arn" {
  description = "ARN of the Cognito User Pool"
  value       = aws_cognito_user_pool.main.arn
}

output "cognito_domain_idp_url" {
  description = "URL of the Cognito IDP"
  value       = "https://cognito-idp.${var.aws_region}.amazonaws.com/${aws_cognito_user_pool.main.id}"
}

output "email_queue_url" {
  description = "SQS queue URL for app emails"
  value       = aws_sqs_queue.email_queue.url
}

output "email_queue_arn" {
  description = "SQS queue ARN for app emails"
  value       = aws_sqs_queue.email_queue.arn
}

output "ses_from_email" {
  description = "From address placeholder for future SES custom email sender"
  value       = local.ses_from_email
}

output "cognito_email_kms_key_arn" {
  description = "KMS key ARN reserved for Cognito custom email sender codes"
  value       = aws_kms_key.cognito_email.arn
}
