import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Level1 from "./Level1";
import Layer from "../../Wolfie2D/Scene/Layer";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Input from "../../Wolfie2D/Input/Input";
import MainMenu from "./MainMenu";
import GameLevel from "./GameLevel";
import Controls from "./Controls";
import Help from "./Help";


export default class InGameMenu extends Scene {
    private in_game_menu: Layer;


    startScene(): void {
        // Center the viewport
        
        this.in_game_menu =this.addUILayer("ingame");


        let size = this.viewport.getHalfSize();
        let center = this.viewport.getCenter();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);


        //splashpages
        let resumeBtn= <Button>this.add.uiElement(UIElementType.BUTTON, "ingame", {position: new Vec2(size.x, size.y-150), text: "Resume Game"});
        let newGameBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "ingame", {position: new Vec2(size.x, size.y-50), text: "New Game"});
        let CtrlBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "ingame", {position: new Vec2(size.x, size.y+50), text: "Controls"});
        let helpBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "ingame", {position: new Vec2(size.x, size.y+150), text: "Help"});
        let mainMenuBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "ingame", {position: new Vec2(size.x, size.y+250), text: "Main Menu"});



        this.receiver.subscribe("resume");
        this.receiver.subscribe("newgame");
        this.receiver.subscribe("control");
        this.receiver.subscribe("help");
        this.receiver.subscribe("menu");



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


    
    }
    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            if(event.type === "newgame"){
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
                this.sceneManager.changeToScene(GameLevel, {},sceneOptions);
                //this.emitter.fireEvent("level1");
            }
            if(event.type === "menu"){
                this.sceneManager.changeToScene(MainMenu, {});
            }
            if(event.type === "resume"){
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
                this.sceneManager.changeToScene(GameLevel, {},sceneOptions);
                this.emitter.fireEvent("back_to_scene");
            }
            if(event.type === "control"){
                this.emitter.fireEvent("ingameMenu");
                this.sceneManager.changeToScene(Controls,{});
            }
            if(event.type === "help"){
                this.emitter.fireEvent("ingameMenu");
                this.sceneManager.changeToScene(Help,{});
                
            }
        }
        if(Input.isKeyJustPressed("escape")){
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
            this.sceneManager.changeToScene(GameLevel, {},sceneOptions);
        }
        
    }
}