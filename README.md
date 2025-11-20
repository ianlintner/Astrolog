# Space Logistics Tycoon

A browser-based space logistics management game inspired by classic Japanese management games. Manage trade routes, vehicles, and infrastructure across a vast network of star systems.

## Game Overview

Space Logistics Tycoon is a strategic management game where you build and operate a space transportation empire. Buy vehicles, establish depots and warehouses, and create profitable trade routes across 100 interconnected star systems.

## How to Play

### Getting Started

1. Open `index.html` in a web browser
2. The game starts with 10,000 credits and a view of the star system network
3. Click on star systems to select them and view their economy

### Game Mechanics

#### Star Systems

- **100 interconnected star systems** connected via hyperlanes
- Each system has:
    - Population (affects demand)
    - Exports (goods you can buy cheap)
    - Imports (goods you can sell expensive)
    - Available port slots for docking

#### Infrastructure

- **Depots (500cr)**: Required to establish trade routes in a system
- **Warehouses (1000cr)**: Increase route profitability by 10% per warehouse
- **Port Slots (1500cr)**: Expand docking capacity at hyperspace ports

#### Vehicles

- **Transports (2000cr)**: Ships that move goods between systems
- Each vehicle has:
    - Capacity: 100 units
    - Speed: Determines how fast routes complete
    - Must be assigned to a route to generate income

#### Goods Types

- Electronics (High value)
- Minerals (Medium value)
- Food (Low value)
- Medicine (High value)
- Machinery (High value)
- Luxury Goods (Premium value)

#### Creating Trade Routes

1. Buy depots in both origin and destination systems
2. Buy at least one vehicle
3. Select origin system (must export the desired good)
4. Select destination system (must import the desired good)
5. Choose the good to transport
6. Assign a vehicle
7. Route activates automatically and generates profit

#### AI Competitors

Two AI corporations compete with you for trade dominance:

- **StarCorp Industries** and **Galactic Express**
- AI builds depots, buys vehicles, and creates trade routes
- AI routes shown as dashed lines on the map
- Purchase **exclusive trade rights** (5000cr + 100cr/day) to lock AI out of your best routes

### Strategy Tips

1. **Find Profitable Routes**: Look for goods with high price differences between systems
2. **Build Warehouses**: Increase profit margins on your routes
3. **Expand Gradually**: Start with 1-2 profitable routes before expanding
4. **Watch Your Cash**: Don't spend all your credits - save some for operations
5. **Optimize Paths**: Shorter hyperlane paths complete faster

### Controls

- **Mouse Drag**: Pan the camera
- **Mouse Wheel**: Zoom in/out
- **Click System**: Select system to view details and build infrastructure
- **UI Panel**: All management actions on the right side

### Day Cycle

- Time advances every 5 seconds (1 game day)
- Active routes generate income when vehicles complete deliveries
- Income is calculated based on: (Sell Price - Buy Price) × Cargo × (1 + Warehouse Bonuses)

## Development Setup

### Quick Start

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Check code formatting
npm run format:check

# Auto-fix formatting
npm run format

# Run all validation checks
npm test
```

### CI/CD

This project uses GitHub Actions for continuous integration:

- **Linting**: ESLint checks code quality
- **Formatting**: Prettier ensures consistent code style
- **HTML Validation**: Checks for valid HTML structure
- **Load Testing**: Verifies game files load correctly

See `.github/workflows/ci.yml` for the complete CI configuration.

### GitHub Copilot Agents

This repository is configured for GitHub Copilot Agents. See `.github/agents/README.md` for:

- Available agent capabilities
- How to use agents in development
- Custom agent configuration

### Code Standards

- **JavaScript**: ES2021 with browser environment
- **Formatting**: 4 spaces, single quotes, 100 char line width
- **Linting**: ESLint with recommended rules
- All changes must pass CI checks before merging

## Technical Details

- Pure HTML5/CSS3/JavaScript - no external dependencies for runtime
- Canvas-based 2D rendering
- Procedurally generated star system network
- Dynamic economy simulation
- Real-time vehicle pathfinding

## Game Features

✅ 100 star systems with unique economies  
✅ Hyperlane network connecting systems  
✅ 6 different commodity types  
✅ Vehicle fleet management  
✅ Infrastructure development (depots, warehouses, port slots)  
✅ Dynamic trade route creation  
✅ Real-time profit calculation  
✅ Pan and zoom camera controls  
✅ Economic simulation with supply/demand  
✅ **AI competitors with intelligent decision-making**  
✅ **Exclusive trade rights system with maintenance costs**

## Future Enhancements

Potential features for expansion:

- Random events (piracy, demand spikes, disasters)
- Different vehicle types (fast couriers, bulk freighters)
- Technology upgrades
- ~~Competing AI factions~~ ✅ **IMPLEMENTED**
- Save/load game state
- Mission system
- Stock market for goods
- Fleet automation

## Credits

Created as a space-themed take on classic logistics management games like A-Train and other Japanese business simulation titles.
