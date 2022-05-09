import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import InAir from "./InAir";

export default class Fall extends InAir {
    owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
        if(this.parent.is_taking_damage==true){
			this.owner.animation.playIfNotAlready("TAKING_DAMAGE",false,"damagefinish");
			
		}
        else{
            if(this.parent.inventory.getItem())
            {   if(this.parent.inventory.getItem().sprite.imageId==="pistol"){
                    this.owner.animation.playIfNotAlready("PISTOL_FALL", true);
                }
                else if(this.parent.inventory.getItem().sprite.imageId==="knife"){
                    this.owner.animation.playIfNotAlready("KNIFE_FALL", true);
                }
                else if(this.parent.inventory.getItem().sprite.imageId==="machineGun"){
                    this.owner.animation.playIfNotAlready("MACHINEGUN_FALL", true);
                }
                else if(this.parent.inventory.getItem().sprite.imageId==="laserGun"){
                    this.owner.animation.playIfNotAlready("LASERGUN_FALL", true);
                }
                else if(this.parent.inventory.getItem().sprite.imageId==="lightSaber"){
                    this.owner.animation.playIfNotAlready("LIGHTSABER_FALL", true);
                }
            }
            else{
                this.owner.animation.playIfNotAlready("FALL", true);
            }
        }
                
	}

    onExit(): Record<string, any> {
		this.owner.animation.stop();
        this.parent.is_taking_damage=false;
        return {};
    }
}