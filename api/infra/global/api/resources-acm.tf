resource "aws_acm_certificate" "api_certificate" {
  domain_name       = local.domain_name
  validation_method = "DNS"
}
