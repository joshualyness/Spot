terraform {
  source = "."
}

dependency "dynamo" {
  config_path = "../../regional/dynamo"
  mock_outputs = {
    table_name = ""
  }
  mock_outputs_allowed_terraform_commands = ["init", "validate", "plan"]
}

inputs = {
  project_root        = "${get_terragrunt_dir()}/../../.."
  dynamodb_table_name = dependency.dynamo.outputs.table_name
}

include {
  path           = "${find_in_parent_folders("state.hcl")}"
  merge_strategy = "deep"
}
