locals {
  app_config = yamldecode(file(var.app_config_path))[var.environment_name]
}
