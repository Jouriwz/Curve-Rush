import Ball from '../entities/Ball.js';

export default class TrajectoryAbility {
    constructor(game) {
        this.game        = game;
        this.key         = 'KeyT';
        this.cooldown    = 5.0;    // seconds between uses
        this.timer       = 0;      // cooldown counter
        this.duration    = 10.0;    // how long the preview lasts
        this.showTimer   = 0;      // countdown for current preview
        this.step        = 0.02;   // simulation timestep
        this.maxDistance = 1200;    // px cutoff
        this.path        = [];     // the single path to draw
    }

    onKeyDown(e) {
        if (e.code === this.key && this.timer <= 0) {
            this.timer     = this.cooldown;
            this.showTimer = this.duration;
        }
    }

    update(dt) {
        // cooldown tick
        if (this.timer > 0) this.timer -= dt;

        // if preview still running, recalc once per frame
        if (this.showTimer > 0) {
            this.showTimer -= dt;
            this.path      = this._simulatePath();
            if (this.showTimer <= 0) {
                // preview ended: clear path
                this.path = [];
            }
        }
    }

    render(renderer, dt) {
        if (this.path.length > 1) {
            renderer.drawPath(this.path, { color: 'yellow', dash: [4,4], width: 1 });
        }
    }

    _simulatePath() {
        const { ball: realBall, physics, lines, canvas } = this.game;
        const simBall = new Ball({ x: realBall.x, y: realBall.y });
        simBall.vx = realBall.vx;
        simBall.vy = realBall.vy;

        const pts     = [{ x: simBall.x, y: simBall.y }];
        const steps   = Math.ceil(this.duration / this.step);
        let   traveled = 0;

        for (let i = 0; i < steps; i++) {
            // step physics
            physics.applyGravity(simBall, this.step);
            physics.handleCollisions(simBall, lines);
            simBall.update(this.step);

            // bounce off canvas edges
            const r = simBall.radius, w = canvas.width, h = canvas.height;
            if (simBall.x - r < 0) { simBall.x = r;       simBall.vx *= -1; }
            if (simBall.x + r > w) { simBall.x = w - r;   simBall.vx *= -1; }
            if (simBall.y - r < 0) { simBall.y = r;       simBall.vy *= -1; }
            if (simBall.y + r > h) { simBall.y = h - r;   simBall.vy *= -1; }

            // calculate segment length
            const last = pts[pts.length - 1];
            const dx   = simBall.x - last.x;
            const dy   = simBall.y - last.y;
            const dist = Math.hypot(dx, dy);
            traveled  += dist;
            if (traveled > this.maxDistance) break;

            pts.push({ x: simBall.x, y: simBall.y });
        }

        return pts;
    }
}
