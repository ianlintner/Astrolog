// Random.js - small seeded PRNG (mulberry32) shared by all random game decisions.
export class Random {
    constructor(seed = 0) {
        this.seed = seed >>> 0;
        this.state = this.seed;
    }

    // Uniform float in [0, 1).
    next() {
        this.state = (this.state + 0x6d2b79f5) >>> 0;
        let t = this.state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    // Integer in [0, max).
    int(max) {
        return Math.floor(this.next() * max);
    }

    // One element of a non-empty array.
    pick(items) {
        return items[this.int(items.length)];
    }

    getState() {
        return this.state;
    }

    setState(state) {
        this.state = state >>> 0;
    }
}

// Parse ?seed=<int>; return null when absent or not an integer.
export function seedFromSearch(search) {
    const value = new URLSearchParams(search).get('seed');
    if (value === null || value.trim() === '') return null;
    const parsed = Number(value.trim());
    if (!Number.isInteger(parsed)) return null;
    return parsed >>> 0;
}
