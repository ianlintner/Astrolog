// InputHandler.js - Mouse and keyboard input handling
export class InputHandler {
    constructor(canvas, renderer, onSystemSelect) {
        this.canvas = canvas;
        this.renderer = renderer;
        this.onSystemSelect = onSystemSelect;

        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('wheel', (e) => this.onWheel(e));
    }

    onMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const world = this.renderer.screenToWorld(x, y);
        const system = this.renderer.findSystemAtPosition(world.x, world.y);

        if (system) {
            this.onSystemSelect(system);
        } else {
            this.isDragging = true;
            this.dragStart = { x: e.clientX, y: e.clientY };
        }
    }

    onMouseMove(e) {
        if (this.isDragging) {
            const dx = e.clientX - this.dragStart.x;
            const dy = e.clientY - this.dragStart.y;
            this.renderer.panCamera(dx, dy);
            this.dragStart = { x: e.clientX, y: e.clientY };
        }
    }

    onMouseUp() {
        this.isDragging = false;
    }

    onWheel(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        this.renderer.zoomCamera(delta);
    }
}
