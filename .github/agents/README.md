# Space Logistics Tycoon - Agent Configuration

This repository uses GitHub Copilot Agents to assist with development tasks.

## Available Agents

### Game Developer Agent
Specialized in game mechanics, balancing, and feature implementation for Space Logistics Tycoon.

**Capabilities:**
- Adding new game features (e.g., new commodity types, vehicle classes)
- Balancing game economy and mechanics
- Implementing new star systems or trade rules
- Debugging game logic issues

### UI/UX Agent
Focused on improving the game's user interface and player experience.

**Capabilities:**
- Enhancing canvas rendering and visual effects
- Improving UI layout and responsiveness
- Adding new UI controls and panels
- Optimizing performance and animations

## Using Copilot Agents

To use an agent in issues or pull requests, simply mention them with their specific capabilities:

```
@copilot as Game Developer Agent, can you add a new vehicle type with larger cargo capacity?
```

```
@copilot as UI/UX Agent, can you improve the tooltip display when hovering over star systems?
```

## Agent Instructions

Agents will follow these guidelines:
1. Maintain the retro terminal aesthetic (green on black theme)
2. Keep the codebase dependency-free (pure vanilla JS)
3. Ensure all changes are tested with the CI pipeline
4. Format code according to project standards (ESLint + Prettier)
5. Update documentation when adding features

## Development Workflow with Agents

1. **Request Feature**: Create an issue or comment describing the desired feature
2. **Agent Analysis**: Agent reviews existing code and proposes implementation
3. **Implementation**: Agent makes changes following project guidelines
4. **Validation**: CI tests run automatically to validate changes
5. **Review**: Maintainers review and approve the changes

## Agent Prompts Directory

Custom agent prompts can be added to `.github/agents/` directory for specialized tasks.
