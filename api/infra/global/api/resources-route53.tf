resource "aws_route53_record" "api_record" {
  for_each = { for idx, config in aws_apigatewayv2_domain_name.custom_domain.domain_name_configuration : idx => config }

  zone_id = local.hosted_zone_id
  name    = aws_apigatewayv2_domain_name.custom_domain.domain_name
  type    = "A"

  alias {
    name                   = each.value.target_domain_name
    zone_id                = each.value.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "api_certificate_validation" {
  for_each = {
    for dvo in aws_acm_certificate.api_certificate.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
    }

    if dvo.domain_name == local.domain_name
  }

  name            = each.value.name
  type            = "CNAME"
  zone_id         = local.hosted_zone_id
  records         = [each.value.record]
  ttl             = 60
  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "api_certificate_validation_wait" {
  certificate_arn = aws_acm_certificate.api_certificate.arn

  depends_on = [
    aws_route53_record.api_certificate_validation,
  ]
}
