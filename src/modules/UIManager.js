// UIManager.js - UI panel management
export class UIManager {
    constructor(gameState, starSystemManager, vehicleManager, routeManager, aiCompetitorManager) {
        this.gameState = gameState;
        this.starSystemManager = starSystemManager;
        this.vehicleManager = vehicleManager;
        this.routeManager = routeManager;
        this.aiCompetitorManager = aiCompetitorManager;

        this.selectedSystem = null;
        this.tooltip = document.getElementById('tooltip');

        this.saveManager = null;
        this.saveCallback = null;
        this.resetCallback = null;

        this.setupButtonListeners();
    }

    setSaveManager(saveManager, saveCallback, resetCallback) {
        this.saveManager = saveManager;
        this.saveCallback = saveCallback;
        this.resetCallback = resetCallback;
        this.setupSaveButtonListeners();
    }

    setupButtonListeners() {
        document.getElementById('btn-buy-depot').addEventListener('click', () => this.buyDepot());
        document
            .getElementById('btn-buy-warehouse')
            .addEventListener('click', () => this.buyWarehouse());
        document
            .getElementById('btn-buy-vehicle')
            .addEventListener('click', () => this.buyVehicle());
        document.getElementById('btn-buy-slot').addEventListener('click', () => this.buyPortSlot());
        document
            .getElementById('btn-create-route')
            .addEventListener('click', () => this.createRoute());
        document
            .getElementById('btn-buy-exclusive')
            .addEventListener('click', () => this.buyExclusiveRights());
    }

    setupSaveButtonListeners() {
        const saveBtn = document.getElementById('btn-save-game');
        const resetBtn = document.getElementById('btn-reset-game');

        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveGame());
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetGame());
        }
    }

    saveGame() {
        if (this.saveCallback) {
            const success = this.saveCallback();
            if (success) {
                alert('Game saved successfully!');
            } else {
                alert('Failed to save game.');
            }
        }
    }

    resetGame() {
        if (this.resetCallback) {
            if (
                confirm(
                    'Are you sure you want to start a new game? Your current progress will be lost.'
                )
            ) {
                this.resetCallback();
            }
        }
    }

    setSelectedSystem(system) {
        this.selectedSystem = system;
        this.updateSelectedSystemUI();
        this.updateRouteSelectors();
    }

    buyDepot() {
        if (!this.selectedSystem) {
            alert('Please select a star system first');
            return;
        }
        if (!this.gameState.spend(500)) {
            alert('Not enough credits!');
            return;
        }

        this.gameState.addDepot(this.selectedSystem.id);
        this.updateAll();
    }

    buyWarehouse() {
        if (!this.selectedSystem) {
            alert('Please select a star system first');
            return;
        }
        if (!this.gameState.spend(1000)) {
            alert('Not enough credits!');
            return;
        }

        this.gameState.addWarehouse(this.selectedSystem.id);
        this.updateAll();
    }

    buyVehicle() {
        if (!this.gameState.spend(2000)) {
            alert('Not enough credits!');
            return;
        }

        this.vehicleManager.createVehicle();
        this.updateAll();
    }

    buyPortSlot() {
        if (!this.selectedSystem) {
            alert('Please select a star system first');
            return;
        }
        if (!this.gameState.spend(1500)) {
            alert('Not enough credits!');
            return;
        }

        this.gameState.addPortSlot(this.selectedSystem.id);
        this.updateAll();
    }

    createRoute() {
        const fromId = parseInt(document.getElementById('route-from').value);
        const toId = parseInt(document.getElementById('route-to').value);
        const goodId = document.getElementById('route-good').value;
        const vehicleId = parseInt(document.getElementById('route-vehicle').value);

        if (isNaN(fromId) || isNaN(toId) || !goodId || isNaN(vehicleId)) {
            alert('Please fill all route fields');
            return;
        }

        const result = this.routeManager.createRoute(fromId, toId, goodId, vehicleId);

        if (!result.success) {
            alert(result.error);
            return;
        }

        this.updateAll();
    }

    updateAll() {
        this.updateStats();
        this.updateSelectedSystemUI();
        this.updateRouteSelectors();
        this.updateRouteList();
        this.updateVehicleList();
    }

    updateStats() {
        document.getElementById('credits').textContent = this.gameState.credits;
        document.getElementById('day').textContent = this.gameState.day;
        document.getElementById('vehicle-count').textContent = this.vehicleManager.getCount();
        document.getElementById('depot-count').textContent = this.gameState.getTotalDepots();
        document.getElementById('warehouse-count').textContent =
            this.gameState.getTotalWarehouses();
        document.getElementById('route-count').textContent =
            this.routeManager.getActiveRoutes().length;
        document.getElementById('daily-income').textContent =
            this.routeManager.calculateDailyIncome();
        document.getElementById('trade-rights-count').textContent =
            this.gameState.tradeRights.length;
        document.getElementById('maintenance-cost').textContent =
            this.gameState.getTradeRightsMaintenance();

        const vehicleSelect = document.getElementById('route-vehicle');
        vehicleSelect.innerHTML = '<option value="">Select Vehicle...</option>';
        this.vehicleManager.getAvailableVehicles().forEach((v) => {
            vehicleSelect.innerHTML += `<option value="${v.id}">${v.name}</option>`;
        });

        this.updateExclusiveRouteSelector();
        this.updateAICompetitors();
    }

    updateSelectedSystemUI() {
        const container = document.getElementById('selected-system');
        if (!this.selectedSystem) {
            container.innerHTML = '<p>Click on a star system to select it</p>';
            return;
        }

        const sys = this.selectedSystem;
        const depotCount = this.gameState.getDepotCount(sys.id);
        const warehouseCount = this.gameState.getWarehouseCount(sys.id);
        const slotCount = this.gameState.getPortSlots(sys.id);

        let html = `
            <div class="stat clearfix">
                <span class="stat-label">Name:</span>
                <span class="stat-value">${sys.name}</span>
            </div>
            <div class="stat clearfix">
                <span class="stat-label">Population:</span>
                <span class="stat-value">${sys.population}M</span>
            </div>
            <div class="stat clearfix">
                <span class="stat-label">Depots:</span>
                <span class="stat-value">${depotCount}</span>
            </div>
            <div class="stat clearfix">
                <span class="stat-label">Warehouses:</span>
                <span class="stat-value">${warehouseCount}</span>
            </div>
            <div class="stat clearfix">
                <span class="stat-label">Port Slots:</span>
                <span class="stat-value">${slotCount}</span>
            </div>
            <h3>Exports (Buy)</h3>
        `;

        sys.exports.forEach((good) => {
            html += `<div class="item">${good.name}: ${good.price}cr</div>`;
        });

        html += '<h3>Imports (Sell)</h3>';
        sys.imports.forEach((good) => {
            html += `<div class="item">${good.name}: ${good.price}cr</div>`;
        });

        container.innerHTML = html;
    }

    updateRouteSelectors() {
        const fromSelect = document.getElementById('route-from');
        const toSelect = document.getElementById('route-to');
        const goodSelect = document.getElementById('route-good');

        fromSelect.innerHTML = '<option value="">From System...</option>';
        toSelect.innerHTML = '<option value="">To System...</option>';

        this.starSystemManager.starSystems.forEach((sys) => {
            const hasDepot = this.gameState.getDepotCount(sys.id) > 0;
            if (hasDepot) {
                fromSelect.innerHTML += `<option value="${sys.id}">${sys.name}</option>`;
                toSelect.innerHTML += `<option value="${sys.id}">${sys.name}</option>`;
            }
        });

        goodSelect.innerHTML = '<option value="">Select Good...</option>';
        this.gameState.goodsTypes.forEach((good) => {
            goodSelect.innerHTML += `<option value="${good.id}">${good.name}</option>`;
        });
    }

    updateRouteList() {
        const container = document.getElementById('route-list');
        const routes = this.routeManager.getActiveRoutes();

        if (routes.length === 0) {
            container.innerHTML = '<p style="color: #666;">No active routes</p>';
            return;
        }

        let html = '';
        routes.forEach((route) => {
            const fromSystem = this.starSystemManager.getSystem(route.from);
            const toSystem = this.starSystemManager.getSystem(route.to);
            const good = this.gameState.getGoodByName(route.good);
            const vehicle = this.vehicleManager.getVehicle(route.vehicleId);
            const profitClass = route.profit > 0 ? 'profit' : 'loss';
            const exclusiveBadge = route.hasExclusiveRights
                ? '<span style="color: #ff0;">🔒 Exclusive</span><br>'
                : '';

            html += `
                <div class="item">
                    <strong>${vehicle.name}</strong><br>
                    ${fromSystem.name} → ${toSystem.name}<br>
                    ${good.name}<br>
                    ${exclusiveBadge}
                    <span class="${profitClass}">Profit: ${route.profit}cr/unit</span>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    updateVehicleList() {
        const container = document.getElementById('vehicle-list');

        if (this.vehicleManager.vehicles.length === 0) {
            container.innerHTML = '<p style="color: #666;">No vehicles</p>';
            return;
        }

        let html = '';
        this.vehicleManager.vehicles.forEach((v) => {
            const status = v.assignedRoute !== null ? 'Active' : 'Idle';
            const statusColor = v.assignedRoute !== null ? '#0f0' : '#f80';

            html += `
                <div class="item">
                    <strong>${v.name}</strong><br>
                    Capacity: ${v.capacity} units<br>
                    Status: <span style="color: ${statusColor}">${status}</span>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    showTooltip(system, x, y) {
        const depots = this.gameState.getDepotCount(system.id);
        const warehouses = this.gameState.getWarehouseCount(system.id);

        this.tooltip.innerHTML = `
            <strong>${system.name}</strong><br>
            Pop: ${system.population}M<br>
            Depots: ${depots}<br>
            Warehouses: ${warehouses}<br>
            Exports: ${system.exports.map((g) => g.name).join(', ')}<br>
            Imports: ${system.imports.map((g) => g.name).join(', ')}
        `;
        this.tooltip.style.left = x + 15 + 'px';
        this.tooltip.style.top = y + 15 + 'px';
        this.tooltip.style.display = 'block';
    }

    hideTooltip() {
        this.tooltip.style.display = 'none';
    }

    buyExclusiveRights() {
        const routeIdStr = document.getElementById('exclusive-route').value;
        if (!routeIdStr) {
            alert('Please select a route');
            return;
        }
        const routeId = parseInt(routeIdStr);

        const result = this.routeManager.purchaseExclusiveRights(routeId);

        if (!result.success) {
            alert(result.error);
            return;
        }

        alert('Exclusive trade rights purchased! This route is now protected from AI competition.');
        this.updateAll();
    }

    updateExclusiveRouteSelector() {
        const select = document.getElementById('exclusive-route');
        select.innerHTML = '<option value="">Select Your Route...</option>';

        const routes = this.routeManager.getActiveRoutes();
        routes.forEach((route) => {
            if (!route.hasExclusiveRights) {
                const fromSystem = this.starSystemManager.getSystem(route.from);
                const toSystem = this.starSystemManager.getSystem(route.to);
                const good = this.gameState.getGoodByName(route.good);
                select.innerHTML += `<option value="${route.id}">${fromSystem.name} → ${toSystem.name} (${good.name})</option>`;
            }
        });
    }

    updateAICompetitors() {
        const container = document.getElementById('ai-competitors');
        if (!this.aiCompetitorManager) {
            container.innerHTML = '<p style="color: #666;">No AI competitors</p>';
            return;
        }

        const aiPlayers = this.aiCompetitorManager.getAllAIPlayers();
        if (aiPlayers.length === 0) {
            container.innerHTML = '<p style="color: #666;">No AI competitors</p>';
            return;
        }

        let html = '';
        aiPlayers.forEach((ai) => {
            const depots = this.aiCompetitorManager.getAIDepotCount(ai);
            const warehouses = this.aiCompetitorManager.getAIWarehouseCount(ai);
            const routes = this.aiCompetitorManager.getAIActiveRoutesCount(ai);

            html += `
                <div class="item">
                    <strong>${ai.name}</strong><br>
                    Credits: ${Math.floor(ai.credits)}cr<br>
                    Vehicles: ${ai.vehicles.length}<br>
                    Depots: ${depots}<br>
                    Warehouses: ${warehouses}<br>
                    Routes: ${routes}<br>
                    Trade Rights: ${ai.tradeRights.length}
                </div>
            `;
        });

        container.innerHTML = html;
    }
}
