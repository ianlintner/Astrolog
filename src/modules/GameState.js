// GameState.js - Manages core game state and economy
export class GameState {
    constructor() {
        this.credits = 10000;
        this.day = 1;
        this.depots = {}; // systemId -> count
        this.warehouses = {}; // systemId -> count
        this.portSlots = {}; // systemId -> slots (start with 2)

        this.goodsTypes = [
            { id: 'electronics', name: 'Electronics', basePrice: 100, color: '#00f' },
            { id: 'minerals', name: 'Minerals', basePrice: 50, color: '#888' },
            { id: 'food', name: 'Food', basePrice: 30, color: '#0f0' },
            { id: 'medicine', name: 'Medicine', basePrice: 150, color: '#f0f' },
            { id: 'machinery', name: 'Machinery', basePrice: 200, color: '#f80' },
            { id: 'luxury', name: 'Luxury Goods', basePrice: 300, color: '#ff0' },
        ];
    }

    initializeSystem(systemId) {
        this.depots[systemId] = 0;
        this.warehouses[systemId] = 0;
        this.portSlots[systemId] = 2;
    }

    canAfford(amount) {
        return this.credits >= amount;
    }

    spend(amount) {
        if (this.canAfford(amount)) {
            this.credits -= amount;
            return true;
        }
        return false;
    }

    earn(amount) {
        this.credits += amount;
    }

    advanceDay() {
        this.day++;
    }

    getDepotCount(systemId) {
        return this.depots[systemId] || 0;
    }

    getWarehouseCount(systemId) {
        return this.warehouses[systemId] || 0;
    }

    getPortSlots(systemId) {
        return this.portSlots[systemId] || 2;
    }

    addDepot(systemId) {
        this.depots[systemId] = (this.depots[systemId] || 0) + 1;
    }

    addWarehouse(systemId) {
        this.warehouses[systemId] = (this.warehouses[systemId] || 0) + 1;
    }

    addPortSlot(systemId) {
        this.portSlots[systemId] = (this.portSlots[systemId] || 2) + 1;
    }

    getTotalDepots() {
        return Object.values(this.depots).reduce((a, b) => a + b, 0);
    }

    getTotalWarehouses() {
        return Object.values(this.warehouses).reduce((a, b) => a + b, 0);
    }

    getGoodByName(goodId) {
        return this.goodsTypes.find((g) => g.id === goodId);
    }
}
