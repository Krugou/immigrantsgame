---
name: npm-check
description: Use `npm-check` to inspect and upgrade outdated dependencies, keeping the project secure and current.
argument-hint: 'Optionally provide a scope (e.g. "update all" or "check only devDependencies").'
tools: ['run_in_terminal', 'npm', 'git']
---

1. Install `npm-check` globally if you haven't already:

```bash
npm install -g npm-check
```

1. Run `npm-check` in the project directory to see a list of outdated dependencies:

```bash
npm-check
```

1. Review the list of outdated packages. You can choose to update all packages or select specific ones to update. To update all packages, you can use:

1. ```bash

   ```

1. npm-check -u
1. Follow the prompts to update the selected packages. After updating, it's a good idea to run your tests to ensure everything is still working correctly:

```bash
npm test
```

1. If you encounter any issues after updating, you can check the changelogs of the updated packages for breaking changes or consider reverting to the previous version if necessary.
1. Remember to commit your changes after updating the dependencies to keep track of the updates in your version control system.
1. Regularly checking for outdated dependencies and keeping them updated is important for maintaining the security and performance of your project.
1. For more advanced usage, you can refer to the `npm-check` documentation for additional options and features.
1. By following these steps, you can ensure that your project stays up-to-date with the latest versions of its dependencies, which can help improve performance, security, and access to new features.
