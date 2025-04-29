// File: src/Abilities.js
export default class Abilities {
    constructor() {
        // Boost ability (spacebar): increases ball speed
        this.boost = {
            key: 'Space',
            cooldown: 1.0,   // Cooldown between uses (seconds)
            timer: 0,        // Time left until available
            amount: 300      // Speed boost amount
        };

        // Freeze ability (F key): slows game time
        this.freeze = {
            key: 'KeyF',
            cooldown: 5.0,   // Cooldown between uses (seconds)
            timer: 0,        // Time left until available
            duration: 5.0    // Duration of slow motion (seconds)
        };
    }

    handleKeyDown(game, e) {
        // Handle boost activation
        if (e.code === this.boost.key && this.boost.timer <= 0) {
            game.applyBoost(this.boost.amount);
            this.boost.timer = this.boost.cooldown;
        }

        // Handle freeze activation
        if (e.code === this.freeze.key && this.freeze.timer <= 0) {
            game.applyFreeze(this.freeze.duration);
            this.freeze.timer = this.freeze.cooldown;
        }
    }

    update(dt) {
        // Update ability cooldown timers
        if (this.boost.timer > 0) this.boost.timer -= dt;
        if (this.freeze.timer > 0) this.freeze.timer -= dt;
    }
}
