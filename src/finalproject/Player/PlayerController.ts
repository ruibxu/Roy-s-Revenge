import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import GameNode, { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import { finalproject_Events, level1_tiles, level3_tiles, level5_tiles } from "../finalproject_constants";
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
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";


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
    tilemap_laser_red: OrthogonalTilemap;
    tilemap_laser_green: OrthogonalTilemap;
    tilemap_laser_blue: OrthogonalTilemap;
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

    hintopened: boolean = false;
    
    is_taking_damage:boolean;

    levelnumber : number;
    private laserReds : Vec2[] = [];
    private laserGreens : Vec2[] = [];
    private laserBlues : Vec2[] = [];
    switchTimer : Timer;

    initializeAI(owner: GameNode, options: Record<string, any>){
        this.owner = owner;
    
        this.initializePlatformer();
        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
        this.tilemap_laser_red = this.owner.getScene().getTilemap(options.tilemap_laser_red) as OrthogonalTilemap;
        this.tilemap_laser_green = this.owner.getScene().getTilemap(options.tilemap_laser_green) as OrthogonalTilemap;
        this.tilemap_laser_blue = this.owner.getScene().getTilemap(options.tilemap_laser_blue) as OrthogonalTilemap;
        this.tilemap_spike = this.owner.getScene().getTilemap(options.tilemap_spike) as OrthogonalTilemap;
        this.background = this.owner.getScene().getTilemap(options.back) as OrthogonalTilemap;
        this.receiver = new Receiver();
		this.emitter = new Emitter();

        this.receiver.subscribe(finalproject_Events.SKILLMODE);
        this.receiver.subscribe(finalproject_Events.ATTACK);
        this.receiver.subscribe(finalproject_Events.PLAYER_DAMAGE);
        this.receiver.subscribe("taking_damage");
        this.receiver.subscribe("damagefinish");
        
        this.health = 3;
        this.items = options.items;
        this.inventory = options.inventory;
        this.faceDirection = Vec2.ZERO;
        this.faceDirection.x=1;
        this.state="idle";
        this.skillmode=false;
		this.skillcooldown=new Timer(2000);
        this.gravity=1000;
        this.is_taking_damage=false;
        this.levelnumber=options.levelnumber;
        this.switchTimer = new Timer(1000);

        owner.tweens.add("damage", {
            startDelay: 0,
            duration: 800,
            effects: [
                {
                    property: "alpha",
                    start: 0.2,
                    end: 1,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ]
        });
    }

    handleLaserOnOFF (tileLayer : OrthogonalTilemap , turnOn : boolean) : void {
        let level;
        if(this.levelnumber==1 || this.levelnumber==2){level = level1_tiles;}
        else if(this.levelnumber==3 || this.levelnumber==4){level = level3_tiles;}
        else {level = level5_tiles;}

        if(tileLayer==this.tilemap_laser_red){
            if (!turnOn){ //turn off lasers
                for (let x=0; x < tileLayer.getDimensions().x ; x++){
                    for (let y=0; y < tileLayer.getDimensions().y ; y++){
                        if(tileLayer.getTileAtWorldPosition(new Vec2(x*32,y*32))==level.LASER_RED){
                            tileLayer.setTileAtRowCol(new Vec2(x,y),level.EMPTY);
                            console.log("append: ", new Vec2(x,y));
                            this.laserReds.push(new Vec2(x,y)); //store the position of laser tiles
                        }
                        if (this.tilemap.getTileAtWorldPosition(new Vec2(x*32,y*32))==level.SWITCH_RED_ON){
                            this.tilemap.setTileAtRowCol(new Vec2(x,y),level.SWITCH_RED_OFF); //set the switch to off
                        }
                    }
                }
            }else{      //turn on lasers
                for (let i=0; i<this.laserReds.length; i++){
                    tileLayer.setTileAtRowCol(this.laserReds[i],level.LASER_RED);
                }
                this.laserReds = [];
                for (let x=0; x < tileLayer.getDimensions().x ; x++){
                    for (let y=0; y < tileLayer.getDimensions().y ; y++){
                        if (this.tilemap.getTileAtWorldPosition(new Vec2(x*32,y*32))==level.SWITCH_RED_OFF){
                            this.tilemap.setTileAtRowCol(new Vec2(x,y),level.SWITCH_RED_ON); //set the switch to off
                        }
                    }
                }
            }
        }
        else if (tileLayer==this.tilemap_laser_green){
            if (!turnOn){ 
                for (let x=0; x < tileLayer.getDimensions().x ; x++){
                    for (let y=0; y < tileLayer.getDimensions().y ; y++){
                        if(tileLayer.getTileAtWorldPosition(new Vec2(x*32,y*32))==level.LASER_GREEN){
                            tileLayer.setTileAtRowCol(new Vec2(x,y),level.EMPTY);
                            this.laserGreens.push(new Vec2(x,y)); //store the position of laser tiles
                        }
                        if (this.tilemap.getTileAtWorldPosition(new Vec2(x*32,y*32))==level.SWITCH_GREEN_ON){
                            this.tilemap.setTileAtRowCol(new Vec2(x,y),level.SWITCH_GREEN_OFF); //set the switch to off
                        }
                    }
                }
            }else{
                for (let i=0; i<this.laserGreens.length; i++){
                    tileLayer.setTileAtRowCol(this.laserGreens[i],level.LASER_GREEN);
                }
                this.laserGreens = [];
                for (let x=0; x < tileLayer.getDimensions().x ; x++){
                    for (let y=0; y < tileLayer.getDimensions().y ; y++){
                        if (this.tilemap.getTileAtWorldPosition(new Vec2(x*32,y*32))==level.SWITCH_GREEN_OFF){
                            this.tilemap.setTileAtRowCol(new Vec2(x,y),level.SWITCH_GREEN_ON); //set the switch to off
                        }
                    }
                }
            }
        }
        else {
            if (!turnOn){
                for (let x=0; x < tileLayer.getDimensions().x ; x++){
                    for (let y=0; y < tileLayer.getDimensions().y ; y++){
                        if(tileLayer.getTileAtWorldPosition(new Vec2(x*32,y*32))==level.LASER_BLUE){
                            tileLayer.setTileAtRowCol(new Vec2(x,y),level.EMPTY);
                            this.laserBlues.push(new Vec2(x,y)); //store the position of laser tiles
                        }
                        if (this.tilemap.getTileAtWorldPosition(new Vec2(x*32,y*32))==level.SWITCH_BLUE_ON){
                            this.tilemap.setTileAtRowCol(new Vec2(x,y),level.SWITCH_BLUE_OFF); //set the switch to off
                        }
                    }
                }
            }else{
                for (let i=0; i<this.laserBlues.length; i++){
                    tileLayer.setTileAtRowCol(this.laserBlues[i],level.LASER_BLUE);
                }
                this.laserBlues = [];
                for (let x=0; x < tileLayer.getDimensions().x ; x++){
                    for (let y=0; y < tileLayer.getDimensions().y ; y++){
                        if (this.tilemap.getTileAtWorldPosition(new Vec2(x*32,y*32))==level.SWITCH_BLUE_OFF){
                            this.tilemap.setTileAtRowCol(new Vec2(x,y),level.SWITCH_BLUE_ON); //set the switch to off
                        }
                    }
                }
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

    update(deltaT: number): void {
		super.update(deltaT);
        
        let player_location=new Vec2(this.owner.position.x, this.owner.position.y);
        let below_player_location=new Vec2(this.owner.position.x, this.owner.position.y+32);
        let above_player_location=new Vec2(this.owner.position.x, this.owner.position.y-32);
        let right_player_location=new Vec2(this.owner.position.x+32, this.owner.position.y);
        let left_player_location=new Vec2(this.owner.position.x-32, this.owner.position.y);

        let level;
        if(this.levelnumber==1 || this.levelnumber==2){level = level1_tiles;}
        else if(this.levelnumber==3 || this.levelnumber==4){level = level3_tiles;}
        else {level = level5_tiles;}
        
        //handle if player hit hint
        if(this.background.getTileAtWorldPosition(player_location)==14&&this.hintopened==false){
            this.emitter.fireEvent(finalproject_Events.HINT);
            this.hintopened=true;
        }
        else if (this.background.getTileAtWorldPosition(player_location)!=14){
            this.emitter.fireEvent(finalproject_Events.HINTDISABLE);
            this.hintopened=false;
        }

        //red lasers
        //turn off red lasers from above
        if(this.tilemap.getTileAtWorldPosition(below_player_location)==level.SWITCH_RED_ON && this.switchTimer.isStopped()){
            this.handleLaserOnOFF(this.tilemap_laser_red,false); //turn off red lasers
            this.emitter.fireEvent(finalproject_Events.PLAYER_HIT_SWITCH);
            this.switchTimer.start();
        }
        //turn on red lasers from above
        if(this.tilemap.getTileAtWorldPosition(below_player_location)==level.SWITCH_RED_OFF && this.switchTimer.isStopped()){
            this.handleLaserOnOFF(this.tilemap_laser_red,true); //turn on red lasers
            this.emitter.fireEvent(finalproject_Events.PLAYER_HIT_SWITCH);
            this.switchTimer.start();
        }
        //turn off red lasers from below
        if(this.tilemap.getTileAtWorldPosition(above_player_location)==level.SWITCH_RED_ON && this.switchTimer.isStopped()){
            this.handleLaserOnOFF(this.tilemap_laser_red,false); //turn off red lasers
            this.emitter.fireEvent(finalproject_Events.PLAYER_HIT_SWITCH);
            this.switchTimer.start();
        }
        //turn on red lasers from below
        if(this.tilemap.getTileAtWorldPosition(above_player_location)==level.SWITCH_RED_OFF && this.switchTimer.isStopped()){
            this.handleLaserOnOFF(this.tilemap_laser_red,true); //turn on red lasers
            this.emitter.fireEvent(finalproject_Events.PLAYER_HIT_SWITCH);
            this.switchTimer.start();
        }
        //green lasers
        if(this.tilemap_laser_green){
            //turn off green lasers from above
            if(this.tilemap.getTileAtWorldPosition(below_player_location)==level.SWITCH_GREEN_ON && this.switchTimer.isStopped()){
                this.handleLaserOnOFF(this.tilemap_laser_green,false); //turn off green lasers
                this.emitter.fireEvent(finalproject_Events.PLAYER_HIT_SWITCH);
                this.switchTimer.start();
            }
            //turn on green lasers from above
            if(this.tilemap.getTileAtWorldPosition(below_player_location)==level.SWITCH_GREEN_OFF && this.switchTimer.isStopped()){
                this.handleLaserOnOFF(this.tilemap_laser_green,true); //turn on green lasers
                this.emitter.fireEvent(finalproject_Events.PLAYER_HIT_SWITCH);
                this.switchTimer.start();
            }
            //turn off green lasers from below
            if(this.tilemap.getTileAtWorldPosition(above_player_location)==level.SWITCH_GREEN_ON && this.switchTimer.isStopped()){
                this.handleLaserOnOFF(this.tilemap_laser_green,false); //turn off green lasers
                this.emitter.fireEvent(finalproject_Events.PLAYER_HIT_SWITCH);
                this.switchTimer.start();
            }
            //turn on green lasers from below
            if(this.tilemap.getTileAtWorldPosition(above_player_location)==level.SWITCH_GREEN_OFF && this.switchTimer.isStopped()){
                this.handleLaserOnOFF(this.tilemap_laser_green,true); //turn on green lasers
                this.emitter.fireEvent(finalproject_Events.PLAYER_HIT_SWITCH);
                this.switchTimer.start();
            }
        }
        //blue lasers
        if(this.tilemap_laser_blue){
            //turn off blue lasers from above
            if(this.tilemap.getTileAtWorldPosition(below_player_location)==level.SWITCH_BLUE_ON && this.switchTimer.isStopped()){
                this.handleLaserOnOFF(this.tilemap_laser_blue,false); //turn off blue lasers
                this.emitter.fireEvent(finalproject_Events.PLAYER_HIT_SWITCH);
                this.switchTimer.start();
            }
            //turn on blue lasers from above
            if(this.tilemap.getTileAtWorldPosition(below_player_location)==level.SWITCH_BLUE_OFF && this.switchTimer.isStopped()){
                this.handleLaserOnOFF(this.tilemap_laser_blue,true); //turn on blue lasers
                this.emitter.fireEvent(finalproject_Events.PLAYER_HIT_SWITCH);
                this.switchTimer.start();
            }
            //turn off blue lasers from below
            if(this.tilemap.getTileAtWorldPosition(above_player_location)==level.SWITCH_BLUE_ON && this.switchTimer.isStopped()){
                this.handleLaserOnOFF(this.tilemap_laser_blue,false); //turn off blue lasers
                this.emitter.fireEvent(finalproject_Events.PLAYER_HIT_SWITCH);
                this.switchTimer.start();
            }
            //turn on blue lasers from below
            if(this.tilemap.getTileAtWorldPosition(above_player_location)==level.SWITCH_BLUE_OFF && this.switchTimer.isStopped()){
                this.handleLaserOnOFF(this.tilemap_laser_blue,true); //turn on blue lasers
                this.emitter.fireEvent(finalproject_Events.PLAYER_HIT_SWITCH);
                this.switchTimer.start();
            }
        }

        //handle if player hit laser
        if(this.tilemap_laser_red.getTileAtWorldPosition(player_location)==level.LASER_RED)
            {this.emitter.fireEvent(finalproject_Events.PLAYER_DAMAGE, {"damage":20});}
        if(this.tilemap_laser_green){
            if(this.tilemap_laser_green.getTileAtWorldPosition(player_location)==level.LASER_GREEN)
            {this.emitter.fireEvent(finalproject_Events.PLAYER_DAMAGE, {"damage":20});}
        }
        if(this.tilemap_laser_blue){
            if(this.tilemap_laser_blue.getTileAtWorldPosition(player_location)==level.LASER_BLUE)
            {this.emitter.fireEvent(finalproject_Events.PLAYER_DAMAGE, {"damage":20});}
        }
        //handle if player hit spike
        if(this.tilemap_spike.getTileAtWorldPosition(below_player_location)==level.SPIKE_DOWN || this.tilemap_spike.getTileAtWorldPosition(above_player_location)==level.SPIKE_UP)
            {this.emitter.fireEvent(finalproject_Events.PLAYER_DAMAGE, {"damage":20});}

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
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "skill", loop: false, holdReference: false});
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
            if(this.inventory.getItem()){weapon.use(this.owner,"player",this.faceDirection);}
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
    