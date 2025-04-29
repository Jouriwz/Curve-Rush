export default class FreezeAbility {
    constructor(game) {
        this.game     = game;
        this.key      = 'KeyF';
        this.cooldown = 5.0;
        this.timer    = 0;
        this.duration = 2.0;
        this.scale    = 0.2;
    }

    onKeyDown(e) {
        if (e.code === this.key && this.timer <= 0) {
            this.timer = this.cooldown;
            this.game.freezeTimer = this.duration;
        }
    }

    update(dt) {
        // Cooldown tick
        if (this.timer > 0) this.timer -= dt;
        // Freeze effect tick
        if (this.game.freezeTimer > 0) {
            this.game.freezeTimer -= dt;
        }
    }

    modifyDt(dt) {
        // When frozen, run physics at reduced speed
        return this.game.freezeTimer > 0 ? dt * this.scale : dt;
    }
}
