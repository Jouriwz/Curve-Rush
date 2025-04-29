// File: src/Game.js
import Ball      from './entities/Ball.js';
import Line      from './entities/Line.js';
import Dot       from './entities/Dot.js';
import Abilities from './Abilities.js';

export default class Game {
    constructor({ physics, renderer, input, canvas }) {
        this.physics   = physics;
        this.renderer  = renderer;
        this.input     = input;
        this.canvas    = canvas;

        // Core game entities
        this.ball        = new Ball({ x: canvas.width / 2, y: 50 });
        this.dot         = new Dot({ canvas });
        this.lines       = [];
        this.currentLine = null;

        // Ability and freeze state
        this.abilities   = new Abilities();
        this.freezeTimer = 0;    // Remaining time for slow motion
        this.freezeScale = 0.2;  // Physics speed during freeze

        // Drawing state
        this.canDraw        = true;
        this.drawCooldownMs = 300;

        // Input event bindings
        this.input.onDrawStart = this.handleDrawStart.bind(this);
        this.input.onDrawing   = this.handleDrawing.bind(this);
        this.input.onDrawEnd   = this.handleDrawEnd.bind(this);

        // Ability keybindings
        window.addEventListener('keydown', e => this.abilities.handleKeyDown(this, e));
    }

    update(dt) {
        // Update abilities
        this.abilities.update(dt);

        // Handle slow motion
        let simDt = dt;
        if (this.freezeTimer > 0) {
            this.freezeTimer -= dt;
            simDt *= this.freezeScale;
        }

        // Physics updates
        this.physics.applyGravity(this.ball, simDt);
        this.physics.handleCollisions(this.ball, this.lines);
        this.ball.update(simDt);

        // Boundary collision handling
        const { width: w, height: h } = this.canvas;
        const r = this.ball.radius;
        if (this.ball.x - r < 0) { this.ball.x = r;     this.ball.vx *= -1; }
        if (this.ball.x + r > w) { this.ball.x = w - r; this.ball.vx *= -1; }
        if (this.ball.y - r < 0) { this.ball.y = r;     this.ball.vy *= -1; }
        if (this.ball.y + r > h) { this.ball.y = h - r; this.ball.vy *= -1; }

        // Dot collection
        if (this.ball.intersects(this.dot)) {
            this.renderer.incrementScore();
            this.dot.respawn();
        }

        // Limit the number of lines
        if (this.lines.length > 3) {
            this.lines.shift();
        }
    }

    render() {
        this.renderer.clear();
        this.renderer.drawLines(this.lines);
        if (this.currentLine) {
            this.renderer.drawLines([this.currentLine]);
        }
        this.renderer.drawDot(this.dot);
        this.renderer.drawBall(this.ball);
    }

    // Drawing input handlers
    handleDrawStart(pos) {
        if (!this.canDraw) return;
        this.currentLine = new Line(pos);
    }

    handleDrawing(pos) {
        if (!this.currentLine) return;
        // Clamp position within the canvas bounds
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

    // Ability effects
    applyBoost(amount) {
        const { vx, vy } = this.ball;
        const speed = Math.hypot(vx, vy) || 1;
        const factor = (speed + amount) / speed;
        this.ball.vx *= factor;
        this.ball.vy *= factor;
    }

    applyFreeze(duration) {
        this.freezeTimer = duration;
    }
}
