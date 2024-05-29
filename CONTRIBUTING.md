# Contributing guide for Quick Spares Backend

## How to contribute

1. Fork the repository.
2. Create a new branch for your feature or bug fix: `git checkout -b feat/your-feature-name` or `git checkout -b fix/your-bug-fix-name`.
3. Make your changes and commit them using conventional commit messages: `git commit -am "feat: Add new feature"`.
4. Push your changes to your forked repository: `git push origin feat/your-feature-name`.
5. Submit a pull request to the main repository, explaining the changes you've made and providing any necessary details.

## Commit Message Format

We follow the conventional commit message format to provide a clear and standardized history of our project's changes. Each commit message should consist of a type and a descriptive message.

| Type     | Heading  | Rule                                       | Description                                                                       |
| -------- | -------- | ------------------------------------------ | --------------------------------------------------------------------------------- |
| ci       | CI       | Continuous Integration                     | Changes related to continuous integration.                                        |
| chore    | Chore    | Maintenance tasks                          | Other changes that don't affect production.                                       |
| docs     | Docs     | Documentation                              | Changes related to documentation.                                                 |
| feat     | Feature  | New Feature                                | New feature implementations or additions.                                         |
| fix      | Fix      | Bug Fixes                                  | Bug fixes or corrections.                                                         |
| perf     | Perf     | Performance Improvements                   | Performance-related improvements.                                                 |
| refactor | Refactor | Code Refactoring                           | Code changes that don't fix bugs or add features, but improve the code structure. |
| revert   | Revert   | Revert Previous Commits                    | Reverting previous commits.                                                       |
| style    | Style    | Code Formatting or Style                   | Changes related to code formatting or style.                                      |
| assets   | Assets   | Add or Update Assets (e.g., images, files) | Changes related to adding or updating assets, such as images or other files.      |

### Format

The commit message should start with the type, followed by a colon and a space, and then the descriptive message in present tense.

Example:

- feat: add user authentication feature
- fix: correct typo in README

Please adhere to this format when making commits. This will help us maintain a clean and organized commit history.
