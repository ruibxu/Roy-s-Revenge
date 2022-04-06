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
import Graphic from "../../../../Wolfie2D/Nodes/Graphic";

import BulletBehavior from "../../../Player/BulletAI";
import Circle from "../../../../Wolfie2D/DataTypes/Shapes/Circle";
import CanvasNode from "../../../../Wolfie2D/Nodes/CanvasNode";



export default class SemiAutoGun extends WeaponType {

    color: Color;
    private hexColor: string;
    //protected MAX_BULLETS_SIZE: number;
	protected bullet:Graphic;
    

    initialize(options: Record<string, any>): void {
        this.damage = options.damage;
        this.cooldown = options.cooldown;
        this.hexColor = options.color;
        this.color = Color.fromStringHex(options.color);
        this.displayName = options.displayName;
        this.spriteKey = options.spriteKey;
        this.useVolume = options.useVolume;
        //this.bullets=new Array(this.MAX_BULLETS_SIZE);
    }

    doAnimation(shooter: GameNode, direction: Vec2, line: Line): void {
        // let start = shooter.position.clone();
        // let end = shooter.position.clone().add(new Vec2(5*32,0));
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
        // Find the first viable bullet
		//let bullet: Graphic = null;

		// for(let b of this.bullets){
		// 	if(!b.visible){
		// 		// We found a dead bullet
		// 		bullet = b;
		// 		break;
		// 	}
		// }

		if(this.bullet !== null){
			// Spawn a bullet			
			// const i= Math.floor(Math.random() * (1 + 1));;
			// if (i==1) bullet.color.set(255,20,147,1);
			//else
            this.bullet.color=Color.YELLOW;
			this.bullet.visible = true;
			this.bullet.position = shooter.position.clone();
            this.bullet.setAIActive(true, {speed: 10*direction.x});
		}
    }

    // createRequiredAssets(scene: Scene): [Line] {
    //     let line = <Line>scene.add.graphic(GraphicType.LINE, "primary", {start: new Vec2(-1, 1), end: new Vec2(-1, -1)});
    //     line.color = this.color;

    //     line.tweens.add("fade", {
    //         startDelay: 0,
    //         duration: 300,
    //         effects: [
    //             {
    //                 property: TweenableProperties.alpha,
    //                 start: 1,
    //                 end: 0,
    //                 ease: EaseFunctionType.OUT_SINE
    //             }
    //         ],
    //         onEnd: finalproject_Events.UNLOAD_ASSET
    //     });

    //     return [line];
    // }

    hits(node: GameNode, line: Line): boolean {
        return node.collisionShape.getBoundingRect().intersectSegment(line.start, line.end.clone().sub(line.start)) !== null;
    }

    clone(): WeaponType {
        let newType = new SemiAutoGun();
        newType.initialize({color: this.hexColor,damage: this.damage, cooldown: this.cooldown, displayName: this.displayName, spriteKey: this.spriteKey, useVolume: this.useVolume});
        return newType;
    }
    createRequiredAssets(scene: Scene): [Graphic] {
		
        // Initialize the bullet object pool
		// for(let i = 0; i < this.bullets.length; i++){
			this.bullet = <Graphic>scene.add.graphic(GraphicType.RECT, "primary", {position: new Vec2(100, 100), size: new Vec2(10, 5)});


			// Currently bullets use the base custom gradient circle shader, 
			// you'll need to change this to the Linear Gradient Circle once you get that shader working. 
		

			this.bullet.visible = false;
			// This is the color each bullet is set to by default, you can change this if you like a different color
			this.bullet.color = Color.BLUE;

			// Add AI to our bullet
			this.bullet.addAI(BulletBehavior, {speed: 250});

			// Add a collider to our bullet
			let collider = new Circle(Vec2.ZERO, 5);
			this.bullet.setCollisionShape(collider);

            // this.bullet.tweens.add("fade", {
            //             startDelay: 0,
            //             duration: 300,
            //             effects: [
            //                 {
            //                     property: TweenableProperties.alpha,
            //                     start: 1,
            //                     end: 0,
            //                     ease: EaseFunctionType.OUT_SINE
            //                 }
            //             ],
            //             onEnd: finalproject_Events.UNLOAD_ASSET
            //         });
        return [this.bullet];
    }
}