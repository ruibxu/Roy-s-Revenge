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

export default class Goodend extends Scene {
    private goodend: Layer;
    private isInvincible: boolean;
    private levelCount:number;


    initScene(init: Record<string, any>):void {
        this.isInvincible = init.isInvincible;
        this.levelCount= init.levelCount;
    }


    startScene(): void {
        // Center the viewport
        this.goodend= this.addUILayer("goodend");


        let size = this.viewport.getHalfSize();
        let center = this.viewport.getCenter();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

        
        this.receiver.subscribe("menu");


        const helpBack = <Button>this.add.uiElement(UIElementType.BUTTON, "goodend", {position: new Vec2(center.x, center.y+300), text: "Main Menu"});
        helpBack.size.set(200, 50);
        helpBack.borderWidth = 2;
        helpBack.borderColor = Color.BLACK;
        helpBack.textColor = Color.BLACK;
        helpBack.backgroundColor = new Color(99,202,253);

        helpBack.onClickEventId = "menu";

        const storya = "Even though Roy didn't kill Dr.K, but Roy feels happy now, ";
        const storyb = "he knows that Dr.G will let him do the same thing at that moment. ";
        const storyc = "Roy starts his journey to protect humans and stop weaponized robots from attacking people";
        const story1 = <Label>this.add.uiElement(UIElementType.LABEL, "goodend", {position: new Vec2(center.x, center.y - 200), text: storya});
        const story2 = <Label>this.add.uiElement(UIElementType.LABEL, "goodend", {position: new Vec2(center.x, center.y - 150), text: storyb});
        const story3 = <Label>this.add.uiElement(UIElementType.LABEL, "goodend", {position: new Vec2(center.x, center.y - 100), text: storyc});

        story1.textColor=Color.WHITE;
        story2.textColor=Color.WHITE;
        story1.fontSize=25;
        story2.fontSize=25;
        story3.textColor=Color.WHITE;
        story3.fontSize=25;


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