import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { PlayerStates } from "../PlayerController";
import OnGround from "./OnGround";
import GameLevel from "../../Scenes/GameLevel";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";

export default class Idle extends OnGround {
	owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		
		let gamelevel = <GameLevel> this.owner.getScene();
		if(gamelevel.isPaused()){
			this.parent.speed =0;
        }
		else{
			this.parent.speed = this.parent.MIN_SPEED;
		}
		
	}

	
	updateSuit() {
		if(this.parent.taking_damage==false){
				if(this.parent.inventory.getItem())
				{
					if(this.parent.inventory.getItem().sprite.imageId==="pistol"){
						this.owner.animation.playIfNotAlready("PISTOL_IDLE", true);
					}
					else if(this.parent.inventory.getItem().sprite.imageId==="knife"){
						this.owner.animation.playIfNotAlready("KNIFE_IDLE", true);
					}
					else if(this.parent.inventory.getItem().sprite.imageId==="machineGun"){
						this.owner.animation.playIfNotAlready("MACHINEGUN_IDLE", true);
					}
					else if(this.parent.inventory.getItem().sprite.imageId==="laserGun"){
						this.owner.animation.playIfNotAlready("LASERGUN_IDLE", true);
					}
					else if(this.parent.inventory.getItem().sprite.imageId==="lightSaber"){
						this.owner.animation.playIfNotAlready("LIGHTSABER_IDLE", true);
					}
				}
				else{
					this.owner.animation.playIfNotAlready("IDLE", true);
				}
		}
		else{
			this.owner.animation.playIfNotAlready("TAKING_DAMAGE",false);
			this.parent.taking_damage=false;
			}
	}

	update(deltaT: number): void {
		super.update(deltaT);
		let gamelevel = <GameLevel> this.owner.getScene();
		if(gamelevel.isPaused()){
            return;
        }
		let dir = this.getInputDirection();

		if(!dir.isZero()){
			if(Input.isPressed("run")){
				this.finished(PlayerStates.RUN);
			} else {
				this.finished(PlayerStates.WALK);
			}
		}
		
		this.parent.velocity.x = 0;

		this.owner.move(this.parent.velocity.scaled(deltaT));

	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}