variable "project_root" {
  description = "Absolute path to the project root (contains dist/)"
  type        = string
}

variable "environment_name" {
  type = string

  validation {
    condition     = contains(["dev", "staging", "production"], var.environment_name)
    error_message = "environment_name must be dev, staging, or production."
  }
}

variable "aws_deployment_account_id" {
  type = string
}

variable "app_config_path" {
  type = string
}

variable "assume_role_arn" {
  type    = string
  default = ""
}

variable "resource_tags" {
  type = map(string)
}

variable "aws_solution_name" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "cognito_user_pool_id" {
  description = "ID of the Cognito User Pool"
  type        = string
}

variable "cognito_user_pool_client_id" {
  description = "ID of the Cognito User Pool Client"
  type        = string
}

variable "cognito_domain_idp_url" {
  description = "URL of the Cognito IDP"
  type        = string
}

variable "dynamodb_table_name" {
  description = "Name of the DynamoDB table"
  type        = string
}
