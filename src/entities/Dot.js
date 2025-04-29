// File: src/entities/Dot.js
export default class Dot {
    constructor({ canvas, radius = 12 } = {}) {
        this.canvas = canvas;
        this.radius = radius;
        this.respawn();
    }

    // Move dot to a random position on the canvas
    respawn() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
    }
}
