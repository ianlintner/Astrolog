# Space Logistics Tycoon - Game Manual

## Quick Start Guide

### Opening the Game

Simply open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari).

### Initial Setup

- Starting Credits: 10,000
- Starting Assets: None (you must build everything)
- Game Speed: 1 day = 5 real seconds

## Controls

### Camera

- **Left Mouse + Drag**: Pan the view
- **Mouse Wheel**: Zoom in/out
- **Click on Star**: Select system

### UI Panel (Right Side)

All game management happens through the right panel:

- View stats and resources
- Select systems
- Purchase infrastructure
- Create trade routes
- Monitor active routes

## Step-by-Step Tutorial

### 1. Select Your First System

- Click on any star system in the network
- Review its Exports (what it sells cheap)
- Review its Imports (what it buys expensive)

### 2. Build a Depot

- With a system selected, click "Buy Depot (500cr)"
- Depots are required to create trade routes
- Build depots in at least 2 systems to create a route

### 3. Buy Your First Vehicle

- Click "Buy Transport (2000cr)"
- This gives you a 100-unit cargo ship
- Vehicles can be assigned to one route each

### 4. Find a Profitable Route

Look for:

- System A exports a good (e.g., Minerals at 35cr)
- System B imports that same good (e.g., Minerals at 88cr)
- Profit = 88 - 35 = 53cr per unit
- With 100-unit capacity = 5,300cr per trip!

### 5. Create the Route

- From System: Select the exporting system
- To System: Select the importing system
- Select Good: Choose the commodity
- Select Vehicle: Assign your transport
- Click "Create Route"

### 6. Watch Your Empire Grow

- The vehicle will travel along the green route
- Yellow dot shows vehicle position
- Income is generated when deliveries complete
- Reinvest profits in more vehicles and routes

## Advanced Strategies

### Warehouse Strategy

- Warehouses cost 1000cr
- Each warehouse adds +10% profit bonus to routes
- Build in both origin and destination for maximum effect
- Example: 2 warehouses = +20% profit boost

### Route Optimization

- Shorter hyperlane paths = faster deliveries = more income
- Look for adjacent systems with good price differences
- Some routes might need multiple jumps through intermediary systems

### Expansion Planning

- Start with 1-2 high-profit routes
- Reinvest profits carefully
- Keep some cash reserve (don't spend everything!)
- Build depots in well-connected hub systems

### Fleet Management

- Each vehicle needs its own route
- Idle vehicles generate no income
- Balance vehicle purchases with depot availability
- Consider route profitability before buying more vehicles

## Economic Tips

### Finding Good Deals

- Look for luxury goods and medicine (highest margins)
- Minerals and food have lower margins but reliable demand
- Each system has 1-2 exports and 2-4 imports
- Price differences range from 10cr to 300+cr per unit

### Daily Income Calculation

```
Income per Trip = (Sell Price - Buy Price) × Cargo Capacity
Trips per Day = Vehicle Speed × 0.2
Warehouse Bonus = (Total Warehouses on Route × 10%)
Daily Income = Income per Trip × Trips per Day × (1 + Warehouse Bonus)
```

### Growth Milestones

- 10,000cr: Start - Buy 1-2 depots and 1 vehicle
- 20,000cr: Expand to 2-3 active routes
- 50,000cr: Add warehouses to boost existing routes
- 100,000cr: Large fleet with 5+ vehicles
- 200,000cr+: Empire status - many routes across the galaxy

## Visual Indicators

### On the Map

- **White/Colored Stars**: Star systems
- **Green Lines**: Hyperlane connections
- **Bright Green Lines**: Active trade routes
- **Yellow Dots**: Vehicles in transit
- **Green Ring**: System has depot
- **Blue Ring**: System has warehouse
- **Yellow Ring**: Selected system

### In the UI

- **Green Text**: Profit/income
- **Cyan Text**: Headers and system names
- **White Text**: General information
- **Green Buttons**: Available actions

## Game Statistics

### Network Details

- 100 unique star systems
- ~200-300 hyperlane connections
- Average 2-4 connections per system
- Pathfinding uses BFS algorithm

### Economic Details

- 6 commodity types
- Price range: 25cr to 500cr per unit
- Each system exports 1-2 goods
- Each system imports 2-4 goods

### Infrastructure Costs

| Item      | Cost   | Benefit             |
| --------- | ------ | ------------------- |
| Depot     | 500cr  | Required for routes |
| Warehouse | 1000cr | +10% profit bonus   |
| Transport | 2000cr | 100-unit capacity   |
| Port Slot | 1500cr | Extra docking space |

## Troubleshooting

### "Please select a star system first"

- Click on a star in the map to select it
- Selected system shows yellow ring

### "Not enough credits"

- Check your credit balance (top right)
- Wait for routes to generate income
- Sell less profitable routes by buying more vehicles elsewhere

### "No hyperlane path exists"

- Systems must be connected via hyperlanes
- Green lines show connections
- Try different destination systems

### "System does not export this good"

- Each system only exports specific goods
- Check "Exports (Buy)" section for available goods

### "System does not import this good"

- Each system only imports specific goods
- Check "Imports (Sell)" section for what they want

## AI Competitors

### Overview

You now compete against two AI-controlled corporations:

- **StarCorp Industries** (Medium difficulty)
- **Galactic Express** (Easy difficulty)

### AI Behavior

AI competitors will:

- Build depots in profitable star systems
- Purchase warehouses to increase route profitability
- Buy transport vehicles
- Create trade routes between systems
- Acquire exclusive trade rights for competitive advantage
- Earn credits from successful trade routes

### AI Visualization

- **Orange dashed lines**: StarCorp Industries routes
- **Magenta dashed lines**: Galactic Express routes
- **Colored dots**: AI vehicles in transit
- AI stats displayed in the "AI Competitors" panel

### Exclusive Trade Rights

#### What Are Trade Rights?

Trade rights give you exclusive access to a specific trade route (from-to-good combination), preventing AI competitors from using the same route.

#### Cost

- **Upfront**: 5000 credits
- **Maintenance**: 100 credits per day per trade right

#### How to Purchase

1. Create an active trade route
2. Go to "Trade Rights Management" section
3. Select your route from the dropdown
4. Click "Buy Exclusive Rights (5000cr)"

#### Benefits

- Locks AI out of that specific route
- Protects your most profitable routes
- Strategic advantage in competitive markets

#### Maintenance

- Costs are automatically deducted each day
- If you can't afford maintenance, you lose some trade rights (oldest first)
- Monitor your "Maintenance Cost" stat to plan finances

### Competing Strategy Tips

1. **Secure Profitable Routes Early**: Buy exclusive rights for high-profit routes before AI does
2. **Monitor AI Expansion**: Watch the AI Competitors panel to see where they're investing
3. **Balance Costs**: Trade rights are expensive - only protect your best routes
4. **Maintain Cash Reserve**: Keep enough credits to pay daily maintenance costs
5. **Expand Aggressively**: AI acts every 3 days, so stay ahead by building faster

## Future Expansion Ideas

The game framework supports adding:

- Random events (piracy, demand spikes)
- Technology upgrades
- Different vehicle types
- ~~Competing AI traders~~ ✅ **ADDED**
- Save/load functionality
- Missions and objectives
- Stock market mechanics

## Credits

Inspired by classic Japanese management games like A-Train (Aerobiz).
Created as a pure HTML5/JavaScript implementation.

Enjoy building your space empire! 🚀
