import Emitter from "../../Wolfie2D/Events/Emitter";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import BattlerAI from "../Enemies/BattlerAI";
import { finalproject_Events } from "../finalproject_constants";
import PlayerController from "../Player/PlayerController";
import Weapon from "./items/Weapon";

export default class BattleManager {
    player: BattlerAI;

    enemies: Array<BattlerAI>;
    emitter: Emitter;

    handleInteraction(attackerType: string, weapon: Weapon) {
        if (attackerType === "player") {
            // Check for collisions with enemies
            for (let enemy of this.enemies) {
                console.log("Battermanage")
                if (weapon.hits(enemy.owner)) {
                    enemy.damage(weapon.type.damage);
                }
            }
        } else {
            //Check for collision with player
                if (weapon.hits(this.player.owner)) {
                    this.emitter = new Emitter();
                    this.emitter.fireEvent(finalproject_Events.PLAYER_DAMAGE,{"damage":weapon.type.damage});
                    //this.player.damage(weapon.type.damage);
                }
            }
    }

    setPlayers(player: BattlerAI): void {
        this.player = player;
    }

    setEnemies(enemies: Array<BattlerAI>): void {
        this.enemies = enemies;
    }
}