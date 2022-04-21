import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameNode, { TweenableProperties } from "../../../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Line from "../../../../Wolfie2D/Nodes/Graphics/Line";
import OrthogonalTilemap from "../../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Scene from "../../../../Wolfie2D/Scene/Scene";
import Color from "../../../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../../../Wolfie2D/Utils/EaseFunctions";
import {finalproject_Events } from "../../../finalproject_constants";
import WeaponType from "./WeaponType";
import Rect from "../../../../Wolfie2D/Nodes/Graphics/Rect";
import BulletBehavior from "../../../Player/BulletAI";
import Circle from "../../../../Wolfie2D/DataTypes/Shapes/Circle";

export default class SemiAutoGun extends WeaponType {

    color: Color;
    private hexColor: string;
    //protected MAX_BULLETS_SIZE: number;
    protected bullet: Rect;

    initialize(options: Record<string, any>): void {
        this.damage = options.damage;
        this.cooldown = options.cooldown;
        this.hexColor = options.color;
        this.color = Color.fromStringHex(options.color);
        this.displayName = options.displayName;
        this.spriteKey = options.spriteKey;
        this.useVolume = options.useVolume;
        //this.MAX_BULLETS_SIZE=5;
        //this.bullets=new Array(this.MAX_BULLETS_SIZE);
    }

    doAnimation(shooter: GameNode, direction: Vec2, bullet: Rect): void {
        // let start = shooter.position.clone();
        // start.y+=5;
        // let end = shooter.position.clone().add(direction.scaled(200));
        // end.y+=5;
        // let delta = end.clone().sub(start);

        // // Iterate through the tilemap region until we find a collision
        // let minX = Math.min(start.x, end.x);
        // let maxX = Math.max(start.x, end.x);
        // let minY = Math.min(start.y, end.y);
        // let maxY = Math.max(start.y, end.y);

        // // Get the wall tilemap
        // let walls = <OrthogonalTilemap>shooter.getScene().getLayer("front").getItems()[0];

        // let minIndex = walls.getColRowAt(new Vec2(minX, minY));
		// let maxIndex = walls.getColRowAt(new Vec2(maxX, maxY));

        // let tileSize = walls.getTileSize();

        // for(let col = minIndex.x; col <= maxIndex.x; col++){
        //     for(let row = minIndex.y; row <= maxIndex.y; row++){
        //         if(walls.isTileCollidable(col, row)){
        //             // Get the position of this tile
        //             let tilePos = new Vec2(col * tileSize.x + tileSize.x/2, row * tileSize.y + tileSize.y/2);

        //             // Create a collider for this tile
        //             let collider = new AABB(tilePos, tileSize.scaled(1/2));

        //             let hit = collider.intersectSegment(start, delta, Vec2.ZERO);

        //             if(hit !== null && start.distanceSqTo(hit.pos) < start.distanceSqTo(end)){
        //                 console.log("Found hit");
        //                 end = hit.pos;
        //             }
        //         }
        //     }
        // }

        // line.start = start;
        // line.end = end;

        // line.tweens.play("fade");
       
        bullet.color=Color.YELLOW;
        bullet.position = shooter.position.clone();
        bullet.setAIActive(true, {speed: 10*direction.x});
        bullet.tweens.play("fire");
    }

    createRequiredAssets(scene: Scene): [Rect]{
        // let line = <Line>scene.add.graphic(GraphicType.LINE, "primary", {start: new Vec2(-1, 1), end: new Vec2(-1, -1)});
        // line.color = this.color;

        // line.thickness =30;

        // line.tweens.add("fade", {
        //     startDelay: 0,
        //     duration: 300,
        //     effects: [
        //         {
        //             property: TweenableProperties.alpha,
        //             start: 1,
        //             end: 0,
        //             ease: EaseFunctionType.OUT_SINE
        //         }
        //     ],
        //     onEnd: finalproject_Events.UNLOAD_ASSET
        // });

        // return [line];
       
        let bullet = <Rect>scene.add.graphic(GraphicType.RECT, "primary", {position: new Vec2(100, 100), size: new Vec2(10, 5)});


        // Currently bullets use the base custom gradient circle shader, 
        // you'll need to change this to the Linear Gradient Circle once you get that shader working. 
    
        // This is the color each bullet is set to by default, you can change this if you like a different color
        // Add AI to our bullet
        
        bullet.addAI(BulletBehavior, {speed: 0});

        // Add a collider to our bullet
        // let collider = new Circle(Vec2.ZERO, 5);
        // bullet.setCollisionShape(collider);

        bullet.tweens.add("fire", {
            startDelay: 0,
            duration: 1,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: 0.1,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd:  finalproject_Events.SHOOT_BULLET
        });
   
        return [bullet];

    }

    hits(node: GameNode, line: Rect): boolean {
       // console.log("hit");
        //return node.collisionShape.getBoundingRect().intersectSegment(line.start, line.end.clone().sub(line.start)) !== null;
        return false;
    }

    clone(): WeaponType {
        let newType = new SemiAutoGun();
        newType.initialize({color: this.hexColor,damage: this.damage, cooldown: this.cooldown, displayName: this.displayName, spriteKey: this.spriteKey, useVolume: this.useVolume});
        return newType;
    }
}