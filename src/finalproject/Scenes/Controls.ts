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

export default class Controls extends Scene {
    private controls: Layer;
    private isInvincible: boolean;
    private levelCount: number;
    initScene(init: Record<string, any>):void {
        this.isInvincible = init.isInvincible;
        this.levelCount=init.levelCount;
    }
    startScene(): void {
        // Center the viewport
        
        this.controls= this.addUILayer("controls");

        
        let size = this.viewport.getHalfSize();
        let center = this.viewport.getCenter();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

        this.receiver.subscribe("menu");
        this.receiver.subscribe("main");
        this.receiver.subscribe("ingame");

        const controlsBack = <Button>this.add.uiElement(UIElementType.BUTTON, "controls", {position: new Vec2(center.x-450, center.y - 300), text: "Back"});
        controlsBack.size.set(200, 50);
        controlsBack.borderWidth = 2;
        controlsBack.borderColor = Color.BLACK;
        controlsBack.textColor = Color.BLACK;
        controlsBack.backgroundColor = new Color(142,142,142);
        controlsBack.onClickEventId = "menu";

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

    }
    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            if(event.type === "menu"){
                this.sceneManager.changeToScene(MainMenu, {
                    isInvincible: this.isInvincible,
                    levelCount: this.levelCount
                });
            }

        }
    }
}