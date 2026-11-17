#!/usr/bin/env bash
export AWS_PROFILE="${AWS_PROFILE:-spot}"
unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN
export AWS_REGION="${AWS_REGION:-eu-west-2}"
export AWS_DEFAULT_REGION="${AWS_DEFAULT_REGION:-eu-west-2}"
export TF_VAR_assume_role_arn="${TF_VAR_assume_role_arn:-}"
export TG_IAM_ASSUME_ROLE="${TG_IAM_ASSUME_ROLE:-$TF_VAR_assume_role_arn}"
echo "Using AWS profile: $AWS_PROFILE (region: $AWS_REGION, assume role: ${TF_VAR_assume_role_arn:-none})"
