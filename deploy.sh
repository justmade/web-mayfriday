#!/usr/bin/env bash
set -euo pipefail

: "${DEPLOY_HOST:?Set DEPLOY_HOST to the ECS public IP or hostname}"

DEPLOY_USER="${DEPLOY_USER:-root}"
DEPLOY_SSH_PORT="${DEPLOY_SSH_PORT:-22}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/web-mayfriday}"
DEPLOY_KEY_PATH="${DEPLOY_KEY_PATH:-}"

if [[ ! "$DEPLOY_HOST" =~ ^[A-Za-z0-9.-]+$ ]]; then
  echo "DEPLOY_HOST contains unsupported characters" >&2
  exit 1
fi
if [[ ! "$DEPLOY_USER" =~ ^[A-Za-z0-9._-]+$ ]]; then
  echo "DEPLOY_USER contains unsupported characters" >&2
  exit 1
fi
if [[ ! "$DEPLOY_SSH_PORT" =~ ^[0-9]+$ ]]; then
  echo "DEPLOY_SSH_PORT must be numeric" >&2
  exit 1
fi
if [[ ! "$DEPLOY_PATH" =~ ^/var/www/[A-Za-z0-9._/-]+$ ]]; then
  echo "DEPLOY_PATH must be an explicit directory below /var/www" >&2
  exit 1
fi
if [[ -n "$DEPLOY_KEY_PATH" ]]; then
  if [[ ! "$DEPLOY_KEY_PATH" =~ ^[A-Za-z0-9._/-]+$ ]]; then
    echo "DEPLOY_KEY_PATH contains unsupported characters" >&2
    exit 1
  fi
  if [[ ! -f "$DEPLOY_KEY_PATH" ]]; then
    echo "DEPLOY_KEY_PATH does not exist: $DEPLOY_KEY_PATH" >&2
    exit 1
  fi
fi

remote="${DEPLOY_USER}@${DEPLOY_HOST}"
ssh_transport="ssh -o StrictHostKeyChecking=accept-new -p ${DEPLOY_SSH_PORT}"
ssh_args=(-o StrictHostKeyChecking=accept-new -p "$DEPLOY_SSH_PORT")
if [[ -n "$DEPLOY_KEY_PATH" ]]; then
  ssh_transport+=" -i ${DEPLOY_KEY_PATH}"
  ssh_args+=(-i "$DEPLOY_KEY_PATH")
fi

ssh "${ssh_args[@]}" "$remote" \
  "mkdir -p '$DEPLOY_PATH/dist' '$DEPLOY_PATH/app' /var/log/pm2 && \
   if [ ! -f '$DEPLOY_PATH/app/.env' ]; then \
     echo 'Missing $DEPLOY_PATH/app/.env. Create it with mode 600 before the first deployment.' >&2; \
     exit 1; \
   fi && \
   chmod 600 '$DEPLOY_PATH/app/.env'"

npm run build

rsync -avz --delete --exclude='.DS_Store' \
  -e "$ssh_transport" dist/ "$remote:$DEPLOY_PATH/dist/"

rsync -avz --delete --exclude='.DS_Store' \
  -e "$ssh_transport" api/ "$remote:$DEPLOY_PATH/app/api/"
rsync -avz --delete --exclude='.DS_Store' \
  -e "$ssh_transport" shared/ "$remote:$DEPLOY_PATH/app/shared/"
rsync -avz \
  -e "$ssh_transport" \
  server.js package.json package-lock.json ecosystem.config.cjs \
  "$remote:$DEPLOY_PATH/app/"

ssh "${ssh_args[@]}" "$remote" \
  "cd '$DEPLOY_PATH/app' && npm ci --omit=dev --registry=https://registry.npmmirror.com && \
   APP_DIR='$DEPLOY_PATH/app' DIST_DIR='$DEPLOY_PATH/dist' \
   pm2 startOrReload ecosystem.config.cjs --update-env && pm2 save"

echo "Deployment completed. Verify https://your-domain/healthz before switching DNS."
