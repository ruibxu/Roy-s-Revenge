import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import GameLevel from "./GameLevel";
import Level2 from "./Level2";

export default class Level6 extends GameLevel {
    loadScene(): void {
        // Load resources
        this.load.tilemap("level6", "final_project_assets/tilemaps/level6.tmj");
        this.load.spritesheet("player", "final_project_assets/spritesheets/roy.json");
        this.load.spritesheet("boss", "final_project_assets/spritesheets/boss.json");
        this.load.spritesheet("slice", "final_project_assets/spritesheets/slice.json");
        this.load.spritesheet("melee_enemy","final_project_assets/spritesheets/melee_enemy.json");
        this.load.spritesheet("melee_enemy_air","final_project_assets/spritesheets/melee_enemy_air.json");
        this.load.spritesheet("ranged_enemy","final_project_assets/spritesheets/ranged_enemy.json");
        this.load.spritesheet("ranged_enemy_air","final_project_assets/spritesheets/ranged_enemy_air.json");

        //Load audio
        this.load.audio("jump", "final_project_assets/sounds/jump.wav");
        this.load.audio("switch", "final_project_assets/sounds/switch.wav");
        this.load.audio("fire","final_project_assets/sounds/fire.wav")
        this.load.audio("player_death", "final_project_assets/sounds/death.wav");
        this.load.audio("lasergun", "final_project_assets/sounds/lasergun.wav");
        this.load.audio("slice", "final_project_assets/sounds/slice.wav");
        this.load.audio("skill", "final_project_assets/sounds/skill.wav");
        this.load.audio("level_music", "final_project_assets/music/level6.mp3");

        // Load the scene info
        //Load the weapon data
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

    unloadScene(){
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
    }

    startScene(): void {
        this.levelnumber=6;
        // Add the level 1 tilemap
        this.add.tilemap("level6", new Vec2(1, 1));
        //this.viewport.setBounds(0, 0, 64*32, 32*32);
        this.viewport.setBounds(0, 0, 128*32, 32*32);

        this.playerSpawn = new Vec2(3*32-16, 22*32+16);

        // Do generic setup for a GameLevel
        this.currentLevel = Level6;
        
        super.startScene();
        this.addLevelEnd(new Vec2(123, 22), new Vec2(5, 5));
        
        //Play level music
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}