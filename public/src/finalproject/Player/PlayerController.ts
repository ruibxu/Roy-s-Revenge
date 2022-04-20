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
import Walk from "./PlayerStates/Walk";
import InventoryManager from "../GameSystems/InventoryManager";
import Receiver from "../../Wolfie2D/Events/Receiver";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Input from "../../Wolfie2D/Input/Input";
import Item from "../GameSystems/items/Item";
import GameLevel from "../Scenes/Gamelevel";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../Wolfie2D/Timing/Timer";


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
    health: number;
    velocity: Vec2 = Vec2.ZERO;
	speed: number = 200;
	MIN_SPEED: number = 200;
    MAX_SPEED: number = 300;
    tilemap: OrthogonalTilemap;
    tilemap_laser: OrthogonalTilemap;
    tilemap_spike: OrthogonalTilemap;
    background: OrthogonalTilemap;
    isDead: boolean = false;
     //add inverntory
    inventory: InventoryManager;
    items: Array<Item>;
    faceDirection: Vec2;
    state: String;
    skillmode: boolean;
    skillcooldown: Timer;
    gravity: number;

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
        this.tilemap_laser = this.owner.getScene().getTilemap(options.tilemap_laser) as OrthogonalTilemap;
        this.tilemap_spike = this.owner.getScene().getTilemap(options.tilemap_spike) as OrthogonalTilemap;
        this.background = this.owner.getScene().getTilemap(options.back) as OrthogonalTilemap;
        this.receiver = new Receiver();
		this.emitter = new Emitter();

        
        this.receiver.subscribe(finalproject_Events.SKILLMODE);
        this.receiver.subscribe(finalproject_Events.ATTACK);
        this.receiver.subscribe(finalproject_Events.PLAYER_DAMAGE);

        this.health = 3;
        this.items = options.items;
        this.inventory = options.inventory;
        this.faceDirection = Vec2.ZERO;
        this.faceDirection.x=1;
        this.state="idle";
        this.skillmode=false;
		this.skillcooldown=new Timer(2000);
        this.gravity=1000;

    }


    handleInput(event: GameEvent): void {
		// We need to handle animations when we get hurt
		if(event.type === finalproject_Events.PLAYER_DAMAGE){
			if(event.data.get("health") === 0){
				// Play animation and queue event to end game
				this.isDead=true;

				this.emitter.fireEvent( finalproject_Events.PLAYER_DEAD);
			} else {
			}
		}
    
        
	}


    initializePlatformer(): void {
        this.speed = 400;

        let idle = new Idle(this, this.owner);
		this.addState(PlayerStates.IDLE, idle);
		let walk = new Walk(this, this.owner);
		this.addState(PlayerStates.WALK, walk);
		let jump = new Jump(this, this.owner);
        this.addState(PlayerStates.JUMP, jump);
        let fall = new Fall(this, this.owner);
        this.addState(PlayerStates.FALL, fall);
        
        this.initialize(PlayerStates.IDLE);
    }

    changeState(stateName: string): void {
        // If we jump or fall, push the state so we can go back to our current state later
        // unless we're going from jump to fall or something
        this.state = stateName;
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
        
        let player_location=new Vec2(this.owner.position.x, this.owner.position.y);
        let below_player_location=new Vec2(this.owner.position.x, this.owner.position.y+32);
        let above_player_location=new Vec2(this.owner.position.x, this.owner.position.y-32);
        let right_player_location=new Vec2(this.owner.position.x+32, this.owner.position.y);
        let left_player_location=new Vec2(this.owner.position.x-32, this.owner.position.y);

        //console.log("spike layer: ",this.tilemap_spike.getTileAtWorldPosition(below_player_location));
        //console.log("laser layer: ",this.tilemap_laser.getTileAtWorldPosition(player_location));

        //handle if player on switch
        if(this.tilemap.getTileAtWorldPosition(below_player_location)==12){
            //set the switch to off
            this.tilemap.setTileAtRowCol(this.tilemap.getColRowAt(below_player_location),13);
            //set all laser to invisible
            for (let x=0; x < this.tilemap_laser.getDimensions().x ; x++){
                for (let y=0; y < this.tilemap_laser.getDimensions().y ; y++){
                    if(this.tilemap_laser.getTileAtWorldPosition(new Vec2(x*32,y*32))==16){
                        this.tilemap_laser.setTileAtRowCol(new Vec2(x,y),0);
                    }
                }
            }
            this.emitter.fireEvent(finalproject_Events.PLAYER_HIT_SWITCH);
        }

        if(this.tilemap.getTileAtWorldPosition(above_player_location)==12){
            //set the switch to off
            this.tilemap.setTileAtRowCol(this.tilemap.getColRowAt(above_player_location),13);
            //set all laser to invisible
            for (let x=0; x < this.tilemap_laser.getDimensions().x ; x++){
                for (let y=0; y < this.tilemap_laser.getDimensions().y ; y++){
                    if(this.tilemap_laser.getTileAtWorldPosition(new Vec2(x*32,y*32))==16){
                        this.tilemap_laser.setTileAtRowCol(new Vec2(x,y),0);
                    }
                }
            }
            this.emitter.fireEvent(finalproject_Events.PLAYER_HIT_SWITCH);
        }

        //handle if player hit trap
        if(this.tilemap_laser.getTileAtWorldPosition(player_location)==16 || this.tilemap_spike.getTileAtWorldPosition(below_player_location)==4 || this.tilemap_spike.getTileAtWorldPosition(above_player_location)==15){
            this.emitter.fireEvent(finalproject_Events.PLAYER_HIT_TRAP);
        }


        let gamelevel = <GameLevel> this.owner.getScene();
        if(gamelevel.isPaused()){
            return;
        }

		if(Input.isPressed("skill")&&this.skillcooldown.isStopped()&&(this.owner.onGround||this.owner.onCeiling)){	
			this.skillcooldown.reset();
			this.skillcooldown.start();
			this.skillmode=!this.skillmode;
            this.gravity=-this.gravity;
			this.emitter.fireEvent(finalproject_Events.SKILLMODE);
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

        for (let item of this.items) {
            if (this.owner.collisionShape.overlaps(item.sprite.boundary)) {
                if(item.sprite.imageId==="healthpack"){
                    //If it is a health pack, don't put into inventory, but use it directly by firing PickupHealthpack event
                    console.log("pick up healthpack event fired.");
                    item.removeSprite();
                    this.items.splice(this.items.indexOf(item),1);
                    this.emitter.fireEvent(finalproject_Events.PICKUP_HEALTHPACK);
                }
                else if(item.sprite.imageId==="gear"){
                    //If it is a gear, don't put into inventory, but use it directly by firing PickupGear event
                    console.log("pick up gear event fired.");
                    item.removeSprite();
                    this.items.splice(this.items.indexOf(item),1);
                    this.emitter.fireEvent(finalproject_Events.PICKUP_GEAR);
                }
            }
        }


        // Check if there is an item to pick up
        if (Input.isJustPressed("interact")) {
                    // We overlap it, try to pick it up
                    //console.log(this.inventory.getItem().sprite.imageId);
            if(this.background.getTileAtWorldPosition(player_location)==14){
                this.emitter.fireEvent(finalproject_Events.HINT);
                console.log("see hint");
                ////////////////////////////////////
                ////////////////////////////////////////////////////////////////
                ///////////////////////////////
            }
            for (let item of this.items) {
                if (this.owner.collisionShape.overlaps(item.sprite.boundary)) {
                    // We overlap it, try to pick it up
                    if (this.inventory.getItem()){
                        this.inventory.getItem().moveSprite(this.owner.position, "primary");
                        this.items.push(this.inventory.getItem());
                        this.inventory.removeItem();
                        this.inventory.addItem(item);
                        this.emitter.fireEvent(finalproject_Events.PLAYER_WEAPON_CHANGE,{weapon:this.inventory.getItem().sprite.imageId});
                        break;
                    }
                    else{
                        this.inventory.addItem(item);
                        break;
                    }
                }

            }
        }
        if(Input.isPressed("left")&& !(this.state === PlayerStates.JUMP) && !(this.state === PlayerStates.FALL)){
            this.faceDirection.x=-1;
        }
        if(Input.isPressed("right")&& !(this.state === PlayerStates.JUMP) && !(this.state === PlayerStates.FALL)){
            this.faceDirection.x=1;
        }
        
        if(Input.isMouseJustPressed()){	
            let weapon = this.inventory.getItem();  
            if(this.inventory.getItem()){
                weapon.use(this.owner,"player",this.faceDirection);}
            }
            


            if(this.currentState instanceof Jump){
                Debug.log("playerstate", "Player State: Jump");
            } else if (this.currentState instanceof Walk){
                Debug.log("playerstate", "Player State: Walk");
            } else if (this.currentState instanceof Idle){
                Debug.log("playerstate", "Player State: Idle");
            } else if(this.currentState instanceof Fall){
                Debug.log("playerstate", "Player State: Fall");
            }


		}



} 
    