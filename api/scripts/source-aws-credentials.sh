#!/usr/bin/env bash
# Same account/profile pattern as Sites/ninety-two — deploy as joshualyness (no assume-role).

export AWS_PROFILE="${AWS_PROFILE:-joshualyness}"
export AWS_SDK_LOAD_CONFIG=1

# Prefer profile credentials over any leftover static keys in the shell.
unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN

export AWS_REGION="${AWS_REGION:-eu-west-1}"
export AWS_DEFAULT_REGION="${AWS_DEFAULT_REGION:-eu-west-1}"

# ninety-two style: call AWS directly with the profile (no pipeline assume-role).
export TF_VAR_assume_role_arn="${TF_VAR_assume_role_arn:-}"
export TG_IAM_ASSUME_ROLE="${TG_IAM_ASSUME_ROLE:-}"

export AWS_DEPLOYMENT_ACCOUNT_ID="${AWS_DEPLOYMENT_ACCOUNT_ID:-699764791980}"

echo "Using AWS profile: $AWS_PROFILE (region: $AWS_REGION, account: $AWS_DEPLOYMENT_ACCOUNT_ID, assume role: ${TF_VAR_assume_role_arn:-none})"
