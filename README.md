# GREENTEAM-DASHBOARD FRONT

Welcome to the GREENTEAM-DASHBOARD repository! This README includes guidelines on how to format commit messages to ensure our version control history is understandable and navigable.

## Commit Message Format

To maintain a clear and consistent commit history, all contributors are encouraged to format their commit messages according to the Conventional Commits specification.

### General Structure

A commit message should be structured as follows:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Components

1. **Type**: This describes the kind of change you are making. Common types include:

   - `feat` (new feature)
   - `fix` (bug fix)
   - `docs` (changes to documentation)
   - `style` (formatting, missing semi colons, etc.; no code change)
   - `refactor` (refactoring production code)
   - `test` (adding missing tests)
   - `chore` (maintenance tasks)

2. **Scope**:
   The scope could be anything specifying the place of the commit change. For example, `login`, `UserProfileComponent`, etc.

3. **Description**:
   A brief description of the change:
   - Use the imperative mood in the description ("add" not "adds" or "added").
   - Do not capitalize the first letter.
   - Do not end the description with a period.

### Examples

```
feat(auth): add support for OAuth2

Adds OAuth2 support to the authentication module to allow more flexible token management.

Fixes #123
```

Example commit command message

```
git commit -m "fix(code cleaning): fix typecheck and lint errors" -m "This update fixes errors related to types and lint." -m "Related to issue #001"
```


Removecommentjustforcommit
