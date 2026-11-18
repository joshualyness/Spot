locals {
  app_config = yamldecode(file(var.app_config_path))[var.environment_name]

  # All routes share the same tRPC Lambda; auth is handled inside tRPC.
  trpc_routes = [
    { name = "trpc-post-proxy", method = "POST", path = "/trpc/{proxy+}" },
    { name = "trpc-get-proxy", method = "GET", path = "/trpc/{proxy+}" },
    { name = "trpc-options-proxy", method = "OPTIONS", path = "/trpc/{proxy+}" },
    { name = "trpc-post", method = "POST", path = "/trpc" },
    { name = "trpc-get", method = "GET", path = "/trpc" },
  ]
}
