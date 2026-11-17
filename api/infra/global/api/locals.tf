locals {
  app_config = yamldecode(file(var.app_config_path))[var.environment_name]

  domain_name    = local.app_config.domain_name
  hosted_zone_id = local.app_config.hosted_zone_id

  # All routes share the same tRPC Lambda; auth is handled inside tRPC.
  trpc_routes = [
    { name = "trpc-post-proxy", method = "POST", path = "/trpc/{proxy+}" },
    { name = "trpc-get-proxy", method = "GET", path = "/trpc/{proxy+}" },
    { name = "trpc-options-proxy", method = "OPTIONS", path = "/trpc/{proxy+}" },
    { name = "trpc-post", method = "POST", path = "/trpc" },
    { name = "trpc-get", method = "GET", path = "/trpc" },
  ]
}
