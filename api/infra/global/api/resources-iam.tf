resource "aws_iam_role" "trpc_lambda_role" {
  name = "${var.environment_name}-lx-trpc"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      },
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_policy" "trpc_lambda_policy" {
  name        = "lambda-trpc-policy-${var.environment_name}"
  description = "Policy to allow tRPC Lambda to access DynamoDB and Logs"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow",
        Action = [
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem"
        ],
        Resource = [
          "arn:aws:dynamodb:${var.aws_region}:${var.aws_deployment_account_id}:table/${var.dynamodb_table_name}"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "trpc_lambda_policy_attachment" {
  role       = aws_iam_role.trpc_lambda_role.name
  policy_arn = aws_iam_policy.trpc_lambda_policy.arn
}

# authorizer

resource "aws_iam_role" "authorizer_lambda_exec" {
  name = "${var.environment_name}-authorizer-lambda-exec"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_policy" "authorizer_lambda_policy" {
  name        = "${var.environment_name}-authorizer-lambda-policy"
  description = "IAM policy for authorizer Lambda execution"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow",
        Action = [
          "cognito-idp:ListUsers"
        ],
        Resource = "arn:aws:cognito-idp:${var.aws_region}:${var.aws_deployment_account_id}:userpool/${var.cognito_user_pool_id}"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "authorizer_lambda_policy_attach" {
  role       = aws_iam_role.authorizer_lambda_exec.name
  policy_arn = aws_iam_policy.authorizer_lambda_policy.arn
}
