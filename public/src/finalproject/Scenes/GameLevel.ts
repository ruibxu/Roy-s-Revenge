import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Point from "../../Wolfie2D/Nodes/Graphics/Point";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import { finalproject_Events, finalproject_Statuses,finalproject_Names } from "../finalproject_constants";
import HW5_ParticleSystem from "../HW5_ParticleSystem";
import PlayerController from "../Player/PlayerController";
import MainMenu from "./MainMenu";
import Layer from "../../Wolfie2D/Scene/Layer";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import InventoryManager from "../GameSystems/InventoryManager";
import Item from "../GameSystems/items/Item";
import WeaponType from "../GameSystems/items/WeaponTypes/WeaponType";
import Weapon from "../GameSystems/items/Weapon";
import RegistryManager from "../../Wolfie2D/Registry/RegistryManager";
import Healthpack from "../GameSystems/items/Healthpack";
import BattleManager from "../GameSystems/BattleManager";
import CanvasNode from "../../Wolfie2D/Nodes/CanvasNode";
import AttackAction from "../Enemies/EnemyActions/AttackAction";
import GoapAction from "../../Wolfie2D/DataTypes/Interfaces/GoapAction";
import GoapActionPlanner from "../../Wolfie2D/AI/GoapActionPlanner";
import Map from "../../Wolfie2D/DataTypes/Map";
import EnemyAI from "../Enemies/EnemyAI";
import Move from "../Enemies/EnemyActions/Move";
import BattlerAI from "../Enemies/BattlerAI";
import PositionGraph from "../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Navmesh from "../../Wolfie2D/Pathfinding/Navmesh";
import Gear from "../GameSystems/items/Gear";
import Idle from "../Enemies/EnemyActions/Idle";
import Decision from "./Decision";



export default class GameLevel extends Scene {
    // protected enemy: AnimatedSprite;
    // Every level will have a player, which will be an animated sprite
    public enemies : Array<AnimatedSprite>
    protected playerSpawn: Vec2;
    protected player: AnimatedSprite;
    protected respawnTimer: Timer;


    protected ui_layer: Layer;
    protected game: Layer;
    protected ingamemenu: Layer;
    protected controls: Layer;
    protected help: Layer;
    protected hintLayer: Layer;


    protected item: Item;


    protected inventory: InventoryManager;

    protected ispaused: boolean;
    protected isInvincible: boolean;

    // Labels for the UI
    protected static livesCount: number = 20;
    protected livesCountLabel: Label;
    protected static gearCount: number = 0;
    protected gearCountLabel: Label;



    // Stuff to end the level and go to the next level
    
    protected nextLevel: new (...args: any) => GameLevel;
    protected currentLevel: new (...args: any) => GameLevel;

    protected levelEndArea: Rect;
    protected levelEndTimer: Timer;
    protected levelEndLabel: Label;
    
    // Screen fade in/out for level start and end
    protected levelTransitionTimer: Timer;
    protected levelTransitionScreen: Rect;
    
    // Custom particle sysyem
    protected system: HW5_ParticleSystem;

    // The position graph for the navmesh
    private graph: PositionGraph;

    // A list of items in the scene
    private items: Array<Item>;

    // The battle manager for the scene
    private battleManager: BattleManager;

    //Timer for invincible time
    private damageTimer: Timer;
    private msgTimer: Timer;

    //Player is dead
    private isDead: boolean;
    private levelCount: number;


    protected bullets:Array<CanvasNode>;
    protected enemy_bullets:Array<CanvasNode>;
    private invinciblebtn: Button;
    levelnumber: number;
    private msglayer: Layer;
    private msglayer2: Layer;



    initScene(init: Record<string, any>):void {
        this.isInvincible = init.isInvincible;
        this.levelCount=init.levelCount;
    }
    startScene(): void {
        // Do the game level standard initializations
     
        this.initWeapons();
        this.initLayers();
        this.initViewport();
        this.subscribeToEvents();
        this.addUI();

        this.battleManager = new BattleManager();
        
        this.items = new Array();
        this.spawnItems();
        this.initPlayer();

        console.log(this.currentLevel);

        // Create the navmesh
        this.createNavmesh();
        this.initEnemies();

        this.bullets = new Array();
        this.enemy_bullets = new Array();
        this.ispaused=false;
        // Send the player and enemies to the battle manager
        this.battleManager.setPlayers(<BattlerAI>this.player._ai);
        this.battleManager.setEnemies(this.enemies.map(enemy => <BattlerAI>enemy._ai));

        this.ispaused=false;
        // 10 second cooldown for ultimate

        //1 second timer for player invincible
        this.damageTimer = new Timer(1000);
        this.msgTimer = new Timer(1000);
        this.respawnTimer = new Timer(3000);

        this.isDead = false;

        this.levelTransitionScreen.tweens.play("fadeOut");

        this.levelTransitionTimer = new Timer(500);
        this.levelEndTimer = new Timer(3000, () => {
            // After the level end timer ends, fade to black and then go to the next scene
            this.levelTransitionScreen.tweens.play("fadeIn");
        });

        this.levelTransitionScreen.tweens.play("fadeOut");
        

        // Initialize the timers
        /*
        this.respawnTimer = new Timer(1000, () => {
            if(GameLevel.livesCount === 0){
                this.sceneManager.changeToScene(MainMenu);
            } else {
                this.respawnPlayer();
                this.player.enablePhysics();
                this.player.unfreeze();
            }
        });


        this.levelTransitionTimer = new Timer(500);




        // Start the black screen fade out
        

        // Initially disable player movement
        Input.disableInput();
        //this.emitter.fireEvent(HW5_Events.SUIT_COLOR_CHANGE, {color: HW5_Color.RED});
        */
    }


    updateScene(deltaT: number){
        // Handle events and update the UI if needed
    
        //check if bullet out of screen
        const viewportCenter = this.viewport.getCenter().clone();	
		const ViewportSize = this.viewport.getHalfSize().scaled(2);
        for(let bullet of this.bullets){
				this.handleScreenDespawn(bullet, viewportCenter, ViewportSize);
		}
        for(let bullet of this.enemy_bullets){
            this.handleScreenDespawn(bullet, viewportCenter, ViewportSize);
        }
        this.handleCollisions();
        
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            
            if(event.type === "ingame_menu"){
                this.ui_layer.disable();
                this.game.disable();
                this.ingamemenu.enable();
                this.controls.disable();
                this.help.disable();
                this.hintLayer.disable();
                this.viewport.setBounds(0, 0, 1200, 800);
                this.viewport.setZoomLevel(1);
                console.log(this.viewport.getZoomLevel());
                console.log(this.viewport.getCenter());
                this.getLayer("slots").disable();
                this.getLayer("items").disable();
                this.ispaused=true;
                this.tilemaps.forEach(tilemap => {
                    tilemap.visible = false;
                    tilemap.getLayer().disable();
                });
                
            }
            if(event.type === "back_to_game"){
                this.ui_layer.enable();
                this.game.enable();
                this.ingamemenu.disable();
                this.getLayer("slots").enable();
                this.getLayer("items").enable();
                this.viewport.setZoomLevel(2.25);
                if(this.levelnumber==1||this.levelnumber==2){
                    this.viewport.setBounds(0, 0, 128*32, 16*32);
                }
                else{
                    this.viewport.setBounds(0, 0, 128*32, 32*32);
                }
               
                this.ispaused=false;
                this.tilemaps.forEach(tilemap => {
                    tilemap.visible = true;
                    tilemap.getLayer().enable();
                });
                
            }
            if(event.type === "newgame"){
                this.viewport.setZoomLevel(1);
                this.respawnPlayer();
            }
            if(event.type === "select"){
                this.viewport.setZoomLevel(1);
                GameLevel.gearCount=0;
                GameLevel.livesCount=20;
                this.sceneManager.changeToScene(Decision, {
                    isInvincible: this.isInvincible,
                    levelCount: this.levelCount
                });
            }
            if(event.type === "menu"){
                this.viewport.setZoomLevel(1);
                GameLevel.gearCount=0;
                GameLevel.livesCount=20;
                this.sceneManager.changeToScene(MainMenu, {
                    isInvincible: this.isInvincible,
                    levelCount: this.levelCount
                });
            }
            if(event.type === "resume"){
                this.emitter.fireEvent("back_to_game");
            }
            if(event.type === "control"){
                this.controls.enable();
                this.ingamemenu.disable();
    
            }
            if(event.type === "help"){
                this.help.enable();
                this.ingamemenu.disable();
            }
            if(event.isType("healthpack")){
                this.createHealthpack(event.data.get("position"));
            }
            // Debug mode graph
            if(Input.isKeyJustPressed("g")){
                this.getLayer("graph").setHidden(!this.getLayer("graph").isHidden());
            }
            if(Input.isKeyJustPressed("c")){
                let weapon = this.createWeapon("knife");
                weapon.moveSprite(this.player.position);
                this.items.push(weapon);
                
            }
            if(Input.isKeyJustPressed("v")){
                let weapon = this.createWeapon("pistol");
                weapon.moveSprite(this.player.position);
                this.items.push(weapon);
            }
            if(Input.isKeyJustPressed("b")){
                let weapon = this.createWeapon("machineGun");
                weapon.moveSprite(this.player.position);
                this.items.push(weapon);
            }
            if(Input.isKeyJustPressed("n")){
                let weapon = this.createWeapon("laserGun");
                weapon.moveSprite(this.player.position);
                this.items.push(weapon);
            }
            if(Input.isKeyJustPressed("m")){
                let weapon = this.createWeapon("lightSaber");
                weapon.moveSprite(this.player.position);
                this.items.push(weapon);
            }
            
            switch(event.type){
                case finalproject_Events.PLAYER_HIT_SWITCH:
                    {
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "switch", loop: false, holdReference: false});
                    }
                    break;
                case finalproject_Events.PLAYER_HIT_GEAR:
                        {
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "gear", loop: false, holdReference: false});
                        }
                    break;
                case finalproject_Events.PLAYER_DAMAGE:
                    {
                        //take damage
                        if(this.damageTimer.isStopped()&&this.isInvincible==false){
                            this.damageTimer.start();
                            this.incPlayerLife(-event.data.get("damage"));
                            this.emitter.fireEvent("taking_damage");
                        }
                        
                    }
                    break;
                case finalproject_Events.ENEMY_DEAD:
                    {
                        this.enemies = this.enemies.filter(enemy => enemy !== event.data.get("enemy"));
                        this.battleManager.enemies = this.battleManager.enemies.filter(enemy => enemy !== <BattlerAI>(event.data.get("enemy")._ai));
                    }
                    break;
                case finalproject_Events.HINT:
                    {
                        this.hintLayer.enable();
                    }
                    break;
                case finalproject_Events.HINTDISABLE:
                    {
                        this.hintLayer.disable();
                    }
                    break;
                case finalproject_Events.PLAYER_ENTERED_LEVEL_END:
                    {
                        //Check if the player has pressed all the switches and popped all of the balloons
                            if(!this.levelEndTimer.hasRun() && this.levelEndTimer.isStopped()){
                                // The player has reached the end of the level
                                this.levelEndTimer.start();
                                this.levelEndLabel.tweens.play("slideIn");
                            }
                    }
                    break;

                case finalproject_Events.LEVEL_START:
                    {
                        // Re-enable controls
                        Input.enableInput();
                    }
                    break;

                case finalproject_Events.LEVEL_PAUSED:
                        {
                            // Re-enable controls
                        Input.disableInput();
                        }
                    break;
                
                case finalproject_Events.LEVEL_END:
                    {
                        GameLevel.gearCount=0;
                        GameLevel.livesCount=20;
                        // Go to the next level


                        if(this.levelnumber>=this.levelCount){
                            this.levelCount=this.levelnumber+1;
                        }


                        this.emitter.fireEvent("levelpassed",{level: this.currentLevel}); 
                    
                        if(this.nextLevel){
                            let sceneOptions = {
                                physics: {
                                    groupNames: ["ground", "player"],
                                    collisions:
                                    [
                                        [0, 1],
                                        [1, 0]
                                    ]
                                }
                            }
                            
                            this.sceneManager.changeToScene(this.nextLevel, {
                                isInvincible: this.isInvincible,
                                levelCount: this.levelCount
                            }, sceneOptions);
                            //this.emitter.fireEvent("menu");   
                        }
                        else{
                            this.emitter.fireEvent("select");
                            
                        }
                    }
                    break;
                case finalproject_Events.PLAYER_KILLED:
                    {
                        this.player.animation.stop();
                        this.player.animation.play("DEAD",false,"newgame");
                        //this.respawnPlayer;

                    }
                    break;
                case finalproject_Events.PICKUP_HEALTHPACK:
                    {
                        this.incPlayerLife(5);
                    }
                    break;
                case finalproject_Events.PICKUP_GEAR:
                    {
                        this.incGearCount(1);
                    }
                    break;
                    case finalproject_Events.SHOOT_BULLET:
                        {
                        let asset = this.sceneGraph.getNode(event.data.get("node"));
                        this.bullets.push(asset);
                        }
                        break;
                    case finalproject_Events.ENEMY_SHOOT_BULLET:
                        {
                        let asset = this.sceneGraph.getNode(event.data.get("node"));
                        this.enemy_bullets.push(asset);
                        }
                        break;
                    case finalproject_Events.UNLOAD_ASSET:
                        {
                        let asset = this.sceneGraph.getNode(event.data.get("node"));
                        asset.destroy();
                        }
                        break;
            }
        }

        if(Input.isKeyJustPressed("escape" )&& this.ingamemenu.isHidden()==true){
            this.emitter.fireEvent("ingame_menu");
        }
        if(Input.isKeyJustPressed("escape" )&& this.ingamemenu.isHidden()==false){
            this.emitter.fireEvent("back_to_game");
        }

        //drop random weapon after 3 gears collected
        if(GameLevel.gearCount==3){
            //console.log("3 gears");
            const allWeapons = ["knife","pistol","laserGun","lightSaber","machineGun"];
            let randomWeapon = allWeapons[Math.floor(Math.random()*allWeapons.length)];
            this.dropWeapon(randomWeapon,this.player.position);
            this.incGearCount(-3);
        }



        if(this.isInvincible==true){
            this.invinciblebtn.text="ON";
            this.invinciblebtn.backgroundColor = Color.GREEN;
            this.invinciblebtn.onClick = () => {
                this.isInvincible=false;
                this.invinciblebtn.backgroundColor = Color.RED;
                this.invinciblebtn.text ="OFF";
            }
        }
        else{
            this.invinciblebtn.backgroundColor = Color.RED;
            this.invinciblebtn.onClick = () => {
                this.isInvincible=true;
                this.invinciblebtn.backgroundColor = Color.GREEN;
                this.invinciblebtn.text ="ON";
            }
        }
        if(Input.isKeyJustPressed("i" ) &&this.isInvincible==true){
            const imsg1 = <Label>this.add.uiElement(UIElementType.LABEL, "msg", {position: new Vec2(275,25), text: "invincible state turned off"});
            this.msgTimer.start();
            this.msglayer2.disable();
            this.msglayer.enable();
            this.isInvincible=false;
            this.invinciblebtn.backgroundColor = Color.RED;
            this.invinciblebtn.text ="OFF";
        }
        else if(Input.isKeyJustPressed("i") &&this.isInvincible==false){
            const imsg1 = <Label>this.add.uiElement(UIElementType.LABEL, "msg2", {position: new Vec2(275,25), text: "invincible state turned on"});
            this.msgTimer.start();
            this.msglayer.disable();
            this.msglayer2.enable();
            this.isInvincible=true;
            this.invinciblebtn.backgroundColor = Color.GREEN;
            this.invinciblebtn.text ="ON";
        }
        if(this.msgTimer.isStopped()){
            this.msglayer.disable();
            this.msglayer2.disable();
        }














        // if((<Weapon>(<PlayerController>this.player._ai).inventory.getItem()).type===)
        // {this.handleScreenDespawn((<Weapon>(<PlayerController>this.player._ai).inventory.getItem()).type.bullets[0],this.viewport.getCenter(),this.viewport.getHalfSize().scaled(2));}
    }

    /**
     * Initialzes the layers
     */
    protected initLayers(): void {
        // Add a layer for UI
        this.ui_layer=this.addUILayer("UI");    
        this.game=this.addLayer("primary", 1);
        this.ingamemenu=this.addLayer("ingame",0);
        this.ingamemenu.disable();


        this.msglayer=this.addUILayer("msg");
        this.msglayer2=this.addUILayer("msg2");
        this.msglayer.disable();
        this.msglayer2.disable();
        

        let size = this.viewport.getHalfSize();
        let center = this.viewport.getCenter();


        //////////////////////////////////////////////////////////////
        //////////////////hints layer/////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////
        this.hintLayer=this.addLayer("hints");
        //////fix this//////////
        this.hintLayer.disable();
        

        let hint1 = "a to move left, d to move right";
        let hint2 = "w or space to jump, be careful with the spikes";
        let hint3= "e to pick up weapons,1 and 2 to change to each slots";
        let hint4 = "Q to cast the skill, which will reverse gravity and Roy will walk on the ceiling";
        let hint5 = "every 3 gears you collected will give you a random weapon";
        let hint6 = "Sometimes laser will block the way, and try to find a switch and step on it to turn off the laser";
        let hint7 = "Kill the enemies and try to get to the endpoint";
       


        const msg1 = <Label>this.add.uiElement(UIElementType.LABEL, "hints", {position: new Vec2(128, 360), text: hint1});
        const msg2 = <Label>this.add.uiElement(UIElementType.LABEL, "hints", {position: new Vec2(128, 368), text: hint2});
        const msg3 = <Label>this.add.uiElement(UIElementType.LABEL, "hints", {position: new Vec2(140, 376), text: hint3});
        const msg4 = <Label>this.add.uiElement(UIElementType.LABEL, "hints", {position: new Vec2(576, 368), text: hint4});
        const msg5 = <Label>this.add.uiElement(UIElementType.LABEL, "hints", {position: new Vec2(576, 376), text: hint5});
        const msg6 = <Label>this.add.uiElement(UIElementType.LABEL, "hints", {position: new Vec2(2400,376), text: hint6});
        const msg7 = <Label>this.add.uiElement(UIElementType.LABEL, "hints", {position: new Vec2(2912,376), text: hint7});

        msg1.fontSize=15;
        msg2.fontSize=15;
        msg3.fontSize=15;
        msg4.fontSize=15;
        msg5.fontSize=15;
        msg6.fontSize=15;
        msg7.fontSize=15;

        msg1.textColor=Color.BLACK;
        msg2.textColor=Color.BLACK;
        msg3.textColor=Color.BLACK;
        msg4.textColor=Color.BLACK;
        msg5.textColor=Color.BLACK;
        msg6.textColor=Color.BLACK;
        msg7.textColor=Color.BLACK;




        ///////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////



        let resumeBtn= <Button>this.add.uiElement(UIElementType.BUTTON, "ingame", {position: new Vec2(size.x, size.y-150), text: "Resume Game"});
        let newGameBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "ingame", {position: new Vec2(size.x, size.y-50), text: "Restart This Level"});
        let CtrlBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "ingame", {position: new Vec2(size.x, size.y+50), text: "Controls"});
        let helpBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "ingame", {position: new Vec2(size.x, size.y+150), text: "Help"});
        let mainMenuBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "ingame", {position: new Vec2(size.x, size.y+250), text: "Main Menu"});


        resumeBtn.backgroundColor = new Color(99,202,253);
        resumeBtn.borderColor = Color.BLACK;
        resumeBtn.borderRadius = 10;
        resumeBtn.setPadding(new Vec2(50, 10));
        resumeBtn.font = "PixelSimple";
        resumeBtn.size.set(400, 50);
        resumeBtn.textColor = Color.BLACK;
        resumeBtn.onClickEventId = "resume";


        newGameBtn.backgroundColor = new Color(99,202,253);
        newGameBtn.borderColor = Color.BLACK;
        newGameBtn.borderRadius = 10;
        newGameBtn.setPadding(new Vec2(50, 10));
        newGameBtn.font = "PixelSimple";
        newGameBtn.size.set(400, 50);
        newGameBtn.textColor = Color.BLACK;
        newGameBtn.onClickEventId = "newgame";

        CtrlBtn.backgroundColor = new Color(99,202,253);
        CtrlBtn.borderColor = Color.BLACK;
        CtrlBtn.borderRadius = 10;
        CtrlBtn.setPadding(new Vec2(50, 10));
        CtrlBtn.font = "PixelSimple";
        CtrlBtn.size.set(400, 50);
        CtrlBtn.textColor = Color.BLACK;
        CtrlBtn.onClickEventId = "control";

        helpBtn.backgroundColor = new Color(99,202,253);
        helpBtn.borderColor = Color.BLACK;
        helpBtn.borderRadius = 10;
        helpBtn.setPadding(new Vec2(50, 10));
        helpBtn.font = "PixelSimple";
        helpBtn.size.set(400, 50);
        helpBtn.textColor = Color.BLACK;
        helpBtn.onClickEventId = "help";


        mainMenuBtn.backgroundColor = new Color(99,202,253);
        mainMenuBtn.borderColor = Color.BLACK;
        mainMenuBtn.borderRadius = 10;
        mainMenuBtn.setPadding(new Vec2(50, 10));
        mainMenuBtn.font = "PixelSimple";
        mainMenuBtn.size.set(400, 50);
        mainMenuBtn.textColor = Color.BLACK;
        mainMenuBtn.onClickEventId = "menu";
    

        //InGameControls
        this.controls= this.addUILayer("controls");
        this.controls.disable();

        
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);


        const controlsBack = <Button>this.add.uiElement(UIElementType.BUTTON, "controls", {position: new Vec2(center.x-450, center.y - 300), text: "Back"});
        controlsBack.size.set(200, 50);
        controlsBack.borderWidth = 2;
        controlsBack.borderColor = Color.BLACK;
        controlsBack.textColor = Color.BLACK;
        controlsBack.backgroundColor = new Color(99,202,253);
        controlsBack.onClickEventId = "ingame_menu";

       

        const controlsHeader = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y - 300), text: "Controls"});

        controlsHeader.fontSize = 70;
        controlsHeader.textColor=Color.WHITE;
        const texta = "a to move left, d to move right";
        const text="space and w to jump, left click to attack";
        const textc = "e to pick up weapons, 1 and 2 to change to each slots";
        const textd = "Q to cast the skill";
        const textd2 ="(which will reverse gravity, and Roy will be able to walk on the ceiling)";

        const linea = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y - 200), text: texta});
        const line = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y-150), text: text});
        const linec = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y-100), text: textc});
        const lined = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y-50), text: textd});
        const lined2 = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y), text: textd2});

        linea.textColor=Color.WHITE;
        line.textColor=Color.WHITE;
        linec.textColor=Color.WHITE;
        lined.textColor=Color.WHITE;
        lined2.textColor=Color.WHITE;

        const txt1= "press esc ingame to enter the ingame menu. ";
        const txt2= "press esc or click the resume button to return back to the game";
        const testmsg1=<Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y + 100), text: txt1});
        const testmsg2=<Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y + 150), text: txt2});

        testmsg1.textColor=Color.WHITE;
        testmsg2.textColor=Color.WHITE;


        // in game help
        this.help= this.addUILayer("help");
        this.help.disable();

        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);


        const helpHeader = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 300), text: "Help"});
        const backStory = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x-450, center.y -225), text: "Backstory"});
        helpHeader.fontSize = 70;
        helpHeader.textColor=Color.WHITE;
        backStory.fontSize = 30;
        backStory.textColor=Color.WHITE;

        const helpBack = <Button>this.add.uiElement(UIElementType.BUTTON, "help", {position: new Vec2(center.x-450, center.y - 300), text: "Back"});
        helpBack.size.set(200, 50);
        helpBack.borderWidth = 2;
        helpBack.borderColor = Color.BLACK;
        helpBack.textColor = Color.BLACK;
        helpBack.backgroundColor = new Color(99,202,253);
        helpBack.onClickEventId = "ingame_menu";

        const storya = "Roy is a robot created by Dr. G that is used to help people in daily lives. Dr. G is a nice,";
        const storyb = "intelligential man who hopes robots can help people live better and be friends with";
        const storyc = "people. Roy is the first robot Dr. G created. Roy is more like a son to Dr. G, unlike";
        const storyd = "other robots, Roy has emotions, and this is and this is the gift Dr.G gives him as the ";
        const storye = "first robots. Another scientist Dr. K has the opposite opinion with ";
        const storyf = "Dr. G, he hopes robots can be weaponized and become war machines. However K’s idea";
        const storyg = "is strongly opposed by Dr. G. Dr. K is very angry that Dr. G was trying to stop him, so ";
        const storyh = "he sends his armed robots to catch Dr. G to his laboratory, however, Dr. G was accidentally";
        const storyi = "killed by the weaponized robots, when Roy discovered that Dr. G was dead, he was very sad and then";
        const storyj = "he started his journey of revenge. He was very sad and then he started his journey of revenge. ";



        const story1 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 200), text: storya});
        const story2 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 175), text: storyb});
        const story3 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 150), text: storyc});
        const story4 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 125), text: storyd});
        const story5 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y -100), text: storye});
        const story6 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y -75), text: storyf});
        const story7 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y -50), text: storyg});
        const story8 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y -25), text: storyh});
        const story9 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y), text: storyi});
        const story10 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y +25), text: storyj});

        story1.textColor=Color.WHITE;
        story2.textColor=Color.WHITE;
        story3.textColor=Color.WHITE;
        story4.textColor=Color.WHITE;
        story5.textColor=Color.WHITE;
        story6.textColor=Color.WHITE;
        story7.textColor=Color.WHITE;
        story8.textColor=Color.WHITE;
        story9.textColor=Color.WHITE;
        story10.textColor=Color.WHITE;
        story1.fontSize=18;
        story2.fontSize=18;
        story3.fontSize=18;
        story4.fontSize=18;
        story5.fontSize=18;
        story6.fontSize=18;
        story7.fontSize=18;
        story8.fontSize=18;
        story9.fontSize=18;
        story10.fontSize=18;



        const cheat_code = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x-450, center.y +75), text: "Cheat codes"});
        cheat_code.fontSize = 30;
        cheat_code.textColor=Color.WHITE;
        const cheata = "Unlock all the levels ";
        const cheatb = "Player becomes invincible ";
        const cheatb2 = "Or you can press i ingame to turn invincible on and off ";
        const cheatc = "Press the level number in the main menu to access the level you want, ex. press 1 to enter level 1";
        const cheatd = "Press c in game to spawn a knife at your current location";
        const cheate = "Press v in game to spawn a pistol at your current location";
        const cheatf = "Press b in game to spawn a machine gun at your current location";
        const cheatg = "Press n in game to spawn a laser gun at your current location";
        const cheath = "Press m in game to spawn a lightsaber at your current location";
        const cheat1 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x-325, center.y +100), text: cheata});
        const cheat2 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x-300, center.y +125), text: cheatb});
        const cheat22 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x+300, center.y +125), text: cheatb2});
        const cheat3 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x-17, center.y +150), text: cheatc});
        const cheat4 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x-180, center.y +175), text: cheatd});
        const cheat5 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x-178, center.y +200), text: cheate});
        const cheat6 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x-147, center.y +225), text: cheatf});
        const cheat7 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x-162, center.y +250), text: cheatg});
        const cheat8 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x-158, center.y +275), text: cheath});

        cheat1.textColor=Color.WHITE;
        cheat2.textColor=Color.WHITE;
        cheat22.textColor=Color.WHITE;
        cheat3.textColor=Color.WHITE;
        cheat4.textColor=Color.WHITE;
        cheat5.textColor=Color.WHITE;
        cheat6.textColor=Color.WHITE;
        cheat7.textColor=Color.WHITE;
        cheat8.textColor=Color.WHITE;

        cheat1.fontSize=18;
        cheat2.fontSize=18;
        cheat22.fontSize=18;
        cheat3.fontSize=18;
        cheat4.fontSize=18;
        cheat5.fontSize=18;
        cheat6.fontSize=18;
        cheat7.fontSize=18;
        cheat8.fontSize=18;

        this.invinciblebtn=<Button>this.add.uiElement(UIElementType.BUTTON, "help", {position: new Vec2(center.x, center.y +125), text: "OFF"});
        this.invinciblebtn.size.set(100, 25);
        this.invinciblebtn.fontSize=18;
        this.invinciblebtn.borderWidth = 2;
        this.invinciblebtn.borderColor = Color.BLACK;
        this.invinciblebtn.textColor = Color.BLACK;
        this.invinciblebtn.backgroundColor = Color.RED;

        const unlockLevelbtn=<Button>this.add.uiElement(UIElementType.BUTTON, "help", {position: new Vec2(center.x, center.y +100), text: "Unlock"});
        unlockLevelbtn.size.set(100, 25);
        unlockLevelbtn.fontSize=18;
        unlockLevelbtn.borderWidth = 2;
        unlockLevelbtn.borderColor = Color.BLACK;
        unlockLevelbtn.textColor = Color.BLACK;
        unlockLevelbtn.backgroundColor = new Color(142,142,142);
        unlockLevelbtn.onClick = () => {
            this.levelCount=6;
            unlockLevelbtn.text ="Unlocked";
        }


        const developers = "Developed by Ruibo Xu, Simon Wang, Hua Lin. ";
        const developers2= <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y +350), text:developers});
        developers2.fontSize=30;
        developers2.textColor=Color.WHITE;


    }



    /**
     * Initializes the viewport
     */
    protected initViewport(): void {
        this.viewport.setZoomLevel(2.25);
    }

    /**
     * Handles all subscriptions to events
     */
     protected subscribeToEvents(){
        //in level events
        this.receiver.subscribe([
            finalproject_Events.ENEMY_DEAD,
            finalproject_Events.PLAYER_HIT_SWITCH,
            finalproject_Events.PLAYER_HIT_WEAPON,
            finalproject_Events.PLAYER_HIT_GEAR,
            finalproject_Events.PLAYER_DAMAGE,
            finalproject_Events.PLAYER_ENTERED_LEVEL_END,
            finalproject_Events.LEVEL_START,
            finalproject_Events.LEVEL_PAUSED,
            finalproject_Events.LEVEL_END,
            finalproject_Events.PLAYER_KILLED,
            finalproject_Events.PLAYER_WEAPON_CHANGE,
            finalproject_Events.PICKUP_HEALTHPACK,
            finalproject_Events.PICKUP_GEAR,
            
            finalproject_Events.PLAYER_WEAPON_CHANGE,
            finalproject_Events.UNLOAD_ASSET,
            finalproject_Events.SHOOT_BULLET,
            finalproject_Events.ENEMY_SHOOT_BULLET,
            finalproject_Events.HINT,
            finalproject_Events.HINTDISABLE
            

        ]);
        //menu events
        this.receiver.subscribe([
            finalproject_Events.IN_GAME_MENU,
            finalproject_Events.BACK_TO_GAME,
            finalproject_Events.HEALTHPACK,
            finalproject_Events.RESUME,
            finalproject_Events.NEWGAME,
            finalproject_Events.CONTROL,
            finalproject_Events.HELP,
            finalproject_Events.MENU,
            finalproject_Events.SELECT,
            
        ])
    }


    protected addUI(){
        //UI labels
        this.gearCountLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(500, 15), text: "Gears: " + GameLevel.gearCount});
        this.gearCountLabel.textColor = Color.BLACK;
        this.gearCountLabel.font = "PixelSimple";
        this.livesCountLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(500, 30), text: "Lives: " + GameLevel.livesCount});
        this.livesCountLabel.textColor = Color.BLACK;
        this.livesCountLabel.font = "PixelSimple";

        // End of level label (start off screen)
        this.levelEndLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(-300, 200), text: "Level Complete"});
        this.levelEndLabel.size.set(1200, 60);
        this.levelEndLabel.borderRadius = 0;
        this.levelEndLabel.backgroundColor = new Color(34, 32, 52);
        this.levelEndLabel.textColor = Color.WHITE;
        this.levelEndLabel.fontSize = 48;
        this.levelEndLabel.font = "PixelSimple";

        // Add a tween to move the label on screen
        this.levelEndLabel.tweens.add("slideIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.posX,
                    start: -300,
                    end: 268,
                    ease: EaseFunctionType.OUT_SINE
                }
            ]
        });



        // Create our particle system and initialize the pool
        this.system = new HW5_ParticleSystem(100, new Vec2((5 * 32), (10 * 32)), 2000, 3, 1, 100);
        this.system.initializePool(this, "primary");

        this.levelTransitionScreen = <Rect>this.add.graphic(GraphicType.RECT, "UI", {position: new Vec2(300, 200), size: new Vec2(600, 400)});
        this.levelTransitionScreen.color = new Color(34, 32, 52);
        this.levelTransitionScreen.alpha = 1;

        this.levelTransitionScreen.tweens.add("fadeIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 0,
                    end: 1,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: finalproject_Events.LEVEL_END
        });

        this.levelTransitionScreen.tweens.add("fadeOut", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: finalproject_Events.LEVEL_START
        });
    }

    /**
     * Initializes the player
     */
    protected initPlayer(): void {
        //add inventory
        this.inventory = new InventoryManager(this, 2, "inventorySlot", new Vec2(32, 32), 4, "slots", "items");
        
        let startingWeapon = this.createWeapon("pistol");
        this.inventory.addItem(startingWeapon);
        
         // Add the player
        this.player = this.add.animatedSprite("player", "primary");
        this.player.scale.set(1, 1);
        if(!this.playerSpawn){
            console.warn("Player spawn was never set - setting spawn to (0, 0)");
            this.playerSpawn = Vec2.ZERO;
        }
        this.player.position.copy(this.playerSpawn);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(14, 14)));
        this.player.colliderOffset.set(0, 2);
        this.player.addAI(PlayerController, 
            {playerType: "platformer", 
            tilemap: "front",   
            tilemap_laser_red: "laser_red",
            tilemap_laser_green: "laser_green",
            tilemap_laser_blue: "laser_blue",
            tilemap_spike: "spike",
            back:"background",
            inventory: this.inventory,
            items: this.items,
            levelnumber: this.levelnumber
            });

        this.player.setGroup("player");

        this.viewport.follow(this.player);
    }

    createNavmesh(): void {
        // Add a layer to display the graph
        let gLayer = this.addLayer("graph");
        gLayer.setHidden(true);

        let navmeshData = this.load.getObject("navmesh");

         // Create the graph
        this.graph = new PositionGraph();

        // Add all nodes to our graph
        for(let node of navmeshData.nodes){
            this.graph.addPositionedNode(new Vec2(node[0], node[1]));
            this.add.graphic(GraphicType.POINT, "graph", {position: new Vec2(node[0], node[1])})
        }

        // Add all edges to our graph
        for(let edge of navmeshData.edges){
            this.graph.addEdge(edge[0], edge[1]);
            this.add.graphic(GraphicType.LINE, "graph", {start: this.graph.getNodePosition(edge[0]), end: this.graph.getNodePosition(edge[1])})
        }

        // Set this graph as a navigable entity
        let navmesh = new Navmesh(this.graph);

        this.navManager.addNavigableEntity(finalproject_Names.NAVMESH, navmesh);
    }

     protected initEnemies(): void {
        // console.log("initEnemies");
        // let actionsRange = [new AttackAction(1, [finalproject_Statuses.IN_RANGE], [finalproject_Statuses.REACHED_GOAL]),
        // new Move(2, [], [finalproject_Statuses.IN_RANGE], {inRange: 100})];
     
        let actionsmelee = [new AttackAction(1, [finalproject_Statuses.IN_RANGE], [finalproject_Statuses.REACHED_GOAL]),
         new Idle(2, [], [finalproject_Statuses.IN_RANGE], {inRange: 60})];
        let actionsrange = [new AttackAction(1, [finalproject_Statuses.IN_RANGE], [finalproject_Statuses.REACHED_GOAL]),
         new Idle(2, [], [finalproject_Statuses.IN_RANGE], {inRange: 150})];
        let actionsplatform = [new AttackAction(2, [finalproject_Statuses.IN_RANGE], [finalproject_Statuses.REACHED_GOAL]),
         new Idle(1, [], [finalproject_Statuses.IN_RANGE], {inRange: 2})];
        /*let actionsBerserk = [new AttackAction(1, [finalproject_Statuses.IN_RANGE], [finalproject_Statuses.REACHED_GOAL]),
        new Idle(2, [], [finalproject_Statuses.IN_RANGE], {inRange: 20})];
        let actionsRetreat = [new AttackAction(1, [finalproject_Statuses.IN_RANGE], [finalproject_Statuses.REACHED_GOAL]),
        new Idle(2, [], [finalproject_Statuses.IN_RANGE], {inRange: 20})];*/
         
     

        const enemyData = this.load.getObject("enemyData");
        this.enemies = new Array(enemyData.numEnemies);

        //Initalize the enemies
        for(let i = 0; i < enemyData.numEnemies; i++){
            let data = enemyData.enemies[i];

            //Create an enemy
            this.enemies[i] = this.add.animatedSprite(data.type, "primary");
            this.enemies[i].position.set(data.position[0],data.position[1]);
            this.enemies[i].animation.play("IDLE",true);

            //Activate physics
            if (data.type=="platform"){
                this.enemies[i].addPhysics(new AABB(Vec2.ZERO, new Vec2(48,16)));
            }
            else if (data.type=="boss"){
                this.enemies[i].addPhysics(new AABB(Vec2.ZERO, new Vec2(32,32)));
            }
            else{ 
                this.enemies[i].addPhysics(new AABB(Vec2.ZERO, new Vec2(16,16)));
            }
            

            if(data.route){
                //console.log(this.graph);
                data.route = data.route.map((index: number) => this.graph.getNodePosition(index));                
            }

            if(data.guardPosition){
                data.guardPosition = new Vec2(data.guardPosition[0], data.guardPosition[1]);
            }

            let statusArray: Array<string> = [finalproject_Statuses.CAN_BERSERK, finalproject_Statuses.CAN_RETREAT];

            //Vary weapon type and choose actions
            let weapon;
            let actions;
            let range;
            let speed;

            if (data.type === "melee_enemy"){
                weapon = this.createWeapon("knife")
                actions = actionsmelee;
                range = 60;
                speed = 20;
            }
            else if (data.type === "ranged_enemy") {
                weapon = this.createWeapon("weak_pistol")
                actions = actionsrange;
                range = 150;
                speed = 20;
            }
            else if (data.type === "melee_enemy_air") {
                weapon = this.createWeapon("knife")
                actions = actionsmelee;
                range = 60;
                speed = 30;
            }
            else if (data.type === "ranged_enemy_air") {
                weapon = this.createWeapon("weak_pistol")
                actions = actionsrange;
                range = 150;
                speed = 30;
            }
            else if (data.type === "platform") {
                weapon = this.createWeapon("knife")
                actions = actionsplatform;
                range = 2;
                speed = 50;

            }
            else if(data.type === "boss"){
                weapon = this.createWeapon("weak_laserGun")
                actions = actionsrange;
                speed = 50;
                range = 150;
            }
            let enemyOptions = {
                defaultMode: data.mode,
                patrolRoute: data.route,            // This only matters if they're a patroller
                guardPosition: data.guardPosition,  // This only matters if the're a guard
                health: data.health,
                player: this.player,
                weapon: weapon,
                actions: actions,
                goal: finalproject_Statuses.REACHED_GOAL,
                status: statusArray,
                inRange: range,
                speed: speed
            }

            this.enemies[i].addAI(EnemyAI, enemyOptions);
        }
/*
        this.enemy = this.add.animatedSprite("boss", "primary");
        this.enemy.scale.set(1, 1);
        let enemyPosition=new Vec2(1216 ,384);
        this.enemy.position.copy(enemyPosition);
        this.enemy.addPhysics(new AABB(Vec2.ZERO, new Vec2(32, 32)));
        this.enemy.colliderOffset.set(0, 2);
        this.enemy.animation.play("IDLE",true);
*/
    }

    powerset(array: Array<string>): Array<Array<string>> {
        return array.reduce((a, v) => a.concat(a.map((r) => [v].concat(r))), [[]]);
    }

    /**
     * This function takes all possible actions and all possible statuses, and generates a list of all possible combinations and statuses
     * and the actions that are taken when run through the GoapActionPlanner.
     */
    generateGoapPlans(actions: Array<GoapAction>, statuses: Array<string>, goal: string): string {
        let planner = new GoapActionPlanner();
        // Get all possible status combinations
        let statusComboinations = this.powerset(statuses);
        //console.log("statuses: ",statuses);
        let map = new Map<String>();
        //console.log(statusComboinations.toString());

        for (let s of statusComboinations) {
            // Get plan
            console.log("s: ",s,"\ngoal: ",goal,"\nactions: ",actions);
            console.log("mark0");
            let plan = planner.plan(goal, actions, s, null);
            console.log("mark1");
            let givenStatuses = "Given: ";
            s.forEach(v => givenStatuses = givenStatuses + v + ", ");

            map.add(givenStatuses, plan.toString())
        }
        
        return map.toString();
    }

 



    /**
     * Initializes the level end area
     */
    protected addLevelEnd(startingTile: Vec2, size: Vec2): void {
        this.levelEndArea = <Rect>this.add.graphic(GraphicType.RECT, "primary", {position: startingTile.scale(32), size: size.scale(32)});
        this.levelEndArea.addPhysics(undefined, undefined, false, true);
        this.levelEndArea.setTrigger("player", finalproject_Events.PLAYER_ENTERED_LEVEL_END, null);
        this.levelEndArea.color = new Color(0, 0, 0, 0);
    }


    /**
     * Increments the amount of life the player has
     * @param amt The amount to add to the player life
     */
    protected incPlayerLife(amt: number): void {
        //taking damage
        if (GameLevel.livesCount > 0){
            GameLevel.livesCount += amt;
            if(GameLevel.livesCount<0){
                GameLevel.livesCount=0;
            }
            this.livesCountLabel.text = "Lives: " + GameLevel.livesCount;
            if(GameLevel.livesCount<=0){
                Input.disableInput();
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "player_death", loop: false, holdReference: false});
                this.emitter.fireEvent(finalproject_Events.PLAYER_KILLED);
                this.isDead=true;
                this.player.disablePhysics();
               
            }
        }else{
            Input.disableInput();
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "player_death", loop: false, holdReference: false});
            this.emitter.fireEvent(finalproject_Events.PLAYER_KILLED);
            this.isDead=true;
            this.player.disablePhysics();
        }
       
    }

    /**
     * Increments the amount of gear the player has by 1
     */
    protected incGearCount(amt: number): void {
        GameLevel.gearCount += amt;
        this.gearCountLabel.text = "Gears: " + GameLevel.gearCount;
    }
    

    /**
     * Returns the player to spawn
     */
    protected respawnPlayer(): void {
        let sceneOptions = {
            physics: {
                groupNames: ["ground", "player"],
                collisions:
                [
                    [0, 1],
                    [1, 0],
                ]
            }
        }
        GameLevel.gearCount=0;
        GameLevel.livesCount=20;
        //this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        this.sceneManager.changeToScene(this.currentLevel, {
            isInvincible: this.isInvincible,
            levelCount: this.levelCount
        }, sceneOptions);
        Input.enableInput();
        this.system.stopSystem();
    }

    spawnItems(): void {
        // Get the item data
        let itemData = this.load.getObject("itemData");

        for(let item of itemData.items){
            if(item.type === "healthpack"){
                // Create a healthpack
                this.createHealthpack(new Vec2(item.position[0], item.position[1]));
            }
            else if(item.type === "gear"){
                this.createGear(new Vec2(item.position[0], item.position[1]));
            } else {
                let weapon = this.createWeapon(item.weaponType);
                weapon.moveSprite(new Vec2(item.position[0], item.position[1]));
                this.items.push(weapon);
            }
        }        
    }

    /**
     * 
     * Creates and returns a new weapon
     * @param type The weaponType of the weapon, as a string
     */
    createWeapon(type: string): Weapon {
        let weaponType = <WeaponType>RegistryManager.getRegistry("weaponTypes").get(type);

        let sprite = this.add.sprite(weaponType.spriteKey, "primary");

        return new Weapon(sprite, weaponType, this.battleManager);
    }

    /**
     * Drop a weapon at a certain position in the world
     * @param type The weaponType of the weapon, as a string
     * @param position 
     */
         dropWeapon(type: string, position: Vec2){
            let weaponType = <WeaponType>RegistryManager.getRegistry("weaponTypes").get(type);
            let sprite = this.add.sprite(weaponType.spriteKey, "primary");
            let weapon = new Weapon(sprite, weaponType, this.battleManager);
            weapon.moveSprite(position);
            this.items.push(weapon);
    }

    /**
     * Creates a healthpack at a certain position in the world
     * @param position 
     */
    createHealthpack(position: Vec2): void {
        let sprite = this.add.sprite("healthpack", "primary");
        let healthpack = new Healthpack(sprite)
        healthpack.moveSprite(position);
        this.items.push(healthpack);
    }

    /**
     * Creates a gear at a certain position in the world
     * @param position 
     */
    createGear(position: Vec2): void {
        let sprite = this.add.sprite("gear", "primary");
        let gear = new Gear(sprite);
        gear.moveSprite(position);
        this.items.push(gear);
    }

    /**
     * Initalizes all weapon types based of data from weaponData.json
     */
    initWeapons(): void{
        console.log("initWeapons");

        let weaponData = this.load.getObject("weaponData");

        for(let i = 0; i < weaponData.numWeapons; i++){
            let weapon = weaponData.weapons[i];

            // Get the constructor of the prototype
            let constr = RegistryManager.getRegistry("weaponTemplates").get(weapon.weaponType);

            // Create a weapon type
            let weaponType = new constr();

            // Initialize the weapon type
            weaponType.initialize(weapon);

            // Register the weapon type
            RegistryManager.getRegistry("weaponTypes").registerItem(weapon.name, weaponType)
        }
    }
    handleScreenDespawn(node: CanvasNode, viewportCenter: Vec2, ViewportSize: Vec2): void {
		// Your code goes here:

        if (((node.position.x<=(viewportCenter.x-ViewportSize.x))||(node.position.x>=(viewportCenter.x+ViewportSize.x)))&&node.visible==true)
		{   
            //node.destroy(); 
            this.bullets.forEach((element,index)=>{
                if(element.id==node.id) this.bullets.splice(index,1);
             });
             this.enemy_bullets.forEach((element,index)=>{
                if(element.id==node.id) this.enemy_bullets.splice(index,1);
             });
            this.emitter.fireEvent(finalproject_Events.UNLOAD_ASSET,{"node":node.id});

        }


	}
    isPaused():boolean {
        return this.ispaused;
    }

    handleCollisions(){	
		// Check for collisions of bullets with enemy
		for(let bullet of this.bullets){
                for(let enemy of this.enemies)
                {
                    if(bullet.boundary.overlaps(enemy.boundary)){
                        // A collision happened - destroy the bullet
                        console.log("bullet hit");
                        (<EnemyAI>enemy.ai).damage(1);
                        this.bullets.forEach((element,index)=>{
                            if(element.id==bullet.id) this.bullets.splice(index,1);
                         });
                        this.emitter.fireEvent(finalproject_Events.UNLOAD_ASSET,{"node":bullet.id})
                        // Increase the hp of the enemy
                    }
				}				
            }   
        for(let bullet of this.enemy_bullets){
                
            if(bullet.boundary.overlaps(this.player.boundary)){
                // A collision happened - destroy the bullet
                console.log("bullet hit");
                this.emitter.fireEvent(finalproject_Events.PLAYER_DAMAGE,{"damage":2});
                this.enemy_bullets.forEach((element,index)=>{
                    if(element.id==bullet.id) this.enemy_bullets.splice(index,1);
                });
                this.emitter.fireEvent(finalproject_Events.UNLOAD_ASSET,{"node":bullet.id})
                // Increase the hp of the enemy
            }   
        }   
        
      		
    }   
    
}
