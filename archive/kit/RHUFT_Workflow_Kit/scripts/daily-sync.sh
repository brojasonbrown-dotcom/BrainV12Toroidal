#!/usr/bin/env bash
# Daily Sync Script — RHUFT v6.0
# Run manually or via cron to sync the local repo with the remote once per day.
# This script skips if a commit has been made within the last 24 hours.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# Ensure we are in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "[daily-sync] ERROR: Not a git repository."
  exit 1
fi

LAST_COMMIT_EPOCH=$(git log -1 --format=%ct)
NOW_EPOCH=$(date +%s)
DIFF=$((NOW_EPOCH - LAST_COMMIT_EPOCH))

if [ "$DIFF" -lt 86400 ]; then
  echo "[daily-sync] A commit was made ${DIFF}s ago (< 24h). Skipping automated sync."
  exit 0
fi

echo "[daily-sync] No commits in the last 24 hours. Running sync..."

# Pull latest changes from the current branch
git pull --rebase origin "$(git branch --show-current)"

# Run verification suite (customize as needed)
# npm ci
# npm run typecheck
# npm run test
# npm run lint

# Create daily sync marker
DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
echo "$DATE" > .last-auto-sync
git add .last-auto-sync

if git diff --cached --quiet; then
  echo "[daily-sync] No changes to commit."
else
  git commit -m "chore: daily sync marker [skip ci]"
  git push origin "$(git branch --show-current)"
  echo "[daily-sync] Sync complete at $DATE"
fi
