locals {
  app_config_path           = find_in_parent_folders("app-config.yml")
  module_path               = path_relative_to_include()
  aws_region                = "eu-west-2"
  aws_deployment_account_id = get_env("AWS_DEPLOYMENT_ACCOUNT_ID", "000000000000")
  aws_solution_name         = "spot-api"
  environment_name          = get_env("TG_ENVIRONMENT_NAME")
  state_file_name           = "terraform.tfstate"

  default_tags = {
    "spot:name"        = local.aws_solution_name
    "spot:environment" = local.environment_name
  }
}

# Separate cache per env so switching env never reuses another env's backend metadata.
download_dir = "${get_terragrunt_dir()}/.terragrunt-cache/${local.environment_name}"

inputs = {
  aws_region                = local.aws_region
  aws_deployment_account_id = local.aws_deployment_account_id
  aws_solution_name         = local.aws_solution_name
  environment_name          = local.environment_name
  resource_tags             = local.default_tags
  app_config_path           = local.app_config_path
}

# If a cache is reused anyway, rebind to this env's state key — never migrate.
terraform {
  extra_arguments "reconfigure_backend" {
    commands  = ["init"]
    arguments = ["-reconfigure"]
  }
}

remote_state {
  backend = "s3"

  config = {
    bucket              = "${local.aws_solution_name}-terraform-state"
    key                 = "${local.environment_name}/${local.aws_solution_name}/${local.aws_deployment_account_id}/${local.module_path}/${local.aws_region}${local.state_file_name}"
    region              = local.aws_region
    encrypt             = true
    dynamodb_table      = "${local.aws_solution_name}-terraform-state-lock"
    s3_bucket_tags      = local.default_tags
    dynamodb_table_tags = local.default_tags
  }
}
