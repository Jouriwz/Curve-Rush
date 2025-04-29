// File: src/Abilities.js
import BoostAbility      from './abilities/BoostAbility.js';
import FreezeAbility     from './abilities/FreezeAbility.js';
import TrajectoryAbility from './abilities/TrajectoryAbility.js';

export default class Abilities {
    constructor(game) {
        this.game      = game;
        this.abilities = [
            new BoostAbility(game),
            new FreezeAbility(game),
            new TrajectoryAbility(game),
        ];
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleKeyDown(e) {
        this.abilities.forEach(a => a.onKeyDown(e));
    }

    update(dt) {
        this.abilities.forEach(a => a.update(dt));
    }

    modifyDt(dt) {
        return this.abilities.reduce((time, a) =>
                a.modifyDt ? a.modifyDt(time) : time
            , dt);
    }

    render(renderer, dt) {
        this.abilities.forEach(a => {
            if (a.render) a.render(renderer, dt);
        });
    }
}
