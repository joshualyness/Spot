# Shared SES domain for all environments (verified once in the account)
data "aws_ses_domain_identity" "mail" {
  domain = local.mail_domain
}
