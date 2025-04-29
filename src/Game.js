// File: src/Game.js
import Ball       from './entities/Ball.js';
import Line       from './entities/Line.js';
import Dot        from './entities/Dot.js';
import Abilities  from './Abilities.js';

export default class Game {
    constructor({ physics, renderer, input, canvas }) {
        // core systems
        this.physics   = physics;
        this.renderer  = renderer;
        this.input     = input;
        this.canvas    = canvas;

        // game state
        this.ball        = new Ball({ x: canvas.width/2, y: 50 });
        this.dot         = new Dot({ canvas });
        this.lines       = [];
        this.currentLine = null;
        this.canDraw     = true;
        this.drawCooldownMs = 300;

        // set up input for line-drawing
        input.onDrawStart = this.handleDrawStart.bind(this);
        input.onDrawing   = this.handleDrawing.bind(this);
        input.onDrawEnd   = this.handleDrawEnd.bind(this);

        // all abilities live in here
        this.abilities = new Abilities(this);
        window.addEventListener('keydown', this.abilities.handleKeyDown);

    }

    update(dt) {
        // 1) let abilities tweak dt or do their own updates
        const simDt = this.abilities.modifyDt(dt);
        this.abilities.update(dt);

        // 2) physics & movement
        this.physics.applyGravity(this.ball, simDt);
        this.physics.handleCollisions(this.ball, this.lines);
        this.ball.update(simDt);

        // 3) bounce off edges
        const { width: w, height: h } = this.canvas;
        const r = this.ball.radius;
        if (this.ball.x - r < 0) { this.ball.x = r;     this.ball.vx *= -1; }
        if (this.ball.x + r > w) { this.ball.x = w - r; this.ball.vx *= -1; }
        if (this.ball.y - r < 0) { this.ball.y = r;     this.ball.vy *= -1; }
        if (this.ball.y + r > h) { this.ball.y = h - r; this.ball.vy *= -1; }

        // 4) scoring
        if (this.ball.intersects(this.dot)) {
            this.renderer.incrementScore();
            this.dot.respawn();
        }

        // 5) prune old lines
        if (this.lines.length > 3) this.lines.shift();
    }

    render(dt) {
        this.renderer.clear();
        this.renderer.drawLines(this.lines);
        if (this.currentLine) this.renderer.drawLines([this.currentLine]);
        this.renderer.drawDot(this.dot);

        // hook for any ability visuals (e.g. trajectory)
        this.abilities.render(this.renderer, dt);

        this.renderer.drawBall(this.ball);
    }

    // line-drawing handlers
    handleDrawStart(pos) {
        if (!this.canDraw) return;
        this.currentLine = new Line(pos);
    }

    handleDrawing(pos) {
        if (!this.currentLine) return;
        const x = Math.min(Math.max(pos.x, 0), this.canvas.width);
        const y = Math.min(Math.max(pos.y, 0), this.canvas.height);
        this.currentLine.addPoint({ x, y });
    }

    handleDrawEnd() {
        if (!this.currentLine) return;
        this.lines.push(this.currentLine);
        this.currentLine = null;
        this.canDraw = false;
        setTimeout(() => (this.canDraw = true), this.drawCooldownMs);
    }
}
