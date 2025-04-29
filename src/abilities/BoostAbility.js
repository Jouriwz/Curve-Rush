// File: src/abilities/BoostAbility.js
export default class BoostAbility {
    constructor(game) {
        this.game     = game;
        this.key      = 'Space';
        this.cooldown = 1.0;    // seconds between uses
        this.timer    = 0;      // time until next available
        this.amount   = 300;    // px/s to add
    }

    onKeyDown = (e) => {
        if (e.code === this.key && this.timer <= 0) {
            e.preventDefault();   // stop the page from scrolling

            const ball = this.game.ball;
            // get current velocity and magnitude
            const { vx, vy } = ball;
            const speed = Math.hypot(vx, vy) || 1;
            // compute new factor so |v| => |v| + amount
            const factor = (speed + this.amount) / speed;
            ball.vx *= factor;
            ball.vy *= factor;

            this.timer = this.cooldown;
        }
    }

    update(dt) {
        if (this.timer > 0) this.timer -= dt;
    }
}
