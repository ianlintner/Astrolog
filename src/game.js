// Game.js - Main game coordinator
import { GameState } from './modules/GameState.js';
import { StarSystemManager } from './modules/StarSystem.js';
import { VehicleManager } from './modules/Vehicle.js';
import { RouteManager } from './modules/Route.js';
import { Renderer } from './modules/Renderer.js';
import { InputHandler } from './modules/InputHandler.js';
import { UIManager } from './modules/UIManager.js';
import { AICompetitorManager } from './modules/AICompetitor.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');

        // Resize canvas to fit container
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Initialize modules
        this.gameState = new GameState();
        this.starSystemManager = new StarSystemManager(this.gameState);
        this.vehicleManager = new VehicleManager();
        this.routeManager = new RouteManager(
            this.gameState,
            this.starSystemManager,
            this.vehicleManager
        );

        // Initialize AI competitor manager
        this.aiCompetitorManager = new AICompetitorManager(
            this.gameState,
            this.starSystemManager,
            this.vehicleManager,
            this.routeManager
        );

        // Create AI competitors
        this.aiCompetitorManager.createAIPlayer('StarCorp Industries', 'medium');
        this.aiCompetitorManager.createAIPlayer('Galactic Express', 'easy');

        // Generate game world
        const center = this.starSystemManager.generateStarSystems();
        this.starSystemManager.generateHyperLanes();
        this.starSystemManager.assignSystemEconomies();

        // Initialize renderer
        this.renderer = new Renderer(
            this.canvas,
            this.starSystemManager,
            this.gameState,
            this.vehicleManager,
            this.routeManager,
            this.aiCompetitorManager
        );

        // Center camera
        this.renderer.centerCamera(center.centerX, center.centerY);

        // Initialize UI manager
        this.uiManager = new UIManager(
            this.gameState,
            this.starSystemManager,
            this.vehicleManager,
            this.routeManager,
            this.aiCompetitorManager
        );

        // Initialize input handler
        this.inputHandler = new InputHandler(this.canvas, this.renderer, (system) =>
            this.onSystemSelect(system)
        );

        // Set up initial player infrastructure
        this.setupInitialPlayerState();

        // Initial UI update
        this.uiManager.updateAll();

        // Start game loop
        this.lastTime = Date.now();
        this.gameLoop();

        // Start day cycle (every 5 seconds = 1 day)
        this.dayCycleInterval = setInterval(() => this.advanceDay(), 5000);
    }

    resizeCanvas() {
        const container = document.getElementById('canvas-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    onSystemSelect(system) {
        this.renderer.setSelectedSystem(system);
        this.uiManager.setSelectedSystem(system);
    }

    advanceDay() {
        this.gameState.advanceDay();

        // Player maintains trade rights
        this.gameState.maintainTradeRights(this.routeManager);

        // Process player routes
        this.routeManager.processRoutes();

        // Process AI turns
        const aiPlayers = this.aiCompetitorManager.getAllAIPlayers();
        aiPlayers.forEach((aiPlayer) => {
            // AI processes routes to earn income
            this.aiCompetitorManager.processAIRoutes(aiPlayer);

            // AI takes actions (every 3 days to reduce frequency)
            if (this.gameState.day % 3 === 0) {
                this.aiCompetitorManager.processAITurn(aiPlayer);
            }
        });

        this.uiManager.updateStats();
    }

    gameLoop() {
        const now = Date.now();
        const dt = (now - this.lastTime) / 1000;
        this.lastTime = now;

        this.renderer.updateCamera();
        this.renderer.render();

        requestAnimationFrame(() => this.gameLoop());
    }

    setupInitialPlayerState() {
        // Find two nearby connected systems with compatible exports/imports
        const systems = this.starSystemManager.starSystems;
        let startRoute = null;

        // Search for a good starting route between nearby systems
        for (let i = 0; i < systems.length && !startRoute; i++) {
            const sys1 = systems[i];
            // Find connected systems through hyperlanes
            const connectedIds = this.starSystemManager.hyperLanes
                .filter((lane) => lane.from === sys1.id || lane.to === sys1.id)
                .map((lane) => (lane.from === sys1.id ? lane.to : lane.from));

            for (const sys2Id of connectedIds) {
                // Find system by ID (don't assume array index equals system ID)
                const sys2 = systems.find((s) => s.id === sys2Id);
                if (!sys2) continue;

                // Check if sys1 exports something sys2 imports
                for (const exp of sys1.exports) {
                    const imp = sys2.imports.find((i) => i.id === exp.id);
                    if (imp && imp.price - exp.price > 0) {
                        startRoute = {
                            from: sys1,
                            to: sys2,
                            good: exp.id,
                            profit: imp.price - exp.price,
                        };
                        break;
                    }
                }
                if (startRoute) break;
            }
        }

        // Fallback: if no profitable route found, search for any valid export/import match
        if (!startRoute && systems.length >= 2) {
            for (let i = 0; i < systems.length && !startRoute; i++) {
                const sys1 = systems[i];
                if (!sys1.exports || sys1.exports.length === 0) continue;

                for (let j = 0; j < systems.length && !startRoute; j++) {
                    if (i === j) continue;
                    const sys2 = systems[j];
                    if (!sys2.imports) continue;

                    for (const exp of sys1.exports) {
                        const imp = sys2.imports.find((item) => item.id === exp.id);
                        if (imp) {
                            startRoute = {
                                from: sys1,
                                to: sys2,
                                good: exp.id,
                                profit: Math.max(imp.price - exp.price, 10),
                            };
                            break;
                        }
                    }
                }
            }
        }

        // If still no route found (shouldn't happen), skip initial setup
        if (!startRoute) {
            return;
        }

        // Add depots in both systems
        this.gameState.addDepot(startRoute.from.id);
        this.gameState.addDepot(startRoute.to.id);

        // Create two vehicles: one for the route, one spare for expansion
        const vehicle1 = this.vehicleManager.createVehicle();
        this.vehicleManager.createVehicle(); // Spare vehicle (result not needed)

        // Create the initial route
        this.routeManager.createRoute(
            startRoute.from.id,
            startRoute.to.id,
            startRoute.good,
            vehicle1.id
        );

        // Select the first system so the player can see their starting position
        this.renderer.setSelectedSystem(startRoute.from);
        this.uiManager.setSelectedSystem(startRoute.from);

        // Note: The initial infrastructure is a starter bonus - costs are not deducted
        // Cost reference: Depots = 500cr each, Vehicles = 2000cr each (defined in UIManager.js)
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new Game();
});
