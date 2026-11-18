resource "aws_apigatewayv2_api" "api" {
  name          = "api-${var.environment_name}"
  protocol_type = "HTTP"

  cors_configuration {
    allow_headers = ["authorization", "content-type"]
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_origins = ["*"]
  }
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_access_logs.arn
    format = jsonencode({
      requestId       = "$context.requestId",
      ip              = "$context.identity.sourceIp",
      requestTime     = "$context.requestTime",
      httpMethod      = "$context.httpMethod",
      routeKey        = "$context.routeKey",
      status          = "$context.status",
      protocol        = "$context.protocol",
      responseLength  = "$context.responseLength",
      errorMessage    = "$context.error.message",
      errorType       = "$context.error.responseType",
      authorizerError = "$context.authorizer.error"
    })
  }
}

resource "aws_apigatewayv2_integration" "trpc" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.trpc.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "trpc" {
  for_each = {
    for route in local.trpc_routes : route.name => route
  }

  api_id    = aws_apigatewayv2_api.api.id
  route_key = "${each.value.method} ${each.value.path}"
  target    = "integrations/${aws_apigatewayv2_integration.trpc.id}"

  # Auth is handled inside tRPC
  authorization_type = "NONE"
}

resource "aws_apigatewayv2_authorizer" "lambda_authorizer" {
  api_id                            = aws_apigatewayv2_api.api.id
  name                              = "lambda-authorizer-${var.environment_name}"
  authorizer_type                   = "REQUEST"
  identity_sources                  = ["$request.header.Authorization"]
  authorizer_uri                    = aws_lambda_function.api_authorizer.invoke_arn
  authorizer_payload_format_version = "2.0"
  enable_simple_responses           = true
}

resource "aws_lambda_permission" "api_gateway_trpc" {
  statement_id  = "AllowAPIGatewayInvoke-trpc-${var.environment_name}"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.trpc.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "api_gateway_authorizer_permission" {
  statement_id  = "AllowAPIGatewayInvokeAuthorizer"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_authorizer.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

resource "aws_cloudwatch_log_group" "api_access_logs" {
  name              = "/aws/apigateway/spot-${var.environment_name}-access-logs"
  retention_in_days = 7
}
