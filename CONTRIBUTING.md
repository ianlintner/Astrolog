# Contributing to Space Logistics Tycoon

Thank you for your interest in contributing to Space Logistics Tycoon! This document provides guidelines and instructions for contributing to the project.

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm (comes with Node.js)
- A modern web browser (Chrome, Firefox, Edge, Safari)
- Git

### Development Setup

1. **Fork and Clone**

    ```bash
    git clone https://github.com/YOUR_USERNAME/Astrolog.git
    cd Astrolog
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Verify Setup**
    ```bash
    npm test
    ```

## Development Workflow

### Before Making Changes

1. **Create a Branch**

    ```bash
    git checkout -b feature/your-feature-name
    ```

2. **Run the Game Locally**
    - Open `index.html` in your browser, or
    - Use a local server: `npx http-server -p 8080`

### While Developing

1. **Follow Code Standards**
    - Use 4 spaces for indentation
    - Use single quotes for strings
    - Keep lines under 100 characters
    - Run `npm run format` to auto-format code

2. **Lint Your Code**

    ```bash
    npm run lint
    ```

3. **Check Formatting**
    ```bash
    npm run format:check
    ```

### Before Committing

1. **Format All Files**

    ```bash
    npm run format
    ```

2. **Run All Checks**

    ```bash
    npm test
    ```

3. **Test the Game**
    - Verify the game loads correctly
    - Test your changes thoroughly
    - Check for console errors

### Commit Guidelines

- Use clear, descriptive commit messages
- Start with a verb (Add, Fix, Update, Remove, etc.)
- Keep the first line under 72 characters
- Add details in the body if needed

Examples:

```
Add new vehicle type: Heavy Freighter

- Capacity: 200 units
- Speed: 0.5x slower
- Cost: 4000cr
```

## Code Style

### JavaScript

- ES2021 syntax
- Class-based architecture
- Avoid global variables (except the Game class)
- Use meaningful variable names
- Comment complex logic

### HTML/CSS

- Use semantic HTML5 elements
- Maintain the retro terminal aesthetic
- Green (#0f0) on black (#000) theme
- Ensure responsive design

### Documentation

- Update README.md for user-facing features
- Update GAME_MANUAL.md for gameplay changes
- Add inline comments for complex code
- Keep documentation concise and clear

## Testing Your Changes

### Manual Testing Checklist

- [ ] Game loads without errors
- [ ] Canvas renders correctly
- [ ] UI buttons work as expected
- [ ] Star systems can be selected
- [ ] Trade routes can be created
- [ ] Vehicles move along routes
- [ ] Credits update correctly
- [ ] No console errors or warnings

### Automated Testing

CI will automatically run:

- ESLint checks
- Prettier formatting checks
- HTML validation
- File load tests

## Pull Request Process

1. **Update Documentation**
    - Add your changes to README.md if needed
    - Update GAME_MANUAL.md for gameplay changes

2. **Ensure CI Passes**
    - All automated checks must pass
    - Fix any linting or formatting issues

3. **Create Pull Request**
    - Use a descriptive title
    - Explain what changes you made
    - Include screenshots for visual changes
    - Reference any related issues

4. **Review Process**
    - Maintainers will review your PR
    - Address any feedback promptly
    - Make requested changes if needed

## Using GitHub Copilot Agents

This repository supports GitHub Copilot Agents for development assistance.

### Available Agents

**Game Developer Agent**

- Adding game features
- Balancing mechanics
- Implementing new systems
- Debugging game logic

**UI/UX Agent**

- Improving visual design
- Enhancing user experience
- Optimizing performance
- Adding animations

### How to Use

In issues or PRs, mention Copilot with specific context:

```
@copilot as Game Developer Agent, can you add a technology
upgrade system that allows vehicles to increase their speed?
```

See `.github/agents/README.md` for detailed agent documentation.

## Project Structure

```
Astrolog/
├── .github/
│   ├── agents/          # Copilot agent configurations
│   └── workflows/       # CI/CD workflows
├── index.html          # Game HTML structure
├── game.js             # Game engine and logic
├── README.md           # Project documentation
├── GAME_MANUAL.md      # Player guide
├── CONTRIBUTING.md     # This file
├── package.json        # NPM dependencies
├── .eslintrc.json      # ESLint configuration
├── .prettierrc.json    # Prettier configuration
└── .gitignore          # Git ignore rules
```

## Design Philosophy

### Core Principles

1. **Zero Runtime Dependencies** - Pure vanilla JavaScript
2. **Retro Aesthetic** - Terminal-style green on black
3. **Strategic Depth** - Economic simulation with meaningful choices
4. **Accessibility** - Works in any modern browser
5. **Performance** - Smooth 60 FPS rendering

### Feature Guidelines

- Keep the game lightweight and fast
- Maintain the retro aesthetic
- Add strategic depth, not complexity
- Ensure new features integrate smoothly
- Test thoroughly before submitting

## Common Tasks

### Adding a New Commodity

1. Add to `goodsTypes` array in game.js
2. Update system economy generation
3. Test trade route creation
4. Update GAME_MANUAL.md

### Adding a New Vehicle Type

1. Extend vehicle creation in `buyVehicle()`
2. Update UI to show vehicle stats
3. Adjust economics if needed
4. Add to documentation

### Adding a New Building Type

1. Add purchase function (like `buyDepot()`)
2. Add to UI panel
3. Implement gameplay effect
4. Update selected system display

## Getting Help

- **Issues**: Use GitHub Issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Copilot**: Use @copilot for development assistance

## Code of Conduct

- Be respectful and constructive
- Welcome newcomers and help them learn
- Focus on the project's goals
- Give credit where credit is due

## License

By contributing to Space Logistics Tycoon, you agree that your contributions will be licensed under the same license as the project (MIT).

---

Thank you for contributing to Space Logistics Tycoon! 🚀
