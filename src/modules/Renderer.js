// Renderer.js - Canvas rendering engine
export class Renderer {
    constructor(canvas, starSystemManager, gameState, vehicleManager, routeManager) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.starSystemManager = starSystemManager;
        this.gameState = gameState;
        this.vehicleManager = vehicleManager;
        this.routeManager = routeManager;

        this.camera = {
            x: 0,
            y: 0,
            zoom: 1,
            targetX: 0,
            targetY: 0,
        };

        this.selectedSystem = null;
    }

    setSelectedSystem(system) {
        this.selectedSystem = system;
    }

    centerCamera(centerX, centerY) {
        this.camera.x = -(centerX - this.canvas.width / 2);
        this.camera.y = -(centerY - this.canvas.height / 2);
        this.camera.targetX = this.camera.x;
        this.camera.targetY = this.camera.y;
    }

    updateCamera() {
        const smoothing = 0.1;
        this.camera.x += (this.camera.targetX - this.camera.x) * smoothing;
        this.camera.y += (this.camera.targetY - this.camera.y) * smoothing;
    }

    panCamera(dx, dy) {
        this.camera.targetX = this.camera.x + dx;
        this.camera.targetY = this.camera.y + dy;
        this.camera.x = this.camera.targetX;
        this.camera.y = this.camera.targetY;
    }

    zoomCamera(delta) {
        this.camera.zoom = Math.max(0.3, Math.min(2, this.camera.zoom * delta));
    }

    worldToScreen(worldX, worldY) {
        return {
            x: worldX * this.camera.zoom + this.camera.x,
            y: worldY * this.camera.zoom + this.camera.y,
        };
    }

    screenToWorld(screenX, screenY) {
        return {
            x: (screenX - this.camera.x) / this.camera.zoom,
            y: (screenY - this.camera.y) / this.camera.zoom,
        };
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

        this.renderHyperLanes(ctx);
        this.renderActiveRoutes(ctx);
        this.renderStarSystems(ctx);

        ctx.restore();

        this.renderInstructions(ctx);
    }

    renderHyperLanes(ctx) {
        ctx.strokeStyle = '#003300';
        ctx.lineWidth = 1;
        this.starSystemManager.hyperLanes.forEach((lane) => {
            const sys1 = this.starSystemManager.starSystems[lane.from];
            const sys2 = this.starSystemManager.starSystems[lane.to];

            ctx.beginPath();
            ctx.moveTo(sys1.x, sys1.y);
            ctx.lineTo(sys2.x, sys2.y);
            ctx.stroke();
        });
    }

    renderActiveRoutes(ctx) {
        this.routeManager.routes.forEach((route) => {
            if (route.active) {
                const vehicle = this.vehicleManager.getVehicle(route.vehicleId);

                // Draw route path
                ctx.strokeStyle = '#0f0';
                ctx.lineWidth = 2;
                ctx.beginPath();

                for (let i = 0; i < route.path.length - 1; i++) {
                    const sys1 = this.starSystemManager.starSystems[route.path[i]];
                    const sys2 = this.starSystemManager.starSystems[route.path[i + 1]];

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

                const sys1 = this.starSystemManager.starSystems[route.path[pathIndex]];
                const sys2 = this.starSystemManager.starSystems[route.path[nextIndex]];

                const vx = sys1.x + (sys2.x - sys1.x) * t;
                const vy = sys1.y + (sys2.y - sys1.y) * t;

                ctx.fillStyle = '#ff0';
                ctx.beginPath();
                ctx.arc(vx, vy, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    renderStarSystems(ctx) {
        this.starSystemManager.starSystems.forEach((system) => {
            const hasDepot = this.gameState.getDepotCount(system.id) > 0;
            const hasWarehouse = this.gameState.getWarehouseCount(system.id) > 0;

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
            if (this.camera.zoom > 0.7) {
                ctx.fillStyle = '#0f0';
                ctx.font = '10px Courier New';
                ctx.textAlign = 'center';
                ctx.fillText(system.name, system.x, system.y - 12);
            }
        });
    }

    renderInstructions(ctx) {
        ctx.fillStyle = '#0f0';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText('Drag to pan | Scroll to zoom | Click systems to select', 10, 20);
    }

    findSystemAtPosition(worldX, worldY) {
        for (const system of this.starSystemManager.starSystems) {
            const dist = Math.hypot(system.x - worldX, system.y - worldY);
            if (dist < 8) {
                return system;
            }
        }
        return null;
    }
}
