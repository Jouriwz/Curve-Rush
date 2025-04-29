// File: src/entities/Ball.js
export default class Ball {
    constructor({ x = 0, y = 0, radius = 10 } = {}) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.radius = radius;
    }

    // Update ball position based on velocity and delta time
    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }

    // Check collision with a dot
    intersects(dot) {
        const dx = this.x - dot.x;
        const dy = this.y - dot.y;
        return Math.hypot(dx, dy) < this.radius + dot.radius;
    }
}
