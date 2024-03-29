import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameNode, { TweenableProperties } from "../../../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Line from "../../../../Wolfie2D/Nodes/Graphics/Line";
import OrthogonalTilemap from "../../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Scene from "../../../../Wolfie2D/Scene/Scene";
import Color from "../../../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../../../Wolfie2D/Utils/EaseFunctions";
import { finalproject_Events } from "../../../finalproject_constants";
import WeaponType from "./WeaponType";
import Emitter from "../../../../Wolfie2D/Events/Emitter";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";

export default class LaserGun extends WeaponType {

    color: Color;
    private hexColor: string;

    initialize(options: Record<string, any>): void {
        this.damage = options.damage;
        this.cooldown = options.cooldown;
        this.hexColor = options.color;
        this.color = Color.fromStringHex(options.color);
        this.displayName = options.displayName;
        this.spriteKey = options.spriteKey;
        this.useVolume = options.useVolume;
        this.emitter = new Emitter();
    }

    doAnimation(shooter: GameNode, direction: Vec2, line: Line): void {
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "lasergun", loop: false, holdReference: false});
        let start = shooter.position.clone();
        start.y+=5;
        let end = shooter.position.clone().add(direction.scaled(200));
        end.y+=5;
        let delta = end.clone().sub(start);

        // Iterate through the tilemap region until we find a collision
        let minX = Math.min(start.x, end.x);
        let maxX = Math.max(start.x, end.x);
        let minY = Math.min(start.y, end.y);
        let maxY = Math.max(start.y, end.y);

        // Get the wall tilemap
        let walls = <OrthogonalTilemap>shooter.getScene().getLayer("front").getItems()[0];

        let minIndex = walls.getColRowAt(new Vec2(minX, minY));
		let maxIndex = walls.getColRowAt(new Vec2(maxX, maxY));

        let tileSize = walls.getTileSize();

        for(let col = minIndex.x; col <= maxIndex.x; col++){
            for(let row = minIndex.y; row <= maxIndex.y; row++){
                if(walls.isTileCollidable(col, row)){
                    // Get the position of this tile
                    let tilePos = new Vec2(col * tileSize.x + tileSize.x/2, row * tileSize.y + tileSize.y/2);

                    // Create a collider for this tile
                    let collider = new AABB(tilePos, tileSize.scaled(1/2));

                    let hit = collider.intersectSegment(start, delta, Vec2.ZERO);

                    if(hit !== null && start.distanceSqTo(hit.pos) < start.distanceSqTo(end)){
                        console.log("Found hit");
                        end = hit.pos;
                    }
                }
            }
        }

        line.start = start;
        line.end = end;

        line.tweens.play("fade");
    }

    createRequiredAssets(userType:String,scene: Scene): [Line] {
        let line = <Line>scene.add.graphic(GraphicType.LINE, "primary", {start: new Vec2(-1, 1), end: new Vec2(-1, -1)});
        line.color = this.color;
        line.thickness =30;

        line.tweens.add("fade", {
            startDelay: 0,
            duration: 300,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.OUT_SINE
                }
            ],
            onEnd: finalproject_Events.UNLOAD_ASSET
        });

        return [line];
    }

    hits(node: GameNode, line: Line): boolean {
        return node.collisionShape.getBoundingRect().intersectSegment(line.start, line.end.clone().sub(line.start)) !== null;
    }

    clone(): WeaponType {
        let newType = new LaserGun();
        newType.initialize({damage: this.damage, color: this.hexColor, cooldown: this.cooldown, displayName: this.displayName, spriteKey: this.spriteKey, useVolume: this.useVolume});
        return newType;
    }
}