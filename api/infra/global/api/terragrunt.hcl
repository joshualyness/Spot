terraform {
  source = "."
}

dependency "cognito" {
  config_path = "../cognito"
  mock_outputs = {
    cognito_user_pool_id        = ""
    cognito_user_pool_client_id = ""
    cognito_domain_idp_url      = ""
  }
  mock_outputs_allowed_terraform_commands = ["init", "validate", "plan"]
}

dependency "dynamo" {
  config_path = "../../regional/dynamo"
  mock_outputs = {
    table_name = ""
  }
  mock_outputs_allowed_terraform_commands = ["init", "validate", "plan"]
}

inputs = {
  project_root                = "${get_terragrunt_dir()}/../../.."
  dynamodb_table_name         = dependency.dynamo.outputs.table_name
  cognito_user_pool_id        = dependency.cognito.outputs.cognito_user_pool_id
  cognito_user_pool_client_id = dependency.cognito.outputs.cognito_user_pool_client_id
  cognito_domain_idp_url      = dependency.cognito.outputs.cognito_domain_idp_url
}

include {
  path           = "${find_in_parent_folders("state.hcl")}"
  merge_strategy = "deep"
}
