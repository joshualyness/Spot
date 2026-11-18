variable "environment_name" {
  type = string

  validation {
    condition     = contains(["dev", "staging", "production"], var.environment_name)
    error_message = "environment_name must be dev, staging, or production."
  }
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

variable "dynamodb_table_name" {
  description = "Name of the DynamoDB table for user profiles"
  type        = string
}

variable "project_root" {
  description = "Absolute path to the project root (contains dist/lambdas)"
  type        = string
}
