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
import { finalproject_Events } from "../finalproject_constants";
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



// HOMEWORK 5 - TODO
/**
 * Add in some level music.
 * 
 * This can be done here in the base GameLevel class, or in Level1 and Level2,
 * it's up to you.
 */
export default class GameLevel extends Scene {
    protected enemy: AnimatedSprite;
    // Every level will have a player, which will be an animated sprite
    protected playerSpawn: Vec2;
    protected player: AnimatedSprite;
    protected respawnTimer: Timer;


    protected ui_layer: Layer;
    protected game: Layer;
    protected ingamemenu: Layer;
    protected controls: Layer;
    protected help: Layer;

    protected inventory: InventoryManager;

    protected ispaused: boolean;

    // Labels for the UI
    protected static livesCount: number = 3;
    protected livesCountLabel: Label;

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



    // A list of items in the scene
    private items: Array<Item>;

    // The battle manager for the scene
    private battleManager: BattleManager;



    // Total ballons and amount currently popped
    //protected totalBalloons: number;
    //protected balloonLabel: Label;
    //protected balloonsPopped: number;

    // Total switches and amount currently pressed
    //protected totalSwitches: number;
    //protected switchLabel: Label;
    //protected switchesPressed: number;

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
        this.initEnemies();


        this.ispaused=false;
        // 10 second cooldown for ultimate

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
        this.levelEndTimer = new Timer(3000, () => {
            // After the level end timer ends, fade to black and then go to the next scene
            this.levelTransitionScreen.tweens.play("fadeIn");
        });



        // Start the black screen fade out
        

        // Initially disable player movement
        Input.disableInput();
        //this.emitter.fireEvent(HW5_Events.SUIT_COLOR_CHANGE, {color: HW5_Color.RED});
        */
    }


    updateScene(deltaT: number){
        // Handle events and update the UI if needed
    
        
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            
            if(event.type === "ingame_menu"){
                this.ui_layer.disable();
                this.game.disable();
                this.ingamemenu.enable();
                this.controls.disable();
                this.help.disable();
                this.viewport.setZoomLevel(1);
                this.viewport.setBounds(0, 0, 1200, 800);
                this.getLayer("slots").disable();
                this.getLayer("items").disable();
                this.ispaused=true;
                this.tilemaps.forEach(tilemap => {
                    tilemap.visible = false;
                    tilemap.getLayer().disable();
                });
                
                //
                //this.emitter.fireEvent("currentLevel",{level: this});
            }
            if(event.type === "back_to_game"){
                this.ui_layer.enable();
                this.game.enable();
                this.ingamemenu.disable();
                this.getLayer("slots").enable();
                this.getLayer("items").enable();
                this.viewport.setZoomLevel(2.25);
                this.viewport.setBounds(0, 0, 128*32, 16*32);
                this.ispaused=false;

                this.tilemaps.forEach(tilemap => {
                    tilemap.visible = true;
                    tilemap.getLayer().enable();
                });
                
                //this.emitter.fireEvent("currentLevel",{level: this});
            }


            if(event.type === "newgame"){
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
                this.sceneManager.changeToScene(this.currentLevel, {}, sceneOptions);
            }
            if(event.type === "menu"){
                this.sceneManager.changeToScene(MainMenu, {});
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
            switch(event.type){
                case finalproject_Events.PLAYER_HIT_SWITCH:
                    {
                        // Hit a switch block, so update the label and count
                        // this.switchesPressed++;
                        // this.switchLabel.text = "Switches Left: " + (this.totalSwitches - this.switchesPressed)
                        // this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "switch", loop: false, holdReference: false});
                    }
                    break;
                case finalproject_Events.PLAYER_HIT_TRAP:
                    {
                        //
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
                        // Go to the next level
                        if(this.nextLevel){
                            let sceneOptions = {
                                physics: {
                                    groupNames: ["ground", "player", "balloon"],
                                    collisions:
                                    [
                                        [0, 1, 1],
                                        [1, 0, 0],
                                        [1, 0, 0]
                                    ]
                                }
                            }
                            this.sceneManager.changeToScene(this.nextLevel, {}, sceneOptions);
                        }
                    }
                    break;
                case finalproject_Events.PLAYER_KILLED:
                    {
                        this.respawnPlayer();
                    }
                    break;
            }
        }

        /*
            if (Input.isKeyJustPressed("1")) {
                this.emitter.fireEvent(HW5_Events.SUIT_COLOR_CHANGE, {color: HW5_Color.RED});
                this.suitChangeTimer.start();
            }
            if (Input.isKeyJustPressed("2")) {
                this.emitter.fireEvent(HW5_Events.SUIT_COLOR_CHANGE, {color: HW5_Color.BLUE});
                this.suitChangeTimer.start();
            }
            
        */
        if(Input.isKeyJustPressed("escape" )&& this.ingamemenu.isHidden()==true){
            this.emitter.fireEvent("ingame_menu");
        }
        if(Input.isKeyJustPressed("escape" )&& this.ingamemenu.isHidden()==false){
            this.emitter.fireEvent("back_to_game");
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
        


        let size = this.viewport.getHalfSize();
        let center = this.viewport.getCenter();



        let resumeBtn= <Button>this.add.uiElement(UIElementType.BUTTON, "ingame", {position: new Vec2(size.x, size.y-150), text: "Resume Game"});
        let newGameBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "ingame", {position: new Vec2(size.x, size.y-50), text: "New Game"});
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
        controlsBack.backgroundColor = new Color(142,142,142);
        controlsBack.onClickEventId = "ingame_menu";

       

        const controlsHeader = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y - 300), text: "Controls"});

        controlsHeader.fontSize = 70;
        controlsHeader.textColor=Color.WHITE;
        const texta = "a to move left";
        const textb = "d to move right";
        const text="space and w to jump";
        const textc = "e to pick up weapons";
        const textd = "Q to cast the skill";
        const textd2 ="(which will decrease one HP and increase the attack speed for 5s)";
        const texte = "left click to attack";

        const linea = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y - 150), text: texta});
        const lineb = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y-100), text: textb});
        const line = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y-50), text: text});
        const linec = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y), text: textc});
        const lined = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y+50), text: textd});
        const lined2 = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y+100), text: textd2});
        const linee = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y+150), text: texte});

        linea.fontSize=40;
        lineb.fontSize=40;
        line.fontSize=40;
        linec.fontSize=40;
        lined.fontSize=40;
        lined2.fontSize=40;
        linee.fontSize=40;

        linea.textColor=Color.WHITE;
        lineb.textColor=Color.WHITE;
        line.textColor=Color.WHITE;
        linec.textColor=Color.WHITE;
        lined.textColor=Color.WHITE;
        lined2.textColor=Color.WHITE;
        linee.textColor=Color.WHITE;


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
        helpBack.backgroundColor = new Color(142,142,142);
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
        const cheata = "\"cheating\" : Unlock all the levels ";
        const cheatb = "\"invincible\" : Player will be invincible ";
        const cheat1 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y +100), text: cheata});
        const cheat2 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y +125), text: cheatb});

        cheat1.textColor=Color.WHITE;
        cheat2.textColor=Color.WHITE;
        cheat1.fontSize=18;
        cheat2.fontSize=18;



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
        this.receiver.subscribe([
            finalproject_Events.PLAYER_HIT_SWITCH,
            finalproject_Events.PLAYER_HIT_WEAPON,
            finalproject_Events.PLAYER_HIT_TRAP,
            finalproject_Events.PLAYER_ENTERED_LEVEL_END,
            finalproject_Events.LEVEL_START,
            finalproject_Events.LEVEL_PAUSED,
            finalproject_Events.LEVEL_END,
            finalproject_Events.PLAYER_KILLED,
            finalproject_Events.PLAYER_WEAPON_CHANGE

        ]);
        this.receiver.subscribe("ingame_menu");
        this.receiver.subscribe("back_to_game");
        this.receiver.subscribe("healthpack");

        this.receiver.subscribe("resume");
        this.receiver.subscribe("newgame");
        this.receiver.subscribe("control");
        this.receiver.subscribe("help");
        this.receiver.subscribe("menu");
        
    }

    /**
     * Adds in any necessary UI to the game
     */
    protected addUI(){
        // In-game labels
        /*    
        this.balloonLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(80, 30), text: "Balloons Left: " + (this.totalBalloons - this.balloonsPopped)});
        this.balloonLabel.textColor = Color.BLACK
        this.balloonLabel.font = "PixelSimple";

        this.switchLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(80, 50), text: "Switches Left: " + (this.totalSwitches - this.switchesPressed)});
        this.switchLabel.textColor = Color.BLACK;
        this.switchLabel.font = "PixelSimple";

        */

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
                    end: 300,
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
            tilemap: "Main",   
            inventory: this.inventory,
            items: this.items,
            });

        this.player.setGroup("player");

        this.viewport.follow(this.player);
    }


    protected initEnemies(): void {
        //add inventory
      
        
         // Add the player
        this.enemy = this.add.animatedSprite("enemy", "primary");
        this.enemy.scale.set(1, 1);
        if(!this.playerSpawn){
            console.warn("Player spawn was never set - setting spawn to (0, 0)");
            this.playerSpawn = Vec2.ZERO;
        }
        let enemyPosition=new Vec2(1216,384);
        this.enemy.position.copy(enemyPosition);
        this.enemy.addPhysics(new AABB(Vec2.ZERO, new Vec2(32, 32)));
        this.enemy.colliderOffset.set(0, 2);
        // this.player.addAI(PlayerController, 
        //     {playerType: "platformer", 
        //     tilemap: "Main",   
        //     inventory: inventory,
        //     items: this.items,
        //     });

        //this.player.setGroup("player");

        //this.viewport.follow(this.player);
    }

    handleCollision(){
        
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
        GameLevel.livesCount += amt;
        this.livesCountLabel.text = "Lives: " + GameLevel.livesCount;
        if (GameLevel.livesCount == 0){
            Input.disableInput();
            this.player.disablePhysics();
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "player_death", loop: false, holdReference: false});
            this.player.tweens.play("death");
        }
    }

    /**
     * Returns the player to spawn
     */
    protected respawnPlayer(): void {
        GameLevel.livesCount = 3;
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        this.sceneManager.changeToScene(MainMenu, {});
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
		{node.visible=false;}


	}
    isPaused():boolean {
        return this.ispaused;
    }
    
}
