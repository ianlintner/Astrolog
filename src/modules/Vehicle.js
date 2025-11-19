// Vehicle.js - Vehicle fleet management
export class VehicleManager {
    constructor() {
        this.vehicles = [];
    }

    createVehicle() {
        const vehicle = {
            id: this.vehicles.length,
            name: `Transport-${this.vehicles.length + 1}`,
            capacity: 100,
            speed: 1,
            assignedRoute: null,
            position: 0,
        };
        this.vehicles.push(vehicle);
        return vehicle;
    }

    getVehicle(id) {
        return this.vehicles[id];
    }

    getAvailableVehicles() {
        return this.vehicles.filter((v) => v.assignedRoute === null);
    }

    assignVehicleToRoute(vehicleId, routeId) {
        const vehicle = this.vehicles[vehicleId];
        if (vehicle) {
            vehicle.assignedRoute = routeId;
            vehicle.position = 0;
            return true;
        }
        return false;
    }

    updateVehiclePosition(vehicleId, delta) {
        const vehicle = this.vehicles[vehicleId];
        if (vehicle && vehicle.assignedRoute !== null) {
            vehicle.position += delta;
            if (vehicle.position >= 1) {
                vehicle.position = 0;
                return true; // Completed trip
            }
        }
        return false;
    }

    getCount() {
        return this.vehicles.length;
    }
}
