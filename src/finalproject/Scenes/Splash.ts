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

export default class Splash extends Scene {
    private splash: Layer;
    logo: Sprite;

    loadScene(): void {
        this.load.image("logo", "final_project_assets/images/banner.png");
    }
    startScene(): void {
        // Center the viewport
        
        let size = this.viewport.getHalfSize();
        let center = this.viewport.getCenter();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);


        //splashpages
        this.splash=this.addUILayer("splash");
        this.logo = this.add.sprite("logo", "splash");
        this.logo.position.set(size.x, size.y-250);
        this.logo.scale.set(1.5,1.5);

        const splashHeader = <Label>this.add.uiElement(UIElementType.LABEL, "splash", {position: new Vec2(center.x, center.y + 250), text: "Click to Start"});
        splashHeader.fontSize = 50;
        splashHeader.textColor=Color.WHITE;
    }
    updateScene(){
        if(Input.isMouseJustPressed()){
            this.sceneManager.changeToScene(MainMenu, {});
        }
    }
}