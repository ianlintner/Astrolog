// AICompetitor.js - AI player management and decision-making
export class AICompetitorManager {
    constructor(gameState, starSystemManager, vehicleManager, routeManager) {
        this.gameState = gameState;
        this.starSystemManager = starSystemManager;
        this.vehicleManager = vehicleManager;
        this.routeManager = routeManager;

        this.aiPlayers = [];
    }

    createAIPlayer(name, difficulty = 'medium') {
        const difficultySettings = {
            easy: { startingCredits: 8000, aggression: 0.3, efficiency: 0.6 },
            medium: { startingCredits: 10000, aggression: 0.5, efficiency: 0.8 },
            hard: { startingCredits: 12000, aggression: 0.7, efficiency: 0.9 },
        };

        const settings = difficultySettings[difficulty] || difficultySettings.medium;

        const aiPlayer = {
            id: this.aiPlayers.length,
            name: name,
            credits: settings.startingCredits,
            aggression: settings.aggression,
            efficiency: settings.efficiency,
            depots: {},
            warehouses: {},
            vehicles: [],
            routes: [],
            tradeRights: [], // Exclusive trade rights
        };

        this.aiPlayers.push(aiPlayer);
        return aiPlayer;
    }

    getAIPlayer(id) {
        return this.aiPlayers[id];
    }

    getAllAIPlayers() {
        return this.aiPlayers;
    }

    // AI takes its turn - evaluates opportunities and makes decisions
    processAITurn(aiPlayer) {
        // AI decision sequence
        this.evaluateAndBuyInfrastructure(aiPlayer);
        this.evaluateAndCreateRoutes(aiPlayer);
        this.maintainTradeRights(aiPlayer);
        this.evaluateAndBidOnExclusiveRights(aiPlayer);
    }

    evaluateAndBuyInfrastructure(aiPlayer) {
        // AI considers buying depots in profitable systems
        if (aiPlayer.credits < 500) return;

        // Find systems with good export/import opportunities
        const profitableSystems = this.findProfitableSystems();

        for (const systemId of profitableSystems) {
            if (aiPlayer.credits >= 500 && Math.random() < aiPlayer.efficiency) {
                // Buy depot
                if (!aiPlayer.depots[systemId]) {
                    aiPlayer.depots[systemId] = 0;
                }
                if (aiPlayer.depots[systemId] === 0) {
                    aiPlayer.credits -= 500;
                    aiPlayer.depots[systemId]++;
                    break;
                }
            }
        }

        // AI considers buying warehouses on existing depot systems
        const depotsSystemIds = Object.keys(aiPlayer.depots).filter(
            (id) => aiPlayer.depots[id] > 0
        );
        for (const systemId of depotsSystemIds) {
            if (aiPlayer.credits >= 1000 && Math.random() < aiPlayer.efficiency * 0.7) {
                if (!aiPlayer.warehouses[systemId]) {
                    aiPlayer.warehouses[systemId] = 0;
                }
                if (aiPlayer.warehouses[systemId] < 2) {
                    aiPlayer.credits -= 1000;
                    aiPlayer.warehouses[systemId]++;
                    break;
                }
            }
        }

        // AI considers buying vehicles
        if (aiPlayer.credits >= 2000 && Math.random() < aiPlayer.aggression) {
            const vehicle = {
                id: `ai${aiPlayer.id}_vehicle_${aiPlayer.vehicles.length}`,
                name: `${aiPlayer.name} Transport-${aiPlayer.vehicles.length + 1}`,
                capacity: 100,
                speed: 1,
                assignedRoute: null,
                position: 0,
            };
            aiPlayer.vehicles.push(vehicle);
            aiPlayer.credits -= 2000;
        }
    }

    evaluateAndCreateRoutes(aiPlayer) {
        // Find available vehicles
        const availableVehicles = aiPlayer.vehicles.filter((v) => v.assignedRoute === null);
        if (availableVehicles.length === 0) return;

        // Find systems where AI has depots
        const aiDepotSystems = Object.keys(aiPlayer.depots)
            .filter((id) => aiPlayer.depots[id] > 0)
            .map((id) => parseInt(id));

        if (aiDepotSystems.length < 2) return;

        // Try to create a route
        const route = this.findBestRoute(aiPlayer, aiDepotSystems);
        if (route && availableVehicles.length > 0) {
            const vehicle = availableVehicles[0];
            aiPlayer.routes.push({
                id: `ai${aiPlayer.id}_route_${aiPlayer.routes.length}`,
                from: route.from,
                to: route.to,
                good: route.good,
                vehicleId: vehicle.id,
                path: route.path,
                buyPrice: route.buyPrice,
                sellPrice: route.sellPrice,
                profit: route.profit,
                active: true,
                hasExclusiveRights: false,
            });
            vehicle.assignedRoute = aiPlayer.routes[aiPlayer.routes.length - 1].id;
        }
    }

    findProfitableSystems() {
        // Returns system IDs sorted by profitability
        // Note: O(n²) complexity is acceptable for the expected game scale (100 systems)
        const systems = this.starSystemManager.starSystems;
        const scores = systems.map((sys) => {
            let score = 0;
            sys.exports.forEach((exp) => {
                systems.forEach((otherSys) => {
                    if (otherSys.id !== sys.id) {
                        const imp = otherSys.imports.find((i) => i.id === exp.id);
                        if (imp) {
                            score += imp.price - exp.price;
                        }
                    }
                });
            });
            return { id: sys.id, score };
        });

        scores.sort((a, b) => b.score - a.score);
        return scores.slice(0, 10).map((s) => s.id);
    }

    findBestRoute(aiPlayer, depotSystems) {
        let bestRoute = null;
        let bestProfit = 0;

        for (const fromId of depotSystems) {
            const fromSystem = this.starSystemManager.getSystem(fromId);
            for (const toId of depotSystems) {
                if (fromId === toId) continue;
                const toSystem = this.starSystemManager.getSystem(toId);

                const path = this.starSystemManager.findPath(fromId, toId);
                if (!path) continue;

                // Check each export/import combination
                fromSystem.exports.forEach((exp) => {
                    const imp = toSystem.imports.find((i) => i.id === exp.id);
                    if (imp) {
                        // Check if route is blocked by exclusive trade rights
                        if (this.routeManager.isRouteBlocked(fromId, toId, exp.id, this)) {
                            return; // Skip this route, it's blocked
                        }

                        const profit = imp.price - exp.price;
                        if (profit > bestProfit) {
                            bestProfit = profit;
                            bestRoute = {
                                from: fromId,
                                to: toId,
                                good: exp.id,
                                path: path,
                                buyPrice: exp.price,
                                sellPrice: imp.price,
                                profit: profit,
                            };
                        }
                    }
                });
            }
        }

        return bestRoute;
    }

    maintainTradeRights(aiPlayer) {
        // Pay maintenance for exclusive trade rights
        const maintenanceCost = aiPlayer.tradeRights.length * 100; // 100cr per trade right per day
        if (aiPlayer.credits >= maintenanceCost) {
            aiPlayer.credits -= maintenanceCost;
        } else {
            // Can't afford maintenance - lose some trade rights (oldest first)
            const rightsToLose = Math.ceil((maintenanceCost - aiPlayer.credits) / 100);
            const lostRights = aiPlayer.tradeRights.splice(0, rightsToLose);
            // Update routes that lost their exclusive status
            lostRights.forEach((right) => {
                const route = aiPlayer.routes.find((r) => r.id === right.routeId);
                if (route) route.hasExclusiveRights = false;
            });
        }
    }

    evaluateAndBidOnExclusiveRights(aiPlayer) {
        // AI may try to acquire exclusive rights to a route
        if (aiPlayer.credits < 5000 || Math.random() > aiPlayer.aggression) return;

        const activeRoutes = aiPlayer.routes.filter((r) => r.active && !r.hasExclusiveRights);
        if (activeRoutes.length === 0) return;

        // Pick a random profitable route
        const route = activeRoutes[Math.floor(Math.random() * activeRoutes.length)];
        const exclusiveCost = 5000; // Base cost for exclusive rights

        if (aiPlayer.credits >= exclusiveCost) {
            aiPlayer.credits -= exclusiveCost;
            route.hasExclusiveRights = true;
            aiPlayer.tradeRights.push({
                from: route.from,
                to: route.to,
                good: route.good,
                routeId: route.id,
            });
        }
    }

    // Process all AI routes and earn income
    processAIRoutes(aiPlayer) {
        let totalEarned = 0;

        aiPlayer.routes.forEach((route) => {
            if (route.active) {
                const vehicle = aiPlayer.vehicles.find((v) => v.id === route.vehicleId);
                if (!vehicle) return;

                // Update vehicle position
                vehicle.position += vehicle.speed * 0.2;
                if (vehicle.position >= 1) {
                    vehicle.position = 0;

                    // Calculate profit
                    const cargo = vehicle.capacity;
                    const tripProfit = route.profit * cargo;

                    const fromWarehouse = aiPlayer.warehouses[route.from] || 0;
                    const toWarehouse = aiPlayer.warehouses[route.to] || 0;
                    const warehouseBonus = (fromWarehouse + toWarehouse) * 0.1;

                    const totalProfit = Math.floor(tripProfit * (1 + warehouseBonus));
                    aiPlayer.credits += totalProfit;
                    totalEarned += totalProfit;
                }
            }
        });

        return totalEarned;
    }

    // Get total depot count for an AI player
    getAIDepotCount(aiPlayer) {
        return Object.values(aiPlayer.depots).reduce((a, b) => a + b, 0);
    }

    // Get total warehouse count for an AI player
    getAIWarehouseCount(aiPlayer) {
        return Object.values(aiPlayer.warehouses).reduce((a, b) => a + b, 0);
    }

    // Get active routes count for an AI player
    getAIActiveRoutesCount(aiPlayer) {
        return aiPlayer.routes.filter((r) => r.active).length;
    }
}
