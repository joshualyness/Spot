terraform {
  source = "."
}

include {
  path           = "${find_in_parent_folders("state.hcl")}"
  merge_strategy = "deep"
}
