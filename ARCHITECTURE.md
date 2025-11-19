# Architecture Documentation

## Module Structure

The game has been modularized into separate ES6 modules for better organization and maintainability.

### Module Overview

```
src/
├── game.js                 # Main game coordinator
└── modules/
    ├── GameState.js        # Core game state and economy
    ├── StarSystem.js       # Star system generation and management
    ├── Vehicle.js          # Vehicle fleet management
    ├── Route.js            # Trade route logic
    ├── Renderer.js         # Canvas rendering engine
    ├── InputHandler.js     # Mouse/keyboard input handling
    └── UIManager.js        # UI panel management
```

### Module Dependencies

```
game.js
  ├── GameState
  ├── StarSystemManager (depends on GameState)
  ├── VehicleManager
  ├── RouteManager (depends on GameState, StarSystemManager, VehicleManager)
  ├── Renderer (depends on all managers and GameState)
  ├── InputHandler (depends on Renderer)
  └── UIManager (depends on all managers and GameState)
```

## Module Responsibilities

### GameState (`GameState.js`)

**Purpose**: Manages core game state and economy

**Responsibilities**:

- Track credits, day counter
- Manage infrastructure (depots, warehouses, port slots)
- Define goods types and prices
- Handle spending and earning credits

**Key Methods**:

- `spend(amount)` - Spend credits
- `earn(amount)` - Earn credits
- `addDepot(systemId)` - Add depot to system
- `addWarehouse(systemId)` - Add warehouse to system
- `advanceDay()` - Increment day counter

### StarSystemManager (`StarSystem.js`)

**Purpose**: Generate and manage the star system network

**Responsibilities**:

- Generate 100 procedurally placed star systems
- Create hyperlane connections between systems
- Assign economies (exports/imports) to systems
- Pathfinding between systems

**Key Methods**:

- `generateStarSystems()` - Create the star field
- `generateHyperLanes()` - Connect systems with lanes
- `assignSystemEconomies()` - Set up trade goods
- `findPath(fromId, toId)` - BFS pathfinding

### VehicleManager (`Vehicle.js`)

**Purpose**: Manage the vehicle fleet

**Responsibilities**:

- Create new vehicles
- Track vehicle assignments
- Update vehicle positions along routes

**Key Methods**:

- `createVehicle()` - Add new transport ship
- `assignVehicleToRoute(vehicleId, routeId)` - Assign vehicle
- `updateVehiclePosition(vehicleId, delta)` - Move vehicle

### RouteManager (`Route.js`)

**Purpose**: Handle trade route creation and processing

**Responsibilities**:

- Validate route parameters
- Create trade routes
- Process route income
- Calculate daily income projections

**Key Methods**:

- `createRoute(fromId, toId, goodId, vehicleId)` - Create new route
- `processRoutes()` - Update all routes and earn credits
- `calculateDailyIncome()` - Project daily earnings

### Renderer (`Renderer.js`)

**Purpose**: Handle all canvas rendering

**Responsibilities**:

- Render star systems, hyperlanes, routes, vehicles
- Manage camera (pan, zoom)
- Convert screen/world coordinates
- Find systems at mouse position

**Key Methods**:

- `render()` - Main render loop
- `panCamera(dx, dy)` - Move camera
- `zoomCamera(delta)` - Zoom in/out
- `findSystemAtPosition(x, y)` - Hit detection

### InputHandler (`InputHandler.js`)

**Purpose**: Process user input

**Responsibilities**:

- Handle mouse events (click, drag, wheel)
- System selection
- Camera control via drag

**Key Methods**:

- `onMouseDown(e)` - Handle clicks and drag start
- `onMouseMove(e)` - Handle dragging
- `onWheel(e)` - Handle zoom

### UIManager (`UIManager.js`)

**Purpose**: Manage UI panel updates

**Responsibilities**:

- Update all UI displays
- Handle button clicks
- Update selected system info
- Update route/vehicle lists

**Key Methods**:

- `updateAll()` - Refresh all UI elements
- `buyDepot()`, `buyWarehouse()`, `buyVehicle()` - Purchase actions
- `createRoute()` - Route creation UI logic

## Game Coordinator (`game.js`)

The main `Game` class coordinates all modules:

1. **Initialization**:
    - Creates all module instances
    - Generates game world
    - Sets up event listeners
    - Centers camera

2. **Game Loop**:
    - Updates camera position
    - Renders frame
    - Uses `requestAnimationFrame` for 60fps

3. **Day Cycle**:
    - Runs every 5 seconds
    - Advances day counter
    - Processes all routes for income

## Design Principles

### Separation of Concerns

Each module handles one aspect of the game. For example:

- `Renderer` only renders, doesn't modify game state
- `GameState` only stores data, doesn't handle UI
- `UIManager` updates UI, doesn't process game logic

### Dependency Injection

Modules receive their dependencies via constructor:

```javascript
this.routeManager = new RouteManager(this.gameState, this.starSystemManager, this.vehicleManager);
```

### Single Responsibility

Each class has one clear purpose:

- `VehicleManager` manages vehicles, nothing else
- `RouteManager` manages routes, nothing else

### No Build Step Required

Uses native ES6 modules - works directly in modern browsers without webpack, babel, or other build tools.

## Adding New Features

### Example: Adding a New Building Type

1. **Update GameState**: Add building counter
2. **Update UIManager**: Add button and purchase logic
3. **Update Renderer**: Add visual indicator (optional)
4. **Update RouteManager**: Add bonus/effect (if applicable)

### Example: Adding a New Game Mechanic

1. Create new module in `src/modules/`
2. Import in `src/game.js`
3. Initialize in `Game` constructor
4. Call from game loop or day cycle as needed

## Testing Strategy

### Manual Testing

1. Start local server: `python3 -m http.server 8080`
2. Open `http://localhost:8080` in browser
3. Open browser console to check for errors
4. Test all game actions (buy, create routes, etc.)

### Automated Testing

- Linting: `npm run lint`
- Formatting: `npm run format:check`
- Full validation: `npm test`

## Future Enhancements

Potential improvements to the architecture:

1. **TypeScript**: Add type safety with `.ts` files
2. **State Management**: Use a central event bus or state manager
3. **Save/Load**: Implement serialization of game state
4. **Testing Framework**: Add Jest or Vitest for unit tests
5. **Framework Integration**: Consider Phaser.js or PixiJS for advanced rendering

## Migration Notes

The original `game.js` (860 lines) has been split into:

- `src/game.js` (105 lines) - coordinator
- 7 module files (~200 lines each) - specialized functionality

All functionality has been preserved while improving:

- Code organization
- Maintainability
- Testability
- Scalability
