export default class Physics {
    constructor({ gravity = 980 } = {}) {
        this.gravity = gravity;
    }

    applyGravity(ball, dt) {
        // downward acceleration: v += g · dt
        ball.vy += this.gravity * dt;
    }

    handleCollisions(ball, lines) {
        lines.forEach(line => {
            const pts = line.points;
            // iterate each segment
            for (let i = 0; i < pts.length - 1; i++) {
                const { x: x1, y: y1 } = pts[i];
                const { x: x2, y: y2 } = pts[i + 1];
                const dx = x2 - x1, dy = y2 - y1;
                const lenSq = dx * dx + dy * dy;

                // project ball center onto segment (t in [0,1])
                const t = ((ball.x - x1) * dx + (ball.y - y1) * dy) / lenSq;
                const tClamped = Math.max(0, Math.min(1, t));
                const px = x1 + dx * tClamped;
                const py = y1 + dy * tClamped;

                // vector from segment to ball
                const distX = ball.x - px, distY = ball.y - py;
                const dist = Math.hypot(distX, distY);

                if (dist < ball.radius) {
                    // compute normal
                    const nx = distX / dist, ny = distY / dist;
                    // velocity along normal
                    const relVel = ball.vx * nx + ball.vy * ny;
                    if (relVel < 0) {
                        // 1) Reflect velocity: v -= 2*(v·n)*n
                        ball.vx -= 2 * relVel * nx;
                        ball.vy -= 2 * relVel * ny;

                        // 2) Friction along tangent
                        const tx = -ny, ty = nx;
                        const relT = ball.vx * tx + ball.vy * ty;
                        ball.vx -= relT * 0.2 * tx;
                        ball.vy -= relT * 0.2 * ty;

                        // 3) Push out of overlap
                        const overlap = ball.radius - dist;
                        ball.x += nx * overlap;
                        ball.y += ny * overlap;
                    }
                }
            }
        });
    }
}