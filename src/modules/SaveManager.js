// SaveManager.js - Handles saving and loading game state to/from localStorage
export class SaveManager {
    constructor() {
        this.storageKey = 'space-logistics-tycoon-save';
        this.version = 1; // Version for save format compatibility
    }

    /**
     * Check if a saved game exists
     * @returns {boolean}
     */
    hasSavedGame() {
        return localStorage.getItem(this.storageKey) !== null;
    }

    /**
     * Save the complete game state to localStorage
     * @param {Object} gameState - GameState instance
     * @param {Object} starSystemManager - StarSystemManager instance
     * @param {Object} vehicleManager - VehicleManager instance
     * @param {Object} routeManager - RouteManager instance
     * @param {Object} aiCompetitorManager - AICompetitorManager instance
     * @returns {boolean} - Whether save was successful
     */
    saveGame(gameState, starSystemManager, vehicleManager, routeManager, aiCompetitorManager) {
        try {
            const saveData = {
                version: this.version,
                timestamp: Date.now(),
                gameState: this.serializeGameState(gameState),
                starSystems: this.serializeStarSystems(starSystemManager),
                vehicles: this.serializeVehicles(vehicleManager),
                routes: this.serializeRoutes(routeManager),
                aiPlayers: this.serializeAIPlayers(aiCompetitorManager),
            };

            localStorage.setItem(this.storageKey, JSON.stringify(saveData));
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    }

    /**
     * Load saved game state from localStorage
     * @returns {Object|null} - Saved game data or null if no save exists
     */
    loadGame() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (!savedData) {
                return null;
            }

            const parsed = JSON.parse(savedData);

            // Check version compatibility
            if (parsed.version !== this.version) {
                console.warn('Save file version mismatch, starting new game');
                return null;
            }

            return parsed;
        } catch (error) {
            console.error('Failed to load game:', error);
            return null;
        }
    }

    /**
     * Delete the saved game from localStorage
     * @returns {boolean} - Whether deletion was successful
     */
    deleteSave() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Failed to delete save:', error);
            return false;
        }
    }

    // Serialization methods

    serializeGameState(gameState) {
        return {
            credits: gameState.credits,
            day: gameState.day,
            depots: { ...gameState.depots },
            warehouses: { ...gameState.warehouses },
            portSlots: { ...gameState.portSlots },
            tradeRights: [...gameState.tradeRights],
        };
    }

    serializeStarSystems(starSystemManager) {
        return {
            starSystems: starSystemManager.starSystems.map((sys) => ({
                id: sys.id,
                name: sys.name,
                x: sys.x,
                y: sys.y,
                population: sys.population,
                exports: sys.exports.map((exp) => ({ ...exp })),
                imports: sys.imports.map((imp) => ({ ...imp })),
                color: sys.color,
            })),
            hyperLanes: starSystemManager.hyperLanes.map((lane) => ({
                from: lane.from,
                to: lane.to,
            })),
        };
    }

    serializeVehicles(vehicleManager) {
        return vehicleManager.vehicles.map((v) => ({
            id: v.id,
            name: v.name,
            capacity: v.capacity,
            speed: v.speed,
            assignedRoute: v.assignedRoute,
            position: v.position,
        }));
    }

    serializeRoutes(routeManager) {
        return routeManager.routes.map((r) => ({
            id: r.id,
            from: r.from,
            to: r.to,
            good: r.good,
            vehicleId: r.vehicleId,
            path: [...r.path],
            buyPrice: r.buyPrice,
            sellPrice: r.sellPrice,
            profit: r.profit,
            active: r.active,
            hasExclusiveRights: r.hasExclusiveRights,
        }));
    }

    serializeAIPlayers(aiCompetitorManager) {
        return aiCompetitorManager.aiPlayers.map((ai) => ({
            id: ai.id,
            name: ai.name,
            credits: ai.credits,
            aggression: ai.aggression,
            efficiency: ai.efficiency,
            depots: { ...ai.depots },
            warehouses: { ...ai.warehouses },
            vehicles: ai.vehicles.map((v) => ({
                id: v.id,
                name: v.name,
                capacity: v.capacity,
                speed: v.speed,
                assignedRoute: v.assignedRoute,
                position: v.position,
            })),
            routes: ai.routes.map((r) => ({
                id: r.id,
                from: r.from,
                to: r.to,
                good: r.good,
                vehicleId: r.vehicleId,
                path: [...r.path],
                buyPrice: r.buyPrice,
                sellPrice: r.sellPrice,
                profit: r.profit,
                active: r.active,
                hasExclusiveRights: r.hasExclusiveRights,
            })),
            tradeRights: ai.tradeRights.map((tr) => ({ ...tr })),
        }));
    }

    // Deserialization/restoration methods

    /**
     * Restore GameState from saved data
     * @param {Object} gameState - GameState instance to restore
     * @param {Object} savedGameState - Saved game state data
     */
    restoreGameState(gameState, savedGameState) {
        gameState.credits = savedGameState.credits;
        gameState.day = savedGameState.day;
        gameState.depots = { ...savedGameState.depots };
        gameState.warehouses = { ...savedGameState.warehouses };
        gameState.portSlots = { ...savedGameState.portSlots };
        gameState.tradeRights = [...savedGameState.tradeRights];
    }

    /**
     * Restore StarSystemManager from saved data
     * @param {Object} starSystemManager - StarSystemManager instance to restore
     * @param {Object} savedStarSystems - Saved star systems data
     */
    restoreStarSystems(starSystemManager, savedStarSystems) {
        starSystemManager.starSystems = savedStarSystems.starSystems.map((sys) => ({
            id: sys.id,
            name: sys.name,
            x: sys.x,
            y: sys.y,
            population: sys.population,
            exports: sys.exports.map((exp) => ({ ...exp })),
            imports: sys.imports.map((imp) => ({ ...imp })),
            color: sys.color,
        }));
        starSystemManager.hyperLanes = savedStarSystems.hyperLanes.map((lane) => ({
            from: lane.from,
            to: lane.to,
        }));
    }

    /**
     * Restore VehicleManager from saved data
     * @param {Object} vehicleManager - VehicleManager instance to restore
     * @param {Array} savedVehicles - Saved vehicles data
     */
    restoreVehicles(vehicleManager, savedVehicles) {
        vehicleManager.vehicles = savedVehicles.map((v) => ({
            id: v.id,
            name: v.name,
            capacity: v.capacity,
            speed: v.speed,
            assignedRoute: v.assignedRoute,
            position: v.position,
        }));
    }

    /**
     * Restore RouteManager from saved data
     * @param {Object} routeManager - RouteManager instance to restore
     * @param {Array} savedRoutes - Saved routes data
     */
    restoreRoutes(routeManager, savedRoutes) {
        routeManager.routes = savedRoutes.map((r) => ({
            id: r.id,
            from: r.from,
            to: r.to,
            good: r.good,
            vehicleId: r.vehicleId,
            path: [...r.path],
            buyPrice: r.buyPrice,
            sellPrice: r.sellPrice,
            profit: r.profit,
            active: r.active,
            hasExclusiveRights: r.hasExclusiveRights,
        }));
    }

    /**
     * Restore AICompetitorManager from saved data
     * @param {Object} aiCompetitorManager - AICompetitorManager instance to restore
     * @param {Array} savedAIPlayers - Saved AI players data
     */
    restoreAIPlayers(aiCompetitorManager, savedAIPlayers) {
        aiCompetitorManager.aiPlayers = savedAIPlayers.map((ai) => ({
            id: ai.id,
            name: ai.name,
            credits: ai.credits,
            aggression: ai.aggression,
            efficiency: ai.efficiency,
            depots: { ...ai.depots },
            warehouses: { ...ai.warehouses },
            vehicles: ai.vehicles.map((v) => ({
                id: v.id,
                name: v.name,
                capacity: v.capacity,
                speed: v.speed,
                assignedRoute: v.assignedRoute,
                position: v.position,
            })),
            routes: ai.routes.map((r) => ({
                id: r.id,
                from: r.from,
                to: r.to,
                good: r.good,
                vehicleId: r.vehicleId,
                path: [...r.path],
                buyPrice: r.buyPrice,
                sellPrice: r.sellPrice,
                profit: r.profit,
                active: r.active,
                hasExclusiveRights: r.hasExclusiveRights,
            })),
            tradeRights: ai.tradeRights.map((tr) => ({ ...tr })),
        }));
    }
}
