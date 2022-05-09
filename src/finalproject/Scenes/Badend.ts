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

export default class Badend extends Scene {
    private badend: Layer;
    private background: Layer;
    private isInvincible: boolean;
    private levelCount:number;

    loadScene(): void {
        this.load.image("back", "final_project_assets/images/badend.png");
    }

    initScene(init: Record<string, any>):void {
        this.isInvincible = init.isInvincible;
        this.levelCount= init.levelCount;
    }


    startScene(): void {
        // Center the viewport
        this.badend= this.addUILayer("badend");
        this.background=this.addUILayer("Back");
       

        let size = this.viewport.getHalfSize();
        let center = this.viewport.getCenter();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);
        let back = this.add.sprite("back", "Back");
        back.position.set(size.x, size.y);

        this.receiver.subscribe("menu");


        const helpBack = <Button>this.add.uiElement(UIElementType.BUTTON, "badend", {position: new Vec2(center.x, center.y+300), text: "Main Menu"});
        helpBack.size.set(200, 50);
        helpBack.borderWidth = 2;
        helpBack.borderColor = Color.BLACK;
        helpBack.textColor = Color.BLACK;
        helpBack.backgroundColor = new Color(99,202,253);

        helpBack.onClickEventId = "menu";

        const storya = "Roy killed Dr.K, but he didn't feel happy about it, he realized that he already became a killing machine,";
        const storyb = "he is not the robot that Dr.G expected him to be. Now, all he has left is loneliness";

        const story1 = <Label>this.add.uiElement(UIElementType.LABEL, "badend", {position: new Vec2(center.x, center.y - 200), text: storya});
        const story2 = <Label>this.add.uiElement(UIElementType.LABEL, "badend", {position: new Vec2(center.x, center.y - 150), text: storyb});

        story1.textColor=Color.WHITE;
        story2.textColor=Color.WHITE;
        story1.fontSize=25;
        story2.fontSize=25;


    }
    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            if(event.type === "menu"){
                this.sceneManager.changeToScene(MainMenu, 
                    {
                        isInvincible: this.isInvincible,
                        levelCount: this.levelCount
                    }
                    
                );
            }              
        }
    }
}