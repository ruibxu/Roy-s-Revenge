import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { finalproject_Events } from "../../finalproject_constants";
import { PlayerStates } from "../PlayerController";
import OnGround from "./OnGround";
import GameLevel from "../../Scenes/GameLevel";

export default class Walk extends OnGround {
	owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		this.parent.speed = this.parent.MIN_SPEED;
	}

	updateSuit() {
		if(this.parent.inventory.getItem())
		{
			if(this.parent.inventory.getItem().sprite.imageId==="pistol"){
				this.owner.animation.playIfNotAlready("PISTOL_WALK", true);
			}
			else if(this.parent.inventory.getItem().sprite.imageId==="knife"){
				this.owner.animation.playIfNotAlready("KNIFE_WALK", true);
			}
			else if(this.parent.inventory.getItem().sprite.imageId==="machineGun"){
				this.owner.animation.playIfNotAlready("MACHINEGUN_WALK", true);
			}
			else if(this.parent.inventory.getItem().sprite.imageId==="laserGun"){
				this.owner.animation.playIfNotAlready("LASERGUN_WALK", true);
			}
			else if(this.parent.inventory.getItem().sprite.imageId==="lightSaber"){
				this.owner.animation.playIfNotAlready("LIGHTSABER_WALK", true);
			}
		}
		else{
			this.owner.animation.playIfNotAlready("WALK", true);
		}
	}

	update(deltaT: number): void {
		super.update(deltaT);
		let gamelevel = <GameLevel> this.owner.getScene();
        if(gamelevel.isPaused()){
            return;
        }
		let dir = this.getInputDirection();

		if(dir.isZero()){
			this.finished(PlayerStates.IDLE);
		} else {
			if(Input.isPressed("run")){
				this.finished(PlayerStates.RUN);
			}
		}

		this.parent.velocity.x = dir.x * this.parent.speed

		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}