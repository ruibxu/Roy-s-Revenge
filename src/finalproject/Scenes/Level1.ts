import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import GameLevel from "./GameLevel";
import Level2 from "./Level2";

export default class Level1 extends GameLevel {
    
    // HOMEWORK 5 - TODO
    /**
     * Add your balloon pop sound here and use it throughout the code
     */
    loadScene(): void {
        // Load resources
        this.load.tilemap("level1", "final_project_assets/tilemaps/level2.tmj");
        this.load.spritesheet("player", "final_project_assets/spritesheets/roy.json");
        this.load.spritesheet("boss", "final_project_assets/spritesheets/boss.json");
        this.load.spritesheet("slice", "final_project_assets/spritesheets/slice.json");
        this.load.spritesheet("melee_enemy","final_project_assets/spritesheets/melee_enemy.json");
        //this.load.spritesheet("red", "final_project_assets/spritesheets/redBalloon.json");
        //this.load.spritesheet("blue", "final_project_assets/spritesheets/blueBalloon.json");
        //this.load.audio("jump", "final_project_assets/sounds/jump.wav");
        //this.load.audio("switch", "final_project_assets/sounds/switch.wav");
        //this.load.audio("player_death", "final_project_assets/sounds/player_death.wav");
        //this.load.audio("pop", "final_project_assets/sounds/pop.wav");
        // HOMEWORK 5 - TODO
        // You'll want to change this to your level music
        //this.load.audio("level_music", "final_project_assets/music/levelmusic.mp3");
        // Load the scene info
        


        
        this.load.object("weaponData", "final_project_assets/data/weaponData.json");

        // Load the nav mesh
        this.load.object("navmesh", "final_project_assets/data/navmesh.json");

        // Load in the enemy info
        this.load.object("enemyData", "final_project_assets/data/enemy.json");

        // Load in item info
        this.load.object("itemData", "final_project_assets/data/items1.json");

        // Load the healthpack sprite
        this.load.image("healthpack", "final_project_assets/sprites/health.png");
        this.load.image("gear", "final_project_assets/sprites/gear.png");
        this.load.image("inventorySlot", "final_project_assets/sprites/inventory.png");
        //weapon
        this.load.image("knife", "final_project_assets/sprites/knife.png");
        this.load.image("laserGun", "final_project_assets/sprites/laser_gun.png");
        this.load.image("pistol", "final_project_assets/sprites/pistol.png");
        this.load.image("machineGun","final_project_assets/sprites/machine_gun.png")
        this.load.image("lightSaber", "final_project_assets/sprites/light_saber.png");
        
    }

    // HOMEWORK 5 - TODO
    /**
     * Decide which resource to keep and which to cull.
     * 
     * Check out the resource manager class.
     * 
     * Figure out how to save resources from being unloaded, and save the ones that are needed
     * for level 2.
     * 
     * This will let us cut down on load time for the game (although there is admittedly
     * not a lot of load time for such a small project).
     */
    unloadScene(){
        // Keep resources - this is up to you

        //this.resourceManager.keepAudio("switch");
        //this.resourceManager.keepAudio("player_death");
        //this.resourceManager.keepAudio("pop");
        //this.resourceManager.keepAudio("level_music");
        //this.resourceManager.keepSpritesheet("blue");
        //this.resourceManager.keepSpritesheet("red");
        //this.resourceManager.keepSpritesheet("player");
    }

    startScene(): void {
        // Add the level 1 tilemap
        this.add.tilemap("level1", new Vec2(1, 1));
        //this.viewport.setBounds(0, 0, 64*32, 32*32);
        this.viewport.setBounds(0, 0, 128*32, 16*32);

        this.playerSpawn = new Vec2(4*32-16, 11*32+16);

        // Set the total switches and balloons in the level

        this.currentLevel = Level1;
        this.nextLevel = Level2;
        
        // Do generic setup for a GameLevel
        super.startScene();
        this.addLevelEnd(new Vec2(124, 10), new Vec2(5, 5));
        


        // Add balloons of various types, just red and blue for the first level
        /* for(let pos of [new Vec2(18, 8), new Vec2(25, 3), new Vec2(52, 5)]){
            this.addBalloon("red", pos, {color: HW5_Color.RED});
        }

        for(let pos of [new Vec2(20, 3), new Vec2(41,4), new Vec2(3, 4)]){
            this.addBalloon("blue", pos, {color: HW5_Color.BLUE});
        }

        */
        //this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}