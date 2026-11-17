data "archive_file" "trpc_lambda_zip" {
  type             = "zip"
  source_file      = "${var.project_root}/dist/lambdas/trpc/index.js"
  output_path      = "${var.project_root}/dist/lambdas/trpc/trpc.zip"
  output_file_mode = "0666"
}

data "archive_file" "authorizer_lambda_zip" {
  type             = "zip"
  source_file      = "${var.project_root}/dist/lambdas/authorizer/index.js"
  output_path      = "${var.project_root}/dist/lambdas/authorizer/authorizer.zip"
  output_file_mode = "0666"
}

locals {
  trpc_lambda_env = {
    DYNAMODB_TABLE_NAME = var.dynamodb_table_name
    USER_POOL_ID        = var.cognito_user_pool_id
    ISSUER_URL          = var.cognito_domain_idp_url
    JKWS_URI            = "${var.cognito_domain_idp_url}/.well-known/jwks.json"
    APP_LINK_BASE       = "spot://"
  }
}

resource "aws_lambda_function" "trpc" {
  function_name    = "spot-trpc-${var.environment_name}"
  role             = aws_iam_role.trpc_lambda_role.arn
  runtime          = "nodejs24.x"
  handler          = "index.handler"
  filename         = data.archive_file.trpc_lambda_zip.output_path
  source_code_hash = data.archive_file.trpc_lambda_zip.output_base64sha256
  timeout          = 30
  memory_size      = 128

  environment {
    variables = local.trpc_lambda_env
  }
}

resource "aws_lambda_function" "api_authorizer" {
  function_name = "spot-authorizer-${var.environment_name}"
  role          = aws_iam_role.authorizer_lambda_exec.arn
  runtime       = "nodejs24.x"
  handler       = "index.handler"

  filename         = data.archive_file.authorizer_lambda_zip.output_path
  source_code_hash = data.archive_file.authorizer_lambda_zip.output_base64sha256

  environment {
    variables = {
      ISSUER_URL   = var.cognito_domain_idp_url
      JKWS_URI     = "${var.cognito_domain_idp_url}/.well-known/jwks.json"
      USER_POOL_ID = var.cognito_user_pool_id
    }
  }
}
