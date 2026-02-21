---
description: Check for missing translation keys across all locales
---

// turbo

1. Run the translation check script using ts-node:

```bash
npx ts-node scripts/check-translations.ts
```

2. If the command fails, examine the output to identify which keys are missing in which locale files.
3. Update the `src/locales/<locale>/translation.json` files to include the missing keys.
