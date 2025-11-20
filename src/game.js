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
        this.starSystemManager.generateStarSystems();
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
        const center = this.starSystemManager.generateStarSystems();
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
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new Game();
});
