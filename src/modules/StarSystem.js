// StarSystem.js - Star system generation and management
export class StarSystemManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.starSystems = [];
        this.hyperLanes = [];
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

        const gridSize = 10;
        const cellSize = 150;

        for (let i = 0; i < 100; i++) {
            const baseName = systemNames[i % systemNames.length];
            const suffix =
                i >= systemNames.length
                    ? ` ${suffixes[Math.floor(i / systemNames.length) % suffixes.length]}`
                    : '';

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
            this.gameState.initializeSystem(i);
        }

        return { centerX: (gridSize * 150) / 2, centerY: (gridSize * 150) / 2 };
    }

    getRandomStarColor() {
        const colors = ['#fff', '#ffa', '#aaf', '#faa', '#faf'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    generateHyperLanes() {
        const maxDistance = 180;

        for (let i = 0; i < this.starSystems.length; i++) {
            const sys1 = this.starSystems[i];

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
        this.starSystems.forEach((system) => {
            const exportCount = Math.floor(Math.random() * 2) + 1;
            const importCount = Math.floor(Math.random() * 3) + 2;

            const availableGoods = [...this.gameState.goodsTypes];
            for (let i = 0; i < exportCount; i++) {
                const idx = Math.floor(Math.random() * availableGoods.length);
                const good = availableGoods.splice(idx, 1)[0];
                system.exports.push({
                    ...good,
                    price: Math.floor(good.basePrice * (0.7 + Math.random() * 0.3)),
                });
            }

            const importPool = this.gameState.goodsTypes.filter(
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

    getSystem(id) {
        return this.starSystems[id];
    }

    findPath(fromId, toId) {
        const queue = [[fromId]];
        const visited = new Set([fromId]);

        while (queue.length > 0) {
            const path = queue.shift();
            const current = path[path.length - 1];

            if (current === toId) {
                return path;
            }

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
}
