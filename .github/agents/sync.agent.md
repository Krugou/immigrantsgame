---
name: sync
description: |
  Simple helper to commit and push workspace changes, including submodules. Ideal for quick
  synchronization after running tests or applying fixes.
argument-hint: Optional commit message (defaults to "chore: sync workspace").
# tools: ['run_in_terminal']
---

### Responsibilities

1. Stage all modified files (`git add .`).
2. Stage and commit changes in all submodules (`git submodule foreach git add . && git submodule foreach git commit -m "sync submodule" || true`).
3. Create a commit with the supplied message or the default.
4. Push the current branch to origin.
5. Push submodule changes (`git submodule foreach git push || true`).

> Use this when you want to make sure remote reflects local edits and submodule changes before
> switching context or opening a pull request.
