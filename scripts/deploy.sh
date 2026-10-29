#!/bin/sh
# Build the shell, copy shell + daemon to the phone, restart the session.
#   ./scripts/deploy.sh            # build + deploy
#   ./scripts/deploy.sh --no-build # skip `npm run build`
#
# Runs unattended (no passwords), given the one-time phone setup in
# docs/device.md → "Unattended deploys": key SSH, /opt/calm* owned by `user`,
# and a doas nopass rule for restarting tinydm.
set -eu

PHONE="${PHONE:-user@172.16.42.1}"
cd "$(dirname "$0")/.."

[ "${1:-}" = "--no-build" ] || npm run build

rsync_or_scp() { # src dest
  if command -v rsync >/dev/null && ssh "$PHONE" 'command -v rsync' >/dev/null; then
    rsync -a --delete "$1/" "$PHONE:$2/"
  else
    ssh "$PHONE" "rm -rf $2/*"
    scp -rq "$1/." "$PHONE:$2/"
  fi
}

rsync_or_scp dist /opt/calm
[ -d daemon ] && rsync_or_scp daemon /opt/calm-daemon

ssh "$PHONE" 'doas systemctl restart tinydm || doas systemctl start tinydm'

echo "Deployed. Logs: ssh $PHONE 'journalctl -u tinydm -b -f'"
