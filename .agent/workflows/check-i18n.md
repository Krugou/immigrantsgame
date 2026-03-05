---
description: Check for missing translation keys across all locales
---

// turbo

1. Run the translation check script using ts-node:

```bash
npx ts-node scripts/check-translations.ts
```

The script will now auto‑add any missing keys it discovers to each locale’s translation.json, using the key text for English and empty/English placeholders for other languages.

1. On a failure exit code, check the console output to see which keys were added and which files changed.

1. Review the modified `src/locales/<locale>/translation.json` files and fill in real translations before committing.

> This agent workflow ensures your translations stay synchronized.
