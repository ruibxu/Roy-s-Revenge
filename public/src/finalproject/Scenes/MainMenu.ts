import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Level1 from "./Level1";
import Controls from "./Controls";
import Help from "./Help";
import Layer from "../../Wolfie2D/Scene/Layer";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Input from "../../Wolfie2D/Input/Input";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Level2 from "./Level2";
import GameLevel from "./GameLevel";
import Level3 from "./Level3";
import Level4 from "./Level4";

export default class MainMenu extends Scene {

    animatedSprite: AnimatedSprite;
    logo: Sprite;
    private splash: Layer;
    private mainMenu: Layer;
    private level: Layer;
    private background: Layer;
    private help: Layer;
    private in_game_menu: Layer;
    private playBtn: Button;
    private levelBtn: Button;
    private CtrlBtn: Button;
    private helpBtn: Button;
    private levelCount: number =0;

    


    loadScene(): void {
        // Load the menu song
        this.load.audio("menu", "final_project_assets/music/menu.mp3");
        this.load.image("logo", "final_project_assets/images/banner.png");
        this.load.image("back", "final_project_assets/images/background.png");
        this.load.image("level1", "final_project_assets/images/level1.png");
    }

    startScene(): void {
        // Center the viewport
        let size = this.viewport.getHalfSize();
        let center = this.viewport.getCenter();


        this.mainMenu =this.addUILayer("Main");
        this.background=this.addUILayer("Back");
        this.background.setDepth(40);
        //this.mainMenu.setHidden(true);



        this.viewport.setFocus(size);

        this.viewport.setZoomLevel(1);

        this.logo = this.add.sprite("logo", "Main");
        let back = this.add.sprite("back", "Back");
        back.position.set(size.x, size.y);
        this.logo.position.set(size.x, size.y-250);
        this.logo.scale.set(1.5,1.5);
        // Create a play button
        this.playBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y-50), text: "Start New Game"});
        this.levelBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y+50), text: "Level Selection"});
        this.CtrlBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y+150), text: "Controls"});
        this.helpBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y+250), text: "Help"});


        this.playBtn.backgroundColor = new Color(99,202,253);
        this.playBtn.borderColor = Color.BLACK;
        this.playBtn.borderRadius = 10;
        this.playBtn.setPadding(new Vec2(50, 10));
        this.playBtn.font = "PixelSimple";
        this.playBtn.size.set(400, 50);
        this.playBtn.textColor = Color.BLACK;

        

        this.levelBtn.backgroundColor = new Color(99,202,253);
        this.levelBtn.borderColor = Color.BLACK;
        this.levelBtn.borderRadius = 10;
        this.levelBtn.setPadding(new Vec2(50, 10));
        this.levelBtn.font = "PixelSimple";
        this.levelBtn.size.set(400, 50);
        this.levelBtn.textColor = Color.BLACK;


        this.CtrlBtn.backgroundColor = new Color(99,202,253);
        this.CtrlBtn.borderColor = Color.BLACK;
        this.CtrlBtn.borderRadius = 10;
        this.CtrlBtn.size.set(400, 50);
        this.CtrlBtn.setPadding(new Vec2(50, 10));
        this.CtrlBtn.font = "PixelSimple";
        this.CtrlBtn.textColor = Color.BLACK;


        this.helpBtn.backgroundColor = new Color(99,202,253);
        this.helpBtn.borderColor = Color.BLACK;
        this.helpBtn.borderRadius = 10;
        this.helpBtn.setPadding(new Vec2(50, 10));
        this.helpBtn.size.set(400, 50);
        this.helpBtn.font = "PixelSimple";
        this.helpBtn.textColor = Color.BLACK;


        this.playBtn.onClickEventId = "level1";
        this.levelBtn.onClickEventId = "level";
        this.CtrlBtn.onClickEventId = "controls";
        this.helpBtn.onClickEventId = "help";
        


        //event subscribtion
        this.receiver.subscribe("level1");
        this.receiver.subscribe("level2");
        this.receiver.subscribe("level3");
        this.receiver.subscribe("level4");
        this.receiver.subscribe("level5");
        this.receiver.subscribe("level6");
        this.receiver.subscribe("level");
        this.receiver.subscribe("controls");
        this.receiver.subscribe("help");
        this.receiver.subscribe("menu");
        this.receiver.subscribe("levelpassed");

        //level selection layer
        this.level= this.addUILayer("level");
        this.level.setHidden(true);
        const levelHeader = <Label>this.add.uiElement(UIElementType.LABEL, "level", {position: new Vec2(center.x, center.y - 300), text: "Level Seletion"});
        const level1 = <Button>this.add.uiElement(UIElementType.BUTTON, "level", {position: new Vec2(center.x-400, center.y), text: "Level 1"});
        const level2 = <Button>this.add.uiElement(UIElementType.BUTTON, "level", {position: new Vec2(center.x, center.y ), text: "Level 2"});
        const level3 = <Button>this.add.uiElement(UIElementType.BUTTON, "level", {position: new Vec2(center.x+400, center.y), text: "Level 3"});
        const level4 = <Button>this.add.uiElement(UIElementType.BUTTON, "level", {position: new Vec2(center.x-400, center.y +300), text: "Level 4"});
        const level5 = <Button>this.add.uiElement(UIElementType.BUTTON, "level", {position: new Vec2(center.x, center.y +300), text: "Level 5"});
        const level6 = <Button>this.add.uiElement(UIElementType.BUTTON, "level", {position: new Vec2(center.x+400, center.y +300), text: "Level 6"});

        let level1pic=this.add.sprite("level1","level");
        level1pic.position.set(center.x-400, center.y-130);
        level1pic.scale.set(0.2,0.2);

        let level2pic=this.add.sprite("level1","level");
        level2pic.position.set(center.x, center.y-130);
        level2pic.scale.set(0.2,0.2);

        let level3pic=this.add.sprite("level1","level");
        level3pic.position.set(center.x+400, center.y-130);
        level3pic.scale.set(0.2,0.2);

        let level4pic=this.add.sprite("level1","level");
        level4pic.position.set(center.x-400, center.y+170);
        level4pic.scale.set(0.2,0.2);

        let level5pic=this.add.sprite("level1","level");
        level5pic.position.set(center.x, center.y+170);
        level5pic.scale.set(0.2,0.2);

        let level6pic=this.add.sprite("level1","level");
        level6pic.position.set(center.x+400, center.y+170);
        level6pic.scale.set(0.2,0.2);


        levelHeader.fontSize = 70;
        levelHeader.textColor=Color.WHITE;

        const levelBack = <Button>this.add.uiElement(UIElementType.BUTTON, "level", {position: new Vec2(center.x-450, center.y - 300), text: "Back"});
        levelBack.size.set(200, 50);
        levelBack.borderWidth = 2;
        levelBack.borderColor = Color.BLACK;
        levelBack.textColor = Color.BLACK;
        levelBack.backgroundColor = new Color(142,142,142);
        levelBack.onClickEventId = "menu";

        level1.backgroundColor = new Color(99,202,253);
        level1.borderColor = Color.BLACK;
        level1.borderRadius = 10;
        level1.setPadding(new Vec2(50, 10));
        level1.font = "PixelSimple";
        level1.textColor = Color.BLACK;
        level1.onClickEventId="level1";

        level2.backgroundColor = new Color(99,202,253);
        level2.borderColor = Color.BLACK;
        level2.borderRadius = 10;
        level2.setPadding(new Vec2(50, 10));
        level2.font = "PixelSimple";
        level2.textColor = Color.BLACK;
        level2.onClickEventId="level2";
        /*if(this.levelCount >=1){
            level2.onClickEventId="level2";
        }*/
        

        level3.backgroundColor = new Color(99,202,253);
        level3.borderColor = Color.BLACK;
        level3.borderRadius = 10;
        level3.setPadding(new Vec2(50, 10));
        level3.font = "PixelSimple";
        level3.textColor = Color.BLACK;
        level3.onClickEventId="level3";

        level4.backgroundColor = new Color(99,202,253);
        level4.borderColor = Color.BLACK;
        level4.borderRadius = 10;
        level4.setPadding(new Vec2(50, 10));
        level4.font = "PixelSimple";
        level4.textColor = Color.BLACK;
        level4.onClickEventId="level4";

        level5.backgroundColor = new Color(99,202,253);
        level5.borderColor = Color.BLACK;
        level5.borderRadius = 10;
        level5.setPadding(new Vec2(50, 10));
        level5.font = "PixelSimple";
        level5.textColor = Color.BLACK;
        level5.onClickEventId="level5";

        level6.backgroundColor = new Color(99,202,253);
        level6.borderColor = Color.BLACK;
        level6.borderRadius = 10;
        level6.setPadding(new Vec2(50, 10));
        level6.font = "PixelSimple";
        level6.textColor = Color.BLACK;
        level6.onClickEventId="level6";
        



        // Scene has started, so start playing music
        //this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "menu", loop: true, holdReference: true});
    }


    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            if(event.type === "level1"){
                /*
                    Init the next scene with physics collisions:

                            ground  player  balloon 
                    ground    No      --      -- 
                    player    Yes      No      --  
                    balloon   Yes      No      No  

                    Each layer becomes a number. In this case, 4 bits matter for each

                    ground:  self - 000, collisions - 011
                    player:  self - 001, collisions - 100
                    balloon: self - 010, collisions - 000
                */

                let sceneOptions = {
                    physics: {
                        groupNames: ["ground", "player"],
                        collisions:
                        [
                            [0, 1 ],
                            [1, 0 ] ,
                        ]
                    }
                }
                this.sceneManager.changeToScene(Level1, {}, sceneOptions);
            }
            if(event.type === "level2"){
                let sceneOptions = {
                    physics: {
                        groupNames: ["ground", "player"],
                        collisions:
                        [
                            [0, 1 ],
                            [1, 0 ] ,
                        ]
                    }
                }
                this.sceneManager.changeToScene(Level2, {}, sceneOptions);
            }
            if(event.type === "level3"){
                let sceneOptions = {
                    physics: {
                        groupNames: ["ground", "player"],
                        collisions:
                        [
                            [0, 1 ],
                            [1, 0 ] ,
                        ]
                    }
                }
                this.sceneManager.changeToScene(Level3, {}, sceneOptions);
            }
            if(event.type === "level4"){

                let sceneOptions = {
                    physics: {
                        groupNames: ["ground", "player"],
                        collisions:
                        [
                            [0, 1 ],
                            [1, 0 ] ,
                        ]
                    }
                }
                this.sceneManager.changeToScene(Level4, {}, sceneOptions);
            }
            /*if(event.type === "level5"){


                let sceneOptions = {
                    physics: {
                        groupNames: ["ground", "player"],
                        collisions:
                        [
                            [0, 1 ],
                            [1, 0 ] ,
                        ]
                    }
                }
                this.sceneManager.changeToScene(Level5, {}, sceneOptions);
            }
            if(event.type === "level6"){

                let sceneOptions = {
                    physics: {
                        groupNames: ["ground", "player"],
                        collisions:
                        [
                            [0, 1 ],
                            [1, 0 ] ,
                        ]
                    }
                }
                this.sceneManager.changeToScene(Leve6, {}, sceneOptions);
            }
            */
            if(event.type === "levelpassed"){
                if(event.data.get("level")==Level1&&this.levelCount<1){
                    this.levelCount+=1;
                }
                else if(event.data.get("level")==Level2&&this.levelCount<2){
                    this.levelCount+=1;
                }
                else if(event.data.get("level")==Level3&&this.levelCount<3){
                    this.levelCount+=1;
                }
                else if(event.data.get("level")==Level4&&this.levelCount<4){
                    this.levelCount+=1;
                }
                /*else if(event.data.get("level")==Level5&&this.levelCount<5){
                    this.levelCount+=1;
                }
                else if(event.data.get("level")==Level6&&this.levelCount<6){
                    this.levelCount+=1;
                }*/
                
            }
            if(event.type === "level"){
                this.level.setHidden(false);
                this.mainMenu.setHidden(true);
                this.background.setHidden(true);
            }
            if(event.type === "menu"){
                this.mainMenu.setHidden(false);
                this.level.setHidden(true);
                this.background.setHidden(false);
            }
            if(event.type === "controls"){
                this.sceneManager.changeToScene(Controls, {});
                
            }
            if(event.type === "help"){
                this.sceneManager.changeToScene(Help, {});
                
            }

        }
        /*
        if(Input.isMouseJustPressed()&& this.splash.isHidden()==false){
            this.splash.setHidden(true);
            this.mainMenu.setHidden(false);
        }
        if(this.mainMenu.isHidden()==false){

        }*/
    }
    unloadScene(): void {
        // The scene is being destroyed, so we can stop playing the song
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "menu"});
    }
}

