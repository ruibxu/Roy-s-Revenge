import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { EaseFunctionType } from "../../../Wolfie2D/Utils/EaseFunctions";
import { finalproject_Events } from "../../finalproject_constants";
import { PlayerStates } from "../PlayerController";
import InAir from "./InAir";

export default class Jump extends InAir {
	owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "jump", loop: false, holdReference: false});
	}

	updateSuit() {
		if(this.parent.inventory.getItem())
		{
			if(this.parent.inventory.getItem().sprite.imageId==="pistol"){
				this.owner.animation.playIfNotAlready("PISTOL_JUMP", true);
			}
			else if(this.parent.inventory.getItem().sprite.imageId==="knife"){
				this.owner.animation.playIfNotAlready("KNIFE_JUMP", true);
			}
			else if(this.parent.inventory.getItem().sprite.imageId==="machineGun"){
				this.owner.animation.playIfNotAlready("MACHINEGUN_JUMP", true);
			}
			else if(this.parent.inventory.getItem().sprite.imageId==="laserGun"){
				this.owner.animation.playIfNotAlready("LASERGUN_JUMP", true);
			}
			else if(this.parent.inventory.getItem().sprite.imageId==="lightSaber"){
				this.owner.animation.playIfNotAlready("LIGHTSABER_JUMP", true);
			}
		}
		else{
			this.owner.animation.playIfNotAlready("JUMP", true);
		}
		
	}

	update(deltaT: number): void {
		super.update(deltaT);

		if(this.owner.onCeiling){
			this.parent.velocity.y = 0;
		}

		// If we're falling, go to the fall state
		if(this.parent.velocity.y >= 0){
			this.finished(PlayerStates.FALL);
		}
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}