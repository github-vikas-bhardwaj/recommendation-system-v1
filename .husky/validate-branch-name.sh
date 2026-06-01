#!/usr/bin/env sh
set -e

# Block direct commits on protected branches; require type/kebab-case on all others
BRANCH="$(git branch --show-current 2>/dev/null || true)"

if [ -z "$BRANCH" ]; then
  echo "⚠️  Not on a named branch (detached HEAD). Skipping branch name check."
  exit 0
fi

case "$BRANCH" in
  main | master | develop | staging)
    echo "❌ Direct commits to \"$BRANCH\" are not allowed."
    echo ""
    echo "Create a branch from $BRANCH, commit there, then open a PR:"
    echo "  git checkout -b feat/your-kebab-case-description"
    echo ""
    echo "Or rename your current work onto a valid branch:"
    echo "  git checkout -b feat/your-kebab-case-description"
    exit 1
    ;;
esac

PATTERN='^(feat|fix|refactor|tests|chore|docs|ci|hotfix|perf)/[a-z0-9]+(-[a-z0-9]+)*$'

if printf '%s\n' "$BRANCH" | grep -Eq "$PATTERN"; then
  exit 0
fi

echo "❌ Invalid branch name: \"$BRANCH\""
echo ""
echo "Use: <type>/<kebab-case-description>"
echo "  Types: feat, fix, refactor, tests, chore, docs, ci, hotfix, perf"
echo "  Slug:  lowercase letters, numbers, hyphens only (no underscores)"
echo ""
echo "Examples:"
echo "  feat/add-user-recommendations"
echo "  fix/handle-empty-cart"
echo "  refactor/split-recommendation-service"
echo "  tests/api-recommendation-flow"
echo ""
echo "No direct commits on: main, master, develop, staging"
echo ""
echo "Rename this branch (run locally; hooks are not enforced on the server):"
echo "  git branch -m $BRANCH feat/your-kebab-case-description"
echo "  # already on \"$BRANCH\"? omit the old name:"
echo "  git branch -m feat/your-kebab-case-description"
echo ""
echo "If you already pushed \"$BRANCH\" to the remote:"
echo "  git branch -m feat/your-kebab-case-description"
echo "  git push origin -u feat/your-kebab-case-description"
echo "  git push origin --delete $BRANCH"
exit 1
