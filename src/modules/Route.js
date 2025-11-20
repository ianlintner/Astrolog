// Route.js - Trade route management
export class RouteManager {
    constructor(gameState, starSystemManager, vehicleManager) {
        this.gameState = gameState;
        this.starSystemManager = starSystemManager;
        this.vehicleManager = vehicleManager;
        this.routes = [];
    }

    createRoute(fromId, toId, goodId, vehicleId) {
        const fromSystem = this.starSystemManager.getSystem(fromId);
        const toSystem = this.starSystemManager.getSystem(toId);
        const vehicle = this.vehicleManager.getVehicle(vehicleId);

        if (!fromSystem || !toSystem || !vehicle) {
            return { success: false, error: 'Invalid parameters' };
        }

        if (fromId === toId) {
            return { success: false, error: 'From and To systems must be different' };
        }

        if (vehicle.assignedRoute !== null) {
            return { success: false, error: 'Vehicle is already assigned to a route' };
        }

        const path = this.starSystemManager.findPath(fromId, toId);
        if (!path) {
            return { success: false, error: 'No hyperlane path exists between these systems' };
        }

        const exportGood = fromSystem.exports.find((g) => g.id === goodId);
        if (!exportGood) {
            return { success: false, error: `${fromSystem.name} does not export this good` };
        }

        const importGood = toSystem.imports.find((g) => g.id === goodId);
        if (!importGood) {
            return { success: false, error: `${toSystem.name} does not import this good` };
        }

        const profit = importGood.price - exportGood.price;

        const route = {
            id: this.routes.length,
            from: fromId,
            to: toId,
            good: goodId,
            vehicleId: vehicleId,
            path: path,
            buyPrice: exportGood.price,
            sellPrice: importGood.price,
            profit: profit,
            active: true,
            hasExclusiveRights: false,
        };

        this.routes.push(route);
        this.vehicleManager.assignVehicleToRoute(vehicleId, route.id);

        return { success: true, route };
    }

    processRoutes() {
        let totalEarned = 0;

        this.routes.forEach((route) => {
            if (route.active) {
                const vehicle = this.vehicleManager.getVehicle(route.vehicleId);
                const completed = this.vehicleManager.updateVehiclePosition(
                    route.vehicleId,
                    vehicle.speed * 0.2
                );

                if (completed) {
                    const cargo = vehicle.capacity;
                    const tripProfit = route.profit * cargo;

                    const fromWarehouse = this.gameState.getWarehouseCount(route.from);
                    const toWarehouse = this.gameState.getWarehouseCount(route.to);
                    const warehouseBonus = (fromWarehouse + toWarehouse) * 0.1;

                    const totalProfit = Math.floor(tripProfit * (1 + warehouseBonus));
                    this.gameState.earn(totalProfit);
                    totalEarned += totalProfit;
                }
            }
        });

        return totalEarned;
    }

    getActiveRoutes() {
        return this.routes.filter((r) => r.active);
    }

    calculateDailyIncome() {
        let dailyIncome = 0;
        this.routes.forEach((route) => {
            if (route.active) {
                const vehicle = this.vehicleManager.getVehicle(route.vehicleId);
                const tripsPerDay = vehicle.speed * 0.2;
                const profitPerTrip = route.profit * vehicle.capacity;
                dailyIncome += profitPerTrip * tripsPerDay;
            }
        });
        return Math.floor(dailyIncome);
    }

    // Purchase exclusive trade rights for a route
    purchaseExclusiveRights(routeId) {
        const route = this.routes.find((r) => r.id === routeId);
        if (!route) {
            return { success: false, error: 'Route not found' };
        }

        if (route.hasExclusiveRights) {
            return { success: false, error: 'Route already has exclusive rights' };
        }

        const cost = 5000; // Base cost for exclusive rights
        if (!this.gameState.spend(cost)) {
            return { success: false, error: 'Not enough credits' };
        }

        route.hasExclusiveRights = true;
        this.gameState.addTradeRight(route.from, route.to, route.good, route.id);

        return { success: true };
    }

    // Check if a route conflicts with existing exclusive rights
    isRouteBlocked(fromId, toId, goodId, aiCompetitorManager) {
        // Check if player has exclusive rights
        if (this.gameState.hasTradeRight(fromId, toId, goodId)) {
            return false; // Player owns it, not blocked
        }

        // Check if any AI has exclusive rights
        if (aiCompetitorManager) {
            for (const aiPlayer of aiCompetitorManager.getAllAIPlayers()) {
                const hasRight = aiPlayer.tradeRights.some(
                    (tr) => tr.from === fromId && tr.to === toId && tr.good === goodId
                );
                if (hasRight) {
                    return true; // Blocked by AI
                }
            }
        }

        return false;
    }
}
