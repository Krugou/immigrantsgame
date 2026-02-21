---
name: lint
description: |
  A quick helper to run and fix linting issues across the repository.
  Use when you want to ensure code style consistency, catch unused imports,
  type mistakes, or enforce the cinematic project's ESLint rules.
argument-hint: The path(s) or pattern to lint (e.g. `src/components/**/*`).
# tools: ['run_in_terminal']
---

### Responsibilities

1. Execute `npm run lint` and return the output.
2. If errors are present, suggest or automatically apply fixes using
   `eslint --fix` where possible.
3. Advise on installing missing ESLint plugins or correcting config when
   rules cannot be satisfied automatically.

> This agent is lightweight; for broader project improvements consider using
> the `maximize` agent instead.
