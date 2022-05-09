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
import Goodend from "./Goodend";
import Badend from "./Badend";

export default class Decision extends Scene {
    private decision: Layer;
    private background: Layer;
    private isInvincible: boolean;
    private levelCount:number;

    loadScene(): void {
        this.load.image("back", "final_project_assets/images/decision.png");
    }
    initScene(init: Record<string, any>):void {
        this.isInvincible = init.isInvincible;
        this.levelCount= init.levelCount;
    }


    startScene(): void {
        // Center the viewport
        this.decision= this.addUILayer("decision");
        this.background=this.addUILayer("Back");
      

        let size = this.viewport.getHalfSize();
        let center = this.viewport.getCenter();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);
        let back = this.add.sprite("back", "Back");
        back.position.set(size.x, size.y);

        this.receiver.subscribe("goodend");
        this.receiver.subscribe("badend");

        const helpHeader = <Label>this.add.uiElement(UIElementType.LABEL, "decision", {position: new Vec2(center.x, center.y - 300), text: "Do you want to kill Dr.K for revenge?"});
        helpHeader.fontSize = 50;
        helpHeader.textColor=Color.WHITE;

        const goodend = <Button>this.add.uiElement(UIElementType.BUTTON, "decision", {position: new Vec2(center.x-350, center.y ), text: "Kill him"});
        goodend.size.set(200, 50);
        goodend.borderWidth = 2;
        goodend.borderColor = Color.BLACK;
        goodend.textColor = Color.BLACK;
        goodend.backgroundColor = Color.RED;
        goodend.onClickEventId = "badend";

        const badend = <Button>this.add.uiElement(UIElementType.BUTTON, "decision", {position: new Vec2(center.x+350, center.y), text: "Let him go"});
        badend.size.set(200, 50);
        badend.borderWidth = 2;
        badend.borderColor = Color.BLACK;
        badend.textColor = Color.BLACK;
        badend.backgroundColor = new Color(99,202,253);
        badend.onClickEventId = "goodend";

    }
    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            if(event.type === "goodend"){
                this.sceneManager.changeToScene(Goodend, 
                    {
                        isInvincible: this.isInvincible,
                        levelCount: this.levelCount
                    }
                    
                );
            }
            if(event.type === "badend"){
                this.sceneManager.changeToScene(Badend, 
                    {
                        isInvincible: this.isInvincible,
                        levelCount: this.levelCount
                    }
                    
                );
            }
        }
    }
}