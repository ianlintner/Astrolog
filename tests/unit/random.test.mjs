import assert from 'node:assert/strict';
import test from 'node:test';
import { Random, seedFromSearch } from '../../src/modules/Random.js';
import { GameState } from '../../src/modules/GameState.js';
import { StarSystemManager } from '../../src/modules/StarSystem.js';

function generateWorld(seed) {
    const gameState = new GameState();
    const systems = new StarSystemManager(gameState, new Random(seed));
    systems.generateStarSystems();
    systems.generateHyperLanes();
    systems.assignSystemEconomies();
    return systems;
}

test('two generators with the same seed produce the same sequence', () => {
    const a = new Random(42);
    const b = new Random(42);
    const seqA = Array.from({ length: 100 }, () => [a.next(), a.int(10), a.pick(['x', 'y'])]);
    const seqB = Array.from({ length: 100 }, () => [b.next(), b.int(10), b.pick(['x', 'y'])]);
    assert.deepEqual(seqA, seqB);

    const c = new Random(43);
    assert.notEqual(new Random(42).next(), c.next());
});

test('generator state can be saved and resumed', () => {
    const rng = new Random(42);
    for (let i = 0; i < 5; i++) rng.next();
    const savedState = rng.getState();
    const expected = Array.from({ length: 5 }, () => rng.next());

    const resumed = new Random(42);
    resumed.setState(savedState);
    assert.deepEqual(
        Array.from({ length: 5 }, () => resumed.next()),
        expected
    );
});

test('seed 42 generates the same world twice', () => {
    const first = generateWorld(42);
    const second = generateWorld(42);

    assert.equal(first.starSystems.length, 100);
    assert.deepEqual(
        first.starSystems.map((sys) => sys.name),
        second.starSystems.map((sys) => sys.name)
    );
    assert.deepEqual(
        first.starSystems.map((sys) => ({ x: sys.x, y: sys.y })),
        second.starSystems.map((sys) => ({ x: sys.x, y: sys.y }))
    );
    assert.deepEqual(first.starSystems, second.starSystems);
    assert.deepEqual(first.hyperLanes, second.hyperLanes);

    const other = generateWorld(43);
    assert.notDeepEqual(
        first.starSystems.map((sys) => ({ x: sys.x, y: sys.y })),
        other.starSystems.map((sys) => ({ x: sys.x, y: sys.y }))
    );
});

test('seedFromSearch reads integer URL seeds', () => {
    assert.equal(seedFromSearch('?seed=42&test=1'), 42);
    assert.equal(seedFromSearch('?test=1'), null);
    assert.equal(seedFromSearch('?seed=nope'), null);
});
