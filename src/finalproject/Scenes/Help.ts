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

export default class Help extends Scene {
    private help: Layer;
    private isInvincible: boolean;
    private levelCount:number;
    private invinciblebtn :Button;


    initScene(init: Record<string, any>):void {
        this.isInvincible = init.isInvincible;
        this.levelCount= init.levelCount;
    }


    startScene(): void {
        // Center the viewport
        this.help= this.addUILayer("help");


        let size = this.viewport.getHalfSize();
        let center = this.viewport.getCenter();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

        this.receiver.subscribe("menu");
        this.receiver.subscribe("mainMenu");
        this.receiver.subscribe("invincibleOn");
        this.receiver.subscribe("invincibleOff");

        const helpHeader = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 300), text: "Help"});
        const backStory = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x-450, center.y -225), text: "Backstory"});
        helpHeader.fontSize = 70;
        helpHeader.textColor=Color.WHITE;
        backStory.fontSize = 30;
        backStory.textColor=Color.WHITE;

        const helpBack = <Button>this.add.uiElement(UIElementType.BUTTON, "help", {position: new Vec2(center.x-450, center.y - 300), text: "Back"});
        helpBack.size.set(200, 50);
        helpBack.borderWidth = 2;
        helpBack.borderColor = Color.BLACK;
        helpBack.textColor = Color.BLACK;
        helpBack.backgroundColor = new Color(142,142,142);

        helpBack.onClickEventId = "menu";

        const storya = "Roy is a robot created by Dr. G that is used to help people in daily lives. Dr. G is a nice,";
        const storyb = "intelligential man who hopes robots can help people live better and be friends with";
        const storyc = "people. Roy is the first robot Dr. G created. Roy is more like a son to Dr. G, unlike";
        const storyd = "other robots, Roy has emotions, and this is and this is the gift Dr.G gives him as the ";
        const storye = "first robots. Another scientist Dr. K has the opposite opinion with ";
        const storyf = "Dr. G, he hopes robots can be weaponized and become war machines. However K’s idea";
        const storyg = "is strongly opposed by Dr. G. Dr. K is very angry that Dr. G was trying to stop him, so ";
        const storyh = "he sends his armed robots to catch Dr. G to his laboratory, however, Dr. G was accidentally";
        const storyi = "killed by the weaponized robots, when Roy discovered that Dr. G was dead, he was very sad and then";
        const storyj = "he started his journey of revenge. He was very sad and then he started his journey of revenge. ";



        const story1 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 200), text: storya});
        const story2 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 175), text: storyb});
        const story3 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 150), text: storyc});
        const story4 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 125), text: storyd});
        const story5 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y -100), text: storye});
        const story6 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y -75), text: storyf});
        const story7 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y -50), text: storyg});
        const story8 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y -25), text: storyh});
        const story9 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y), text: storyi});
        const story10 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y +25), text: storyj});

        story1.textColor=Color.WHITE;
        story2.textColor=Color.WHITE;
        story3.textColor=Color.WHITE;
        story4.textColor=Color.WHITE;
        story5.textColor=Color.WHITE;
        story6.textColor=Color.WHITE;
        story7.textColor=Color.WHITE;
        story8.textColor=Color.WHITE;
        story9.textColor=Color.WHITE;
        story10.textColor=Color.WHITE;
        story1.fontSize=18;
        story2.fontSize=18;
        story3.fontSize=18;
        story4.fontSize=18;
        story5.fontSize=18;
        story6.fontSize=18;
        story7.fontSize=18;
        story8.fontSize=18;
        story9.fontSize=18;
        story10.fontSize=18;



        const cheat_code = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x-450, center.y +75), text: "Cheat codes"});
        cheat_code.fontSize = 30;
        cheat_code.textColor=Color.WHITE;
        const cheata = "Unlock all the levels ";
        const cheatb = "Player becomes invincible ";
        const cheatb2 = "Or you can press i ingame to turn invincible on and off ";
        const cheatc = "Press the level number in the main menu to access the level you want, ex. press 1 to enter level 1";
        const cheat1 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x-325, center.y +100), text: cheata});
        const cheat2 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x-300, center.y +125), text: cheatb});
        const cheat22 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x+300, center.y +125), text: cheatb2});
        const cheat3 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x-17, center.y +150), text: cheatc});

        cheat1.textColor=Color.WHITE;
        cheat2.textColor=Color.WHITE;
        cheat22.textColor=Color.WHITE;
        cheat3.textColor=Color.WHITE;

        cheat1.fontSize=18;
        cheat2.fontSize=18;
        cheat22.fontSize=18;
        cheat3.fontSize=18;

        this.invinciblebtn=<Button>this.add.uiElement(UIElementType.BUTTON, "help", {position: new Vec2(center.x, center.y +125), text: "OFF"});
        this.invinciblebtn.size.set(100, 25);
        this.invinciblebtn.fontSize=18;
        this.invinciblebtn.borderWidth = 2;
        this.invinciblebtn.borderColor = Color.BLACK;
        this.invinciblebtn.textColor = Color.BLACK;
        if(this.isInvincible==true){
            this.invinciblebtn.text="ON";
            this.invinciblebtn.backgroundColor = Color.GREEN;
            this.invinciblebtn.onClickEventId = "invincibleOff";
            
        }
        else{ 
            this.invinciblebtn.backgroundColor = Color.RED;
            this.invinciblebtn.onClickEventId = "invincibleOn";
        }

        const unlockLevelbtn=<Button>this.add.uiElement(UIElementType.BUTTON, "help", {position: new Vec2(center.x, center.y +100), text: "Unlock"});
        unlockLevelbtn.size.set(100, 25);
        unlockLevelbtn.fontSize=18;
        unlockLevelbtn.borderWidth = 2;
        unlockLevelbtn.borderColor = Color.BLACK;
        unlockLevelbtn.textColor = Color.BLACK;
        unlockLevelbtn.backgroundColor = new Color(142,142,142);
        unlockLevelbtn.onClick = () => {
            this.levelCount=6;
            unlockLevelbtn.text ="Unlocked";
        }




        const developers = "Developed by Ruibo Xu, Simon Wang, Hua Lin. ";
        const developers2= <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y +350), text:developers});
        developers2.fontSize=30;
        developers2.textColor=Color.WHITE;

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
            if(event.type === "invincibleOn"){
                this.isInvincible=true;
                this.invinciblebtn.onClickEventId = "invincibleOff";
                this.invinciblebtn.backgroundColor = Color.GREEN;
                this.invinciblebtn.text ="On";
            }
            if(event.type === "invincibleOff"){
                this.isInvincible=false;
                this.invinciblebtn.onClickEventId = "invincibleOn";
                this.invinciblebtn.backgroundColor = Color.RED;
                this.invinciblebtn.text ="Off";
            }

            if(event.type === "allLevel"){
                //this.allLevel=true;
            }
                
        }
    }
}