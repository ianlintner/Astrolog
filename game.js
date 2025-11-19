// ====================================================================
// DEPRECATED: This file is kept for reference only
// ====================================================================
// The game has been modularized into separate ES6 modules.
// Please see src/game.js and src/modules/ for the current implementation.
// This file is no longer used by index.html.
// See ARCHITECTURE.md for details on the new module structure.
// ====================================================================

// Space Logistics Tycoon - Game Engine (LEGACY)
// A space-themed logistics management game

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.tooltip = document.getElementById('tooltip');

        // Resize canvas to fit container
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Game state
        this.credits = 10000;
        this.day = 1;
        this.selectedSystem = null;

        // Game entities
        this.starSystems = [];
        this.hyperLanes = [];
        this.vehicles = [];
        this.routes = [];
        this.depots = {}; // systemId -> count
        this.warehouses = {}; // systemId -> count
        this.portSlots = {}; // systemId -> slots

        // Goods types
        this.goodsTypes = [
            { id: 'electronics', name: 'Electronics', basePrice: 100, color: '#00f' },
            { id: 'minerals', name: 'Minerals', basePrice: 50, color: '#888' },
            { id: 'food', name: 'Food', basePrice: 30, color: '#0f0' },
            { id: 'medicine', name: 'Medicine', basePrice: 150, color: '#f0f' },
            { id: 'machinery', name: 'Machinery', basePrice: 200, color: '#f80' },
            { id: 'luxury', name: 'Luxury Goods', basePrice: 300, color: '#ff0' },
        ];

        // Camera controls
        this.camera = {
            x: 0,
            y: 0,
            zoom: 1,
            targetX: 0,
            targetY: 0,
        };

        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };

        // Initialize game
        this.generateStarSystems();
        this.generateHyperLanes();
        this.assignSystemEconomies();

        // Setup event listeners
        this.setupEventListeners();

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

    generateStarSystems() {
        const systemNames = [
            'Alpha',
            'Beta',
            'Gamma',
            'Delta',
            'Epsilon',
            'Zeta',
            'Eta',
            'Theta',
            'Iota',
            'Kappa',
            'Lambda',
            'Mu',
            'Nu',
            'Xi',
            'Omicron',
            'Pi',
            'Rho',
            'Sigma',
            'Tau',
            'Upsilon',
            'Phi',
            'Chi',
            'Psi',
            'Omega',
            'Andromeda',
            'Centauri',
            'Proxima',
            'Sirius',
            'Vega',
            'Rigel',
            'Betelgeuse',
            'Antares',
            'Aldebaran',
            'Spica',
            'Pollux',
            'Fomalhaut',
            'Deneb',
            'Regulus',
            'Adhara',
            'Castor',
        ];

        const suffixes = ['Prime', 'Secundus', 'Major', 'Minor', 'Central', 'Outer', 'Core', 'Rim'];

        // Generate 100 star systems in a 2D space
        const gridSize = 10;
        const cellSize = 150;

        for (let i = 0; i < 100; i++) {
            const baseName = systemNames[i % systemNames.length];
            const suffix =
                i >= systemNames.length
                    ? ` ${suffixes[Math.floor(i / systemNames.length) % suffixes.length]}`
                    : '';

            // Use a grid-like pattern with some randomness
            const gridX = (i % gridSize) * cellSize;
            const gridY = Math.floor(i / gridSize) * cellSize;

            const system = {
                id: i,
                name: baseName + suffix,
                x: gridX + (Math.random() - 0.5) * 80,
                y: gridY + (Math.random() - 0.5) * 80,
                population: Math.floor(Math.random() * 10) + 1,
                exports: [],
                imports: [],
                color: this.getRandomStarColor(),
            };

            this.starSystems.push(system);
            this.depots[i] = 0;
            this.warehouses[i] = 0;
            this.portSlots[i] = 2; // Start with 2 slots per system
        }

        // Center camera on the middle of the star field
        this.camera.x = -((gridSize * 150) / 2 - this.canvas.width / 2);
        this.camera.y = -((gridSize * 150) / 2 - this.canvas.height / 2);
        this.camera.targetX = this.camera.x;
        this.camera.targetY = this.camera.y;
    }

    getRandomStarColor() {
        const colors = ['#fff', '#ffa', '#aaf', '#faa', '#faf'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    generateHyperLanes() {
        // Connect nearby systems with hyperlanes
        const maxDistance = 180;

        for (let i = 0; i < this.starSystems.length; i++) {
            const sys1 = this.starSystems[i];

            // Find 2-4 nearest neighbors
            const distances = this.starSystems
                .map((sys2, idx) => ({
                    idx,
                    dist: Math.hypot(sys2.x - sys1.x, sys2.y - sys1.y),
                }))
                .filter((d) => d.idx !== i && d.dist < maxDistance)
                .sort((a, b) => a.dist - b.dist);

            const connectCount = Math.min(Math.floor(Math.random() * 2) + 2, distances.length);

            for (let j = 0; j < connectCount; j++) {
                const sys2Idx = distances[j].idx;

                // Check if lane already exists
                const exists = this.hyperLanes.some(
                    (lane) =>
                        (lane.from === i && lane.to === sys2Idx) ||
                        (lane.from === sys2Idx && lane.to === i)
                );

                if (!exists) {
                    this.hyperLanes.push({
                        from: i,
                        to: sys2Idx,
                    });
                }
            }
        }
    }

    assignSystemEconomies() {
        // Assign exports and imports to each system
        this.starSystems.forEach((system) => {
            const exportCount = Math.floor(Math.random() * 2) + 1;
            const importCount = Math.floor(Math.random() * 3) + 2;

            // Pick random goods for export
            const availableGoods = [...this.goodsTypes];
            for (let i = 0; i < exportCount; i++) {
                const idx = Math.floor(Math.random() * availableGoods.length);
                const good = availableGoods.splice(idx, 1)[0];
                system.exports.push({
                    ...good,
                    price: Math.floor(good.basePrice * (0.7 + Math.random() * 0.3)),
                });
            }

            // Pick random goods for import (excluding exports)
            const importPool = this.goodsTypes.filter(
                (g) => !system.exports.find((e) => e.id === g.id)
            );

            for (let i = 0; i < importCount && importPool.length > 0; i++) {
                const idx = Math.floor(Math.random() * importPool.length);
                const good = importPool.splice(idx, 1)[0];
                system.imports.push({
                    ...good,
                    price: Math.floor(good.basePrice * (1.3 + Math.random() * 0.5)),
                });
            }
        });
    }

    setupEventListeners() {
        // Mouse events for canvas
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('wheel', (e) => this.onWheel(e));
        this.canvas.addEventListener('mouseleave', () => this.hideTooltip());

        // UI buttons
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
    }

    onMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if clicking on a star system
        const worldX = (x - this.camera.x) / this.camera.zoom;
        const worldY = (y - this.camera.y) / this.camera.zoom;

        let clicked = false;
        for (const system of this.starSystems) {
            const dist = Math.hypot(system.x - worldX, system.y - worldY);
            if (dist < 8) {
                this.selectSystem(system);
                clicked = true;
                break;
            }
        }

        if (!clicked) {
            this.isDragging = true;
            this.dragStart = { x: e.clientX, y: e.clientY };
        }
    }

    onMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.isDragging) {
            const dx = e.clientX - this.dragStart.x;
            const dy = e.clientY - this.dragStart.y;
            this.camera.targetX = this.camera.x + dx;
            this.camera.targetY = this.camera.y + dy;
            this.camera.x = this.camera.targetX;
            this.camera.y = this.camera.targetY;
            this.dragStart = { x: e.clientX, y: e.clientY };
            return;
        }

        // Show tooltip for star system
        const worldX = (x - this.camera.x) / this.camera.zoom;
        const worldY = (y - this.camera.y) / this.camera.zoom;

        let found = false;
        for (const system of this.starSystems) {
            const dist = Math.hypot(system.x - worldX, system.y - worldY);
            if (dist < 8) {
                this.showTooltip(system, e.clientX, e.clientY);
                found = true;
                break;
            }
        }

        if (!found) {
            this.hideTooltip();
        }
    }

    onMouseUp() {
        this.isDragging = false;
    }

    onWheel(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        this.camera.zoom = Math.max(0.3, Math.min(2, this.camera.zoom * delta));
    }

    selectSystem(system) {
        this.selectedSystem = system;
        this.updateSelectedSystemUI();
        this.updateRouteSelectors();
    }

    updateSelectedSystemUI() {
        const container = document.getElementById('selected-system');
        if (!this.selectedSystem) {
            container.innerHTML = '<p>Click on a star system to select it</p>';
            return;
        }

        const sys = this.selectedSystem;
        const depotCount = this.depots[sys.id] || 0;
        const warehouseCount = this.warehouses[sys.id] || 0;
        const slotCount = this.portSlots[sys.id] || 0;

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

        // Update system selectors
        fromSelect.innerHTML = '<option value="">From System...</option>';
        toSelect.innerHTML = '<option value="">To System...</option>';

        this.starSystems.forEach((sys) => {
            const hasDepot = this.depots[sys.id] > 0;
            if (hasDepot) {
                fromSelect.innerHTML += `<option value="${sys.id}">${sys.name}</option>`;
                toSelect.innerHTML += `<option value="${sys.id}">${sys.name}</option>`;
            }
        });

        // Update goods selector
        goodSelect.innerHTML = '<option value="">Select Good...</option>';
        this.goodsTypes.forEach((good) => {
            goodSelect.innerHTML += `<option value="${good.id}">${good.name}</option>`;
        });
    }

    showTooltip(system, x, y) {
        const depots = this.depots[system.id] || 0;
        const warehouses = this.warehouses[system.id] || 0;

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

    buyDepot() {
        if (!this.selectedSystem) {
            alert('Please select a star system first');
            return;
        }
        if (this.credits < 500) {
            alert('Not enough credits!');
            return;
        }

        this.credits -= 500;
        this.depots[this.selectedSystem.id]++;
        this.updateUI();
        this.updateSelectedSystemUI();
        this.updateRouteSelectors();
    }

    buyWarehouse() {
        if (!this.selectedSystem) {
            alert('Please select a star system first');
            return;
        }
        if (this.credits < 1000) {
            alert('Not enough credits!');
            return;
        }

        this.credits -= 1000;
        this.warehouses[this.selectedSystem.id]++;
        this.updateUI();
        this.updateSelectedSystemUI();
    }

    buyVehicle() {
        if (this.credits < 2000) {
            alert('Not enough credits!');
            return;
        }

        this.credits -= 2000;
        this.vehicles.push({
            id: this.vehicles.length,
            name: `Transport-${this.vehicles.length + 1}`,
            capacity: 100,
            speed: 1,
            assignedRoute: null,
            position: 0, // 0 to 1 along route
        });
        this.updateUI();
        this.updateVehicleList();
    }

    buyPortSlot() {
        if (!this.selectedSystem) {
            alert('Please select a star system first');
            return;
        }
        if (this.credits < 1500) {
            alert('Not enough credits!');
            return;
        }

        this.credits -= 1500;
        this.portSlots[this.selectedSystem.id]++;
        this.updateUI();
        this.updateSelectedSystemUI();
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

        if (fromId === toId) {
            alert('From and To systems must be different');
            return;
        }

        const fromSystem = this.starSystems[fromId];
        const toSystem = this.starSystems[toId];
        const vehicle = this.vehicles[vehicleId];

        if (vehicle.assignedRoute !== null) {
            alert('Vehicle is already assigned to a route');
            return;
        }

        // Check if systems are connected
        const path = this.findPath(fromId, toId);
        if (!path) {
            alert('No hyperlane path exists between these systems');
            return;
        }

        // Check if good is exported from "from" system
        const exportGood = fromSystem.exports.find((g) => g.id === goodId);
        if (!exportGood) {
            alert(`${fromSystem.name} does not export this good`);
            return;
        }

        // Check if good is imported by "to" system
        const importGood = toSystem.imports.find((g) => g.id === goodId);
        if (!importGood) {
            alert(`${toSystem.name} does not import this good`);
            return;
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
        };

        this.routes.push(route);
        vehicle.assignedRoute = route.id;

        this.updateUI();
        this.updateRouteList();
        this.updateVehicleList();
    }

    findPath(fromId, toId) {
        // Simple BFS pathfinding
        const queue = [[fromId]];
        const visited = new Set([fromId]);

        while (queue.length > 0) {
            const path = queue.shift();
            const current = path[path.length - 1];

            if (current === toId) {
                return path;
            }

            // Find connected systems
            const connections = this.hyperLanes
                .filter((lane) => lane.from === current || lane.to === current)
                .map((lane) => (lane.from === current ? lane.to : lane.from));

            for (const next of connections) {
                if (!visited.has(next)) {
                    visited.add(next);
                    queue.push([...path, next]);
                }
            }
        }

        return null;
    }

    advanceDay() {
        this.day++;

        // Process active routes
        this.routes.forEach((route) => {
            if (route.active) {
                const vehicle = this.vehicles[route.vehicleId];

                // Move vehicle along path
                vehicle.position += vehicle.speed * 0.2;

                // If reached destination, complete delivery
                if (vehicle.position >= 1) {
                    vehicle.position = 0;

                    // Calculate profit based on cargo capacity
                    const cargo = vehicle.capacity;
                    const tripProfit = route.profit * cargo;

                    // Apply warehouse bonus
                    const fromWarehouse = this.warehouses[route.from] || 0;
                    const toWarehouse = this.warehouses[route.to] || 0;
                    const warehouseBonus = (fromWarehouse + toWarehouse) * 0.1;

                    const totalProfit = Math.floor(tripProfit * (1 + warehouseBonus));

                    this.credits += totalProfit;
                }
            }
        });

        this.updateUI();
    }

    updateUI() {
        document.getElementById('credits').textContent = this.credits;
        document.getElementById('day').textContent = this.day;

        const vehicleCount = this.vehicles.length;
        const depotCount = Object.values(this.depots).reduce((a, b) => a + b, 0);
        const warehouseCount = Object.values(this.warehouses).reduce((a, b) => a + b, 0);
        const routeCount = this.routes.filter((r) => r.active).length;

        document.getElementById('vehicle-count').textContent = vehicleCount;
        document.getElementById('depot-count').textContent = depotCount;
        document.getElementById('warehouse-count').textContent = warehouseCount;
        document.getElementById('route-count').textContent = routeCount;

        // Update daily income
        let dailyIncome = 0;
        this.routes.forEach((route) => {
            if (route.active) {
                const vehicle = this.vehicles[route.vehicleId];
                const tripsPerDay = vehicle.speed * 0.2;
                const profitPerTrip = route.profit * vehicle.capacity;
                dailyIncome += profitPerTrip * tripsPerDay;
            }
        });

        document.getElementById('daily-income').textContent = Math.floor(dailyIncome);

        // Update vehicle selector
        const vehicleSelect = document.getElementById('route-vehicle');
        vehicleSelect.innerHTML = '<option value="">Select Vehicle...</option>';
        this.vehicles.forEach((v) => {
            if (v.assignedRoute === null) {
                vehicleSelect.innerHTML += `<option value="${v.id}">${v.name}</option>`;
            }
        });
    }

    updateRouteList() {
        const container = document.getElementById('route-list');

        if (this.routes.length === 0) {
            container.innerHTML = '<p style="color: #666;">No active routes</p>';
            return;
        }

        let html = '';
        this.routes.forEach((route) => {
            if (route.active) {
                const fromSystem = this.starSystems[route.from];
                const toSystem = this.starSystems[route.to];
                const good = this.goodsTypes.find((g) => g.id === route.good);
                const vehicle = this.vehicles[route.vehicleId];
                const profitClass = route.profit > 0 ? 'profit' : 'loss';

                html += `
                    <div class="item">
                        <strong>${vehicle.name}</strong><br>
                        ${fromSystem.name} → ${toSystem.name}<br>
                        ${good.name}<br>
                        <span class="${profitClass}">Profit: ${route.profit}cr/unit</span>
                    </div>
                `;
            }
        });

        container.innerHTML = html;
    }

    updateVehicleList() {
        const container = document.getElementById('vehicle-list');

        if (this.vehicles.length === 0) {
            container.innerHTML = '<p style="color: #666;">No vehicles</p>';
            return;
        }

        let html = '';
        this.vehicles.forEach((v) => {
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

    gameLoop() {
        const now = Date.now();
        const dt = (now - this.lastTime) / 1000;
        this.lastTime = now;

        this.update(dt);
        this.render();

        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        // Smooth camera movement
        const smoothing = 0.1;
        this.camera.x += (this.camera.targetX - this.camera.x) * smoothing;
        this.camera.y += (this.camera.targetY - this.camera.y) * smoothing;
    }

    render() {
        const ctx = this.ctx;
        const cam = this.camera;

        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.save();
        ctx.translate(cam.x, cam.y);
        ctx.scale(cam.zoom, cam.zoom);

        // Draw hyperlanes
        ctx.strokeStyle = '#003300';
        ctx.lineWidth = 1;
        this.hyperLanes.forEach((lane) => {
            const sys1 = this.starSystems[lane.from];
            const sys2 = this.starSystems[lane.to];

            ctx.beginPath();
            ctx.moveTo(sys1.x, sys1.y);
            ctx.lineTo(sys2.x, sys2.y);
            ctx.stroke();
        });

        // Draw active routes
        this.routes.forEach((route) => {
            if (route.active) {
                const vehicle = this.vehicles[route.vehicleId];

                // Draw route path in green
                ctx.strokeStyle = '#0f0';
                ctx.lineWidth = 2;
                ctx.beginPath();

                for (let i = 0; i < route.path.length - 1; i++) {
                    const sys1 = this.starSystems[route.path[i]];
                    const sys2 = this.starSystems[route.path[i + 1]];

                    if (i === 0) {
                        ctx.moveTo(sys1.x, sys1.y);
                    }
                    ctx.lineTo(sys2.x, sys2.y);
                }
                ctx.stroke();

                // Draw vehicle
                const pathIndex = Math.floor(vehicle.position * (route.path.length - 1));
                const nextIndex = Math.min(pathIndex + 1, route.path.length - 1);
                const t = vehicle.position * (route.path.length - 1) - pathIndex;

                const sys1 = this.starSystems[route.path[pathIndex]];
                const sys2 = this.starSystems[route.path[nextIndex]];

                const vx = sys1.x + (sys2.x - sys1.x) * t;
                const vy = sys1.y + (sys2.y - sys1.y) * t;

                ctx.fillStyle = '#ff0';
                ctx.beginPath();
                ctx.arc(vx, vy, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // Draw star systems
        this.starSystems.forEach((system) => {
            const hasDepot = this.depots[system.id] > 0;
            const hasWarehouse = this.warehouses[system.id] > 0;

            // Draw system
            ctx.fillStyle = system.color;
            ctx.beginPath();
            ctx.arc(system.x, system.y, 5, 0, Math.PI * 2);
            ctx.fill();

            // Draw depot indicator
            if (hasDepot) {
                ctx.strokeStyle = '#0f0';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(system.x, system.y, 8, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Draw warehouse indicator
            if (hasWarehouse) {
                ctx.strokeStyle = '#00f';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(system.x, system.y, 11, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Highlight selected system
            if (this.selectedSystem && this.selectedSystem.id === system.id) {
                ctx.strokeStyle = '#ff0';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(system.x, system.y, 14, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Draw system name for zoomed in view
            if (cam.zoom > 0.7) {
                ctx.fillStyle = '#0f0';
                ctx.font = '10px Courier New';
                ctx.textAlign = 'center';
                ctx.fillText(system.name, system.x, system.y - 12);
            }
        });

        ctx.restore();

        // Draw instructions
        ctx.fillStyle = '#0f0';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText('Drag to pan | Scroll to zoom | Click systems to select', 10, 20);
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new Game();
});
