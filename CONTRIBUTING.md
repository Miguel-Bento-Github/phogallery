# Contributing to Photography Portfolio

## Commit Message Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) to ensure consistent and meaningful commit messages.

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type
Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries
- **perf**: A code change that improves performance
- **ci**: Changes to CI configuration files and scripts
- **build**: Changes that affect the build system or external dependencies
- **revert**: Reverts a previous commit

### Scope (Optional)
The scope should be a noun describing a section of the codebase:

- `component` - Vue components
- `store` - Pinia stores
- `layout` - Layout components
- `api` - API related changes
- `utils` - Utility functions
- `config` - Configuration files
- `types` - TypeScript type definitions

### Subject
- Use imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No dot (.) at the end
- Maximum 50 characters

### Examples

```bash
feat(component): add photo lightbox modal
fix(store): resolve gallery loading state issue
docs: update setup instructions in README
test(component): add unit tests for PhotoCard hover states
chore(deps): update Vue to latest version
refactor(utils): simplify image URL helper function
```

### Body (Optional)
- Use the body to explain what and why vs. how
- Can include multiple paragraphs
- Wrap at 72 characters

### Footer (Optional)
- Reference issues and pull requests
- Note breaking changes

```bash
feat(api): add user authentication

Add JWT token-based authentication system
with login, logout, and token refresh capabilities.

BREAKING CHANGE: API endpoints now require authentication
Closes #123
```

## Development Workflow

1. Create a feature branch: `git checkout -b feat/photo-upload`
2. Make your changes following the coding standards
3. Write tests for new functionality
4. Run tests: `npm run test`
5. Commit using conventional format: `git commit`
6. Push and create a pull request

## Git Hooks

This repository includes a `commit-msg` hook that validates your commit messages. If your commit message doesn't follow the conventional format, the commit will be rejected with a helpful error message.

To bypass the hook for emergency commits (not recommended):
```bash
git commit --no-verify -m "emergency fix"
``` 