output "api_gateway_execution_arn" {
  description = "Execution ARN of the API Gateway for IAM policies"
  value       = aws_apigatewayv2_api.api.execution_arn
}

output "api_gateway_id" {
  description = "ID of the API Gateway"
  value       = aws_apigatewayv2_api.api.id
}

output "api_gateway_arn" {
  description = "ARN of the API Gateway"
  value       = aws_apigatewayv2_api.api.arn
}

output "api_endpoint" {
  description = "Default HTTPS invoke URL for the HTTP API (no custom domain yet)"
  value       = aws_apigatewayv2_api.api.api_endpoint
}

output "trpc_url" {
  description = "tRPC base URL"
  value       = "${aws_apigatewayv2_api.api.api_endpoint}/trpc"
}
