# Development Setup - Quick Reference

## Prerequisites

- Node.js 20.x or higher
- Modern web browser

## Initial Setup

```bash
# Clone repository
git clone https://github.com/ianlintner/Astrolog.git
cd Astrolog

# Install dependencies
npm install

# Verify setup
npm test
```

## Daily Development Workflow

### 1. Start Development

```bash
# Create feature branch
git checkout -b feature/your-feature

# Run local server
npx http-server -p 8080
# Open http://localhost:8080 in browser
```

### 2. Make Changes

- Edit code in your favorite editor
- Test changes in browser
- Check browser console for errors

### 3. Before Committing

```bash
# Format code
npm run format

# Run linting
npm run lint

# Run all checks
npm test
```

### 4. Commit and Push

```bash
git add .
git commit -m "Your descriptive message"
git push origin feature/your-feature
```

## Available NPM Scripts

| Command                | Description                |
| ---------------------- | -------------------------- |
| `npm run lint`         | Check code with ESLint     |
| `npm run lint:fix`     | Auto-fix ESLint issues     |
| `npm run format`       | Format code with Prettier  |
| `npm run format:check` | Check if code is formatted |
| `npm test`             | Run all validation checks  |
| `npm run validate`     | Alias for npm test         |

## CI/CD Pipeline

The GitHub Actions workflow runs automatically on:

- Push to `main` or `copilot/**` branches
- Pull requests to `main`

### CI Checks

1. **Lint and Format Check**
    - Runs ESLint
    - Checks Prettier formatting
    - Validates game files exist

2. **HTML Validation**
    - Checks HTML structure
    - Verifies canvas element
    - Confirms game.js is linked

3. **Load Testing**
    - Starts local server
    - Tests if game files load
    - Verifies no 404 errors

## Code Standards

### JavaScript

- **Style**: 4 spaces, single quotes, 100 char lines
- **Version**: ES2021
- **Environment**: Browser
- **Linter**: ESLint with recommended rules

### HTML

- Valid HTML5
- Semantic elements
- Proper DOCTYPE

### CSS

- Retro terminal theme
- Green (#0f0) on black (#000)
- Responsive design

## Troubleshooting

### npm install fails

```bash
# Clear cache
npm cache clean --force
# Try again
npm install
```

### Linting errors

```bash
# Auto-fix what can be fixed
npm run lint:fix
# Check remaining issues
npm run lint
```

### Formatting issues

```bash
# Auto-format all files
npm run format
# Verify
npm run format:check
```

### Game doesn't load

1. Check browser console for errors
2. Verify all files are present
3. Try clearing browser cache
4. Use incognito/private mode

## GitHub Copilot Agents

### Game Developer Agent

For game mechanics and features:

```
@copilot as Game Developer Agent, can you add [feature]?
```

### UI/UX Agent

For interface improvements:

```
@copilot as UI/UX Agent, can you improve [UI element]?
```

See `.github/agents/README.md` for more details.

## File Structure

```
Astrolog/
├── index.html           # Game entry point
├── game.js              # Game engine
├── README.md            # User documentation
├── GAME_MANUAL.md       # Gameplay guide
├── CONTRIBUTING.md      # Developer guide
├── package.json         # Dependencies
├── .eslintrc.json       # Linting config
├── .prettierrc.json     # Formatting config
├── .gitignore           # Git ignore
└── .github/
    ├── workflows/
    │   └── ci.yml       # CI pipeline
    └── agents/
        └── README.md    # Agent docs
```

## Common Issues

**Q: Tests fail but code looks correct**
A: Run `npm run format` to fix formatting

**Q: ESLint shows warnings**
A: Warnings are okay, only errors block CI

**Q: Can I use a different formatter?**
A: No, Prettier is required for consistency

**Q: Do I need to install globally?**
A: No, all tools run via npm scripts

## Getting Help

- **Issues**: Report bugs and request features
- **Discussions**: Ask questions
- **Copilot**: Use @copilot for assistance

## Resources

- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [GitHub Actions](https://docs.github.com/actions)
- [Copilot Workspace](https://githubnext.com/projects/copilot-workspace)

---

Happy coding! 🚀
