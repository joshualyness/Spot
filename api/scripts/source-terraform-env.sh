#!/usr/bin/env bash
# Load repo-root env file for the target Terraform/Terragrunt environment.
# Usage: source "$ROOT/scripts/source-terraform-env.sh" "$ENVIRONMENT"

set -euo pipefail

ENVIRONMENT="${1:?environment name required (e.g. dev, staging, production)}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

ENV_FILE=""
case "$ENVIRONMENT" in
    staging)
        ENV_FILE="$ROOT/.env.staging"
        ;;
    production|prod)
        ENV_FILE="$ROOT/.env.production"
        ;;
    dev)
        ENV_FILE="$ROOT/.env.dev"
        ;;
    *)
        echo "source-terraform-env: unknown environment '$ENVIRONMENT' (use dev, staging, or production)" >&2
        exit 1
        ;;
esac

if [[ -f "$ENV_FILE" ]]; then
    set -a
    # shellcheck disable=SC1090
    source "$ENV_FILE"
    set +a
    echo "Loaded Terraform-related env from $ENV_FILE"
else
    echo "Warning: no env file at $ENV_FILE — create repo-root .env.dev, .env.staging, or .env.production" >&2
fi

# Pin env after sourcing so leftover shell / .env values cannot drift state vs names.
export TG_ENVIRONMENT_NAME="$ENVIRONMENT"
export TF_VAR_environment_name="$ENVIRONMENT"
export TERRAGRUNT_DOWNLOAD="$ROOT/infra/.terragrunt-cache/${ENVIRONMENT}"

