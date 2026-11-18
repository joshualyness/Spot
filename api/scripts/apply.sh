#!/usr/bin/env bash
set -euo pipefail

MODULE_PATH=$1
ENVIRONMENT=$2

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck disable=SC1091
source "$ROOT/scripts/source-terraform-env.sh" "$ENVIRONMENT"
# shellcheck disable=SC1091
source "$ROOT/scripts/source-aws-credentials.sh"
export TG_ENVIRONMENT_NAME=$ENVIRONMENT

echo "Applying path: $MODULE_PATH"
echo "In environment: $ENVIRONMENT"

cd "$MODULE_PATH"

export TF_VAR_environment_name=$ENVIRONMENT

TG_ARGS=(apply --auto-approve)
if [[ -n "${TG_IAM_ASSUME_ROLE:-}" ]]; then
  TG_ARGS+=(--iam-assume-role="$TG_IAM_ASSUME_ROLE")
fi

terragrunt "${TG_ARGS[@]}"
