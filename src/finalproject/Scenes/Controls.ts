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
import InGameMenu from "./InGameMenu";

export default class Controls extends Scene {
    private controls: Layer;


    startScene(): void {
        // Center the viewport
        
        this.controls= this.addUILayer("controls");


        
        let size = this.viewport.getHalfSize();
        let center = this.viewport.getCenter();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

        this.receiver.subscribe("menu");

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
        const texta = "a to move left";
        const textb = "d to move right";
        const text="space and w to jump";
        const textc = "e to switch weapons";
        const textd = "Q to cast the ultimate skill";
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

    }
    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            if(event.type === "menu"){
                this.sceneManager.changeToScene(MainMenu, {});
            }
        }
    }
}