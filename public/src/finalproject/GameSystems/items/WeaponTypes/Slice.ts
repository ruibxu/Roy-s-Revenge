import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../../../Wolfie2D/Scene/Scene";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";
import WeaponType from "./WeaponType";
import Emitter from "../../../../Wolfie2D/Events/Emitter";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";

export default class Slice extends WeaponType {

    initialize(options: Record<string, any>): void {
        this.damage = options.damage;
        this.cooldown = options.cooldown;
        this.displayName = options.displayName;
        this.spriteKey = options.spriteKey;
        this.useVolume = options.useVolume;
        this.emitter = new Emitter();
    }

    doAnimation(attacker: GameNode, direction: Vec2, sliceSprite: AnimatedSprite): void {
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "slice", loop: false, holdReference: false});
        // Rotate this with the game node

        sliceSprite.invertX= MathUtils.sign(direction.x) < 0;


        // Move the slice out from the player
        sliceSprite.position = attacker.position.clone().add(direction.scaled(32));
        
        // Play the slice animation w/o loop, but queue the normal animation

        if(this.spriteKey=="lightSaber"){
            sliceSprite.animation.play("SLICE2");
            sliceSprite.animation.queue("NORMAL2", true);
        }
        else{
            sliceSprite.animation.play("SLICE");
            sliceSprite.animation.queue("NORMAL", true);
        }
     
    }

    createRequiredAssets(userType:String,scene: Scene): [AnimatedSprite] {
        let slice = scene.add.animatedSprite("slice", "primary");
        slice.animation.play("NORMAL", true);

        return [slice];
    }

    hits(node: GameNode, sliceSprite: AnimatedSprite): boolean {
        return sliceSprite.boundary.overlaps(node.collisionShape);
    }

    clone(): WeaponType {
        let newType = new Slice();
        newType.initialize({damage: this.damage, cooldown: this.cooldown, displayName: this.displayName, spriteKey: this.spriteKey, useVolume: this.useVolume});
        return newType;
    }
}