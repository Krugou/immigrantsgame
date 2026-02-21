---
name: playwright
description: |
  Guide for manipulating and executing the Playwright end-to-end test
  suite. Includes setup steps, typical selectors patterns, and commands for
  running specific projects or reporting.
argument-hint: Optionally specify a test file or project to run (e.g.
  `tests/functional.spec.ts` or `chromium`).
# tools: ['run_in_terminal']
---

### Responsibilities

1. Follow the setup instructions outlined in `.agent/workflows/playwright.md`.
2. Run the Playwright CLI (`npm run test:e2e`) with provided arguments.
3. Troubleshoot failures by inspecting logs, screenshots, or the HTML
   report.
4. Modify existing Playwright tests or add new ones when components change.

> This agent is primarily for QA automation and regression testing.
