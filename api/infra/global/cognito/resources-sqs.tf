resource "aws_sqs_queue" "email_dlq" {
  name                      = "${local.email_queue_name}-dlq"
  message_retention_seconds = 1209600 # 14 days

  tags = {
    Name        = "${local.email_queue_name}-dlq"
    Environment = var.environment_name
  }
}

resource "aws_sqs_queue" "email_queue" {
  name                       = local.email_queue_name
  visibility_timeout_seconds = 60
  message_retention_seconds  = 86400 # 1 day

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.email_dlq.arn
    maxReceiveCount     = 3
  })

  tags = {
    Name        = local.email_queue_name
    Environment = var.environment_name
  }
}
