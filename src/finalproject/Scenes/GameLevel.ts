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
import In_Game_Menu from "./InGameMenu";
import Layer from "../../Wolfie2D/Scene/Layer";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import InventoryManager from "../GameSystems/InventoryManager";
import Item from "../GameSystems/items/Item";
import WeaponType from "../GameSystems/items/WeaponTypes/WeaponType";
import Weapon from "../GameSystems/items/Weapon";
import RegistryManager from "../../Wolfie2D/Registry/RegistryManager";
import Healthpack from "../GameSystems/items/Healthpack";
import BattleManager from "../GameSystems/BattleManager";

// HOMEWORK 5 - TODO
/**
 * Add in some level music.
 * 
 * This can be done here in the base GameLevel class, or in Level1 and Level2,
 * it's up to you.
 */
export default class GameLevel extends Scene {
    // Every level will have a player, which will be an animated sprite
    protected playerSpawn: Vec2;
    protected player: AnimatedSprite;
    protected respawnTimer: Timer;

    protected ui_layer: Layer;
    protected game: Layer;

    // Labels for the UI
    protected static livesCount: number = 3;
    protected livesCountLabel: Label;

    // Stuff to end the level and go to the next level
    protected levelEndArea: Rect;
    protected nextLevel: new (...args: any) => GameLevel;
    protected levelEndTimer: Timer;
    protected levelEndLabel: Label;
    
    // Screen fade in/out for level start and end
    protected levelTransitionTimer: Timer;
    protected levelTransitionScreen: Rect;
    
    // Custom particle sysyem
    protected system: HW5_ParticleSystem;

    //Cooldown timer for ultimate skill
    protected ultimateCooldown: Timer;


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
        //this.balloonsPopped = 0;
        //this.switchesPressed = 0;
        this.initWeapons();
        // Do the game level standard initializations
        this.initLayers();
        this.initViewport();
        /////////////////////////////////////////////////

        this.subscribeToEvents();
        /////////////////////////////////////////////////
        this.addUI();

        this.battleManager = new BattleManager();
        
        this.items = new Array();
        this.spawnItems();
        this.initPlayer();
        // 10 second cooldown for ultimate
        this.ultimateCooldown = new Timer(2000);

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
                this.sceneManager.changeToScene(In_Game_Menu, {});
            }
            if(event.type === "back_to_scene"){
                this.game.enable();
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
                case finalproject_Events.PLAYER_HIT_WEAPON:
                    {
                        //
                    }
                    break;
                case finalproject_Events.PLAYER_HIT_TRAP:
                    {
                        //
                    }
                    break;
                case finalproject_Events.PLAYER_WEAPON_CHANGE:
                    {
                        console.log(event.data.get("weapon"));
                        if(event.data.get("weapon")=="pistol"){
                            this.player = this.add.animatedSprite("player_with_pistol", "primary");
                        }
                        else if(event.data.get("weapon")=="machineGun"){
                            this.player = this.add.animatedSprite("player_with_machinegun", "primary");
                        }
                        else if(event.data.get("weapon")=="lightSaber"){
                            this.player = this.add.animatedSprite("player_with_lightsaber", "primary");
                        }
                        else if(event.data.get("weapon")=="laserGun"){
                            this.player = this.add.animatedSprite("player_with_lasergun", "primary");
                        }
                        else if(event.data.get("weapon")=="knife"){
                            this.player = this.add.animatedSprite("player_with_knife", "primary");
                        }
                        else{
                            this.player = this.add.animatedSprite("player", "primary");
                        }
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
        if(Input.isKeyJustPressed("escape")){
            this.emitter.fireEvent("ingame_menu");
        }
    }

    /**
     * Initialzes the layers
     */
    protected initLayers(): void {
        // Add a layer for UI
        this.ui_layer=this.addUILayer("UI");
        this.game=this.addLayer("primary", 1);
        // Add a layer for players and enemies
        


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
        this.receiver.subscribe("back_to_scene");
        this.receiver.subscribe("healthpack");
        
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
        let inventory = new InventoryManager(this, 2, "inventorySlot", new Vec2(32, 32), 4, "slots1", "items1");
        let startingWeapon = this.createWeapon("pistol");
        inventory.addItem(startingWeapon);
        
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
            inventory: inventory,
            items: this.items,
            });

        this.player.setGroup("player");

        this.viewport.follow(this.player);
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

    // HOMEWORK 5 - TODO
    /*
        Make sure balloons are being set up properly to have triggers so that when they collide
        with players, they send out a trigger event.

        Look at the levelEndArea trigger for reference.
    */
    /**
     * Adds an balloon into the game
     * @param spriteKey The key of the balloon sprite
     * @param tilePos The tilemap position to add the balloon to
     * @param aiOptions The options for the balloon AI
     */

    /*
    protected addBalloon(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): void {
        let balloon = this.add.animatedSprite(spriteKey, "primary");
        balloon.position.set(tilePos.x*32, tilePos.y*32);
        balloon.scale.set(2, 2);
        balloon.addPhysics();
        balloon.addAI(BalloonController, aiOptions);
        balloon.setGroup("balloon");
        balloon.setTrigger("player", HW5_Events.PLAYER_HIT_BALLOON, null);
    }*/

    // HOMEWORK 5 - TODO
    /**
     * You must implement this method.
     * There are 3 types of collisions:
     * 
     * 1) Collisions with red balloons
     * 
     * 2) Collisions with blue balloons
     * 
     * 3) Collisions with green balloons
     *  
     * When the player collides with a balloon, you should check the suit color and the balloon color, 
     * and if they are not the same, damage the player. Otherwise the player is unharmed.
     * 
     * In either case you'll also need to pop the balloon and set up elements for the particle system, 
     * specifically changing the particle system color to the color of the balloon being popped. You'll also
     * have to use the balloon popping sound you've created and play it here as well.
     * 
     * Note that node destruction is handled for you.
     * 
     * For those who are curious, there is actually a node.destroy() method.
     * You no longer have to make the nodes invisible and pretend they don't exist.
     * You don't have to use this yourself, but you can see examples
     * of it in this class.
     * 
     */
    /*
    protected handlePlayerBalloonCollision(player: AnimatedSprite, balloon: AnimatedSprite) {
        if(typeof balloon !== "undefined"){
            if ((<PlayerController>player._ai).suitColor != (<BalloonController>balloon._ai).color){
                GameLevel.livesCount--;
                if (GameLevel.livesCount == 0){
                    Input.disableInput();
                    this.player.disablePhysics();
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "player_death", loop: false, holdReference: false});
                    this.player.tweens.play("death");
                }
                this.livesCountLabel.text = "Lives: " + GameLevel.livesCount;
            }
            if((<BalloonController>balloon._ai).color==HW5_Color.RED){
                this.system.changeColor(Color.RED);
            }
            else if((<BalloonController>balloon._ai).color==HW5_Color.BLUE){
                this.system.changeColor(Color.BLUE);
            }
            else if((<BalloonController>balloon._ai).color==HW5_Color.GREEN){
                this.system.changeColor(Color.GREEN);
            }
            
            this.emitter.fireEvent(HW5_Events.BALLOON_POPPED, {owner: balloon.id});
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "pop", loop: false, holdReference: false});
        }
    }
    */
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

    
}
