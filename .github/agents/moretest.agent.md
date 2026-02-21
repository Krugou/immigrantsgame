---
name: moretest
description: |
  This agent runs miscellaneous or bespoke test commands that fall outside the
  standard Vitest/Playwright suites. Examples include profiling builds, running
  custom smoke tests, or executing once-off scripts during debugging.
argument-hint: The npm script or shell command to execute, e.g. `npm run lint`
# tools: ['run_in_terminal']
---

### Usage

1. Provide a command line string in the input when invoking the agent.
2. The agent will run the command in the workspace root and capture output.
3. It is intended for ad‑hoc operations; for regular testing use the `playwright`
   or `lint` agents instead.

> This agent simplifies experimentation and quick sanity checks without
> modifying package.json or other configuration files.
