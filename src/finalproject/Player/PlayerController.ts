import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import GameNode, { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import { finalproject_Events } from "../finalproject_constants";
import Fall from "./PlayerStates/Fall";
import Idle from "./PlayerStates/Idle";
import InAir from "./PlayerStates/InAir";
import Jump from "./PlayerStates/Jump";
import Run from "./PlayerStates/Run";
import Walk from "./PlayerStates/Walk";
import InventoryManager from "../GameSystems/InventoryManager";
import Receiver from "../../Wolfie2D/Events/Receiver";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Input from "../../Wolfie2D/Input/Input";
import Item from "../GameSystems/items/Item";


export enum PlayerType {
    PLATFORMER = "platformer",
    TOPDOWN = "topdown"
}

export enum PlayerStates {
    IDLE = "idle",
    WALK = "walk",
	RUN = "run",
	JUMP = "jump",
    FALL = "fall",
	PREVIOUS = "previous"
}

export default class PlayerController extends StateMachineAI {
    protected owner: GameNode;
    velocity: Vec2 = Vec2.ZERO;
	speed: number = 200;
	MIN_SPEED: number = 200;
    MAX_SPEED: number = 300;
    tilemap: OrthogonalTilemap;
    isDead: boolean = false;
     //add inverntory
    inventory: InventoryManager;
    items: Array<Item>;

    // HOMEWORK 5 - TODO
    /**
     * Implement a death animation for the player using tweens. The animation rotate the player around itself multiple times
     * over the tween duration, as well as fading out the alpha value of the player. The tween should also make use of the
     * onEnd field to send out a PLAYER_KILLED event.
     * 
     * Tweens MUST be used to create this new animation, although you can add to the spritesheet if you want to add some more detail.
     * 
     * Look at incPlayerLife() in GameLevel to see where this animation would be called.
     */
    initializeAI(owner: GameNode, options: Record<string, any>){
        this.owner = owner;
        


        this.initializePlatformer();
        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;

        this.receiver = new Receiver();
		this.emitter = new Emitter();


        this.receiver.subscribe(finalproject_Events.ATTACK);
        this.receiver.subscribe(finalproject_Events.PLAYER_DAMAGE);


        this.items = options.items;
        this.inventory = options.inventory;



        owner.tweens.add("death", {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: 2*Math.PI,
                    ease: EaseFunctionType.IN_OUT_QUAD
                },
                {
                    property: "alpha",
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: (finalproject_Events.PLAYER_KILLED)
        });

    }


    handleEvent(event: GameEvent): void {
		// We need to handle animations when we get hurt
		if(event.type === finalproject_Events.PLAYER_DAMAGE){
			if(event.data.get("health") === 0){
				// Play animation and queue event to end game
				this.isDead=true;
				//this.owner.animation.play("DEAD", true);

				this.emitter.fireEvent( finalproject_Events.PLAYER_DEAD);
			} else {
				//this.owner.animation.play("TAKING_DAMAGE", false, Homework3Event.PLAYER_I_FRAMES_END);
			}
		}
      
        if(event.type===finalproject_Events.ATTACK){
           
            this.attack(event.data.get("direction"));
        
        }
        

        
	}


    initializePlatformer(): void {
        this.speed = 400;

        let idle = new Idle(this, this.owner);
		this.addState(PlayerStates.IDLE, idle);
		let walk = new Walk(this, this.owner);
		this.addState(PlayerStates.WALK, walk);
		let run = new Run(this, this.owner);
		this.addState(PlayerStates.RUN, run);
		let jump = new Jump(this, this.owner);
        this.addState(PlayerStates.JUMP, jump);
        let fall = new Fall(this, this.owner);
        this.addState(PlayerStates.FALL, fall);
        
        this.initialize(PlayerStates.IDLE);
    }

    changeState(stateName: string): void {
        // If we jump or fall, push the state so we can go back to our current state later
        // unless we're going from jump to fall or something
        if((stateName === PlayerStates.JUMP || stateName === PlayerStates.FALL) && !(this.stack.peek() instanceof InAir)){
            this.stack.push(this.stateMap.get(stateName));
        }

        super.changeState(stateName);
    }

    // HOMEWORK 5 - TODO
    /**
     * We want to detect when our player is moving over one of the switches in the world, and along with the sound
     * and label changes, we also visually want to change the tile.
     * 
     * You'll have to figure out when the player is over a tile, and then change that tile to the ON tile that you see in
     * tileset.png in tilemaps. You also need to send the PLAYER_HIT_SWITCH event so elements can be handled in GameLevel.ts
     * 
     * Make use of the tilemap field in the PlayerController and the methods at it's disposal.
     * 
     */
    update(deltaT: number): void {
		super.update(deltaT);
        
        // let switch_location=new Vec2(this.owner.position.x, this.owner.position.y+32);
        // if(this.tilemap.getTileAtWorldPosition(switch_location)==8){
        //     this.tilemap.setTileAtRowCol(this.tilemap.getColRowAt(switch_location),9);
        //     this.emitter.fireEvent(HW5_Events.PLAYER_HIT_SWITCH);
        // }

		if(this.currentState instanceof Jump){
			Debug.log("playerstate", "Player State: Jump");
		} else if (this.currentState instanceof Walk){
			Debug.log("playerstate", "Player State: Walk");
		} else if (this.currentState instanceof Run){
			Debug.log("playerstate", "Player State: Run");
		} else if (this.currentState instanceof Idle){
		 	Debug.log("playerstate", "Player State: Idle");
		} else if(this.currentState instanceof Fall){
            Debug.log("playerstate", "Player State: Fall");
        }

        // Check for slot change
        if (Input.isJustPressed("slot1")) {
            this.inventory.changeSlot(0);
            if (this.inventory.getItem()){
                //console.log("weapon change to: ",this.inventory.getItem().sprite.imageId);
                this.emitter.fireEvent(finalproject_Events.PLAYER_WEAPON_CHANGE,{weapon:this.inventory.getItem().sprite.imageId});
            }
        }
        if (Input.isJustPressed("slot2")) {
            this.inventory.changeSlot(1);
            if (this.inventory.getItem()){
                //console.log("weapon change to: ",this.inventory.getItem().sprite.imageId);
                this.emitter.fireEvent(finalproject_Events.PLAYER_WEAPON_CHANGE,{weapon:this.inventory.getItem().sprite.imageId});
            }
        }

                // Check for slot change
        if (Input.isJustPressed("skill")) {
           
        }



        // Check if there is an item to pick up
        if (Input.isJustPressed("interact")) {
            console.log(this.items);
            for (let item of this.items) {
                if (this.owner.collisionShape.overlaps(item.sprite.boundary)) {
                    console.log("try pickup");
                    // We overlap it, try to pick it up
                    //console.log(this.inventory.getItem().sprite.imageId);
                    if (this.inventory.getItem()){
                        if (this.inventory.getItem().sprite.imageId==="pistol"){
                            if(item.sprite.imageId==="machineGun"||item.sprite.imageId==="laserGun"){
                                this.inventory.getItem().moveSprite(this.owner.position, "primary");
                                this.items.push(this.inventory.getItem());
                                this.inventory.removeItem();
                                this.inventory.addItem(item);
                                console.log("weapon change to: ",this.inventory.getItem().sprite.imageId);
                                this.emitter.fireEvent(finalproject_Events.PLAYER_WEAPON_CHANGE,{weapon:this.inventory.getItem().sprite.imageId});
                            }
                        }
                        else if(this.inventory.getItem().sprite.imageId==="knife"){
                            if(item.sprite.imageId==="lightSaber"){
                                this.inventory.getItem().moveSprite(this.owner.position, "primary");
                                this.items.push(this.inventory.getItem());
                                this.inventory.removeItem();
                                this.inventory.addItem(item);
                                console.log("weapon change to: ",this.inventory.getItem().sprite.imageId);
                                this.emitter.fireEvent(finalproject_Events.PLAYER_WEAPON_CHANGE,{weapon:this.inventory.getItem().sprite.imageId});
                            }
                        }
                        else if(this.inventory.getItem().sprite.imageId==="machineGun"){
                            if(item.sprite.imageId==="laserGun"){
                                this.inventory.getItem().moveSprite(this.owner.position, "primary");
                                this.items.push(this.inventory.getItem());
                                this.inventory.removeItem();
                                this.inventory.addItem(item);
                                console.log("weapon change to: ",this.inventory.getItem().sprite.imageId);
                                this.emitter.fireEvent(finalproject_Events.PLAYER_WEAPON_CHANGE,{weapon:this.inventory.getItem().sprite.imageId});
                            }
                        }
                    }
                    this.inventory.addItem(item);
                    break;
                }
            }
        }
    } 
    
    attack(direction:Vec2): void {
        if(this.inventory.getItem()!=null) 
        {this.inventory.getItem().use(this.owner,"player",direction);}
          
    }
    
          	
}