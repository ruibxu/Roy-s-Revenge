import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import PlayerState from "./PlayerState";

export default class OnGround extends PlayerState {
	onEnter(options: Record<string, any>): void {}

	update(deltaT: number): void {
		if(this.parent.velocity.y >= 0&& this.parent.skillmode==false){
			this.parent.velocity.y = 0;
		}
		if(this.parent.velocity.y <= 0 &&this.parent.skillmode==true){
			this.parent.velocity.y = 0;
		}



		super.update(deltaT);

		let direction = this.getInputDirection();

		if(direction.x !== 0){
			(<Sprite>this.owner).invertX = MathUtils.sign(direction.x) < 0;
		}

		// If we jump, move to the Jump state, give a burst of upwards velocity, and play our flip tween animation if 
		// we're moving left or right
		if(Input.isJustPressed("jump")&& this.parent.skillmode==false){
			this.finished("jump");
			this.parent.velocity.y = -500;
		} 
		else if(Input.isJustPressed("jump")&& this.parent.skillmode==true){
			this.finished("jump");
			this.parent.velocity.y = 500;
			console.log(this.parent.velocity.y);
		} 
		
		if(!this.owner.onGround&&this.parent.skillmode==false){
			//console.log(this.skillmode);
			this.finished("fall");
		}
		else if(!this.owner.onCeiling&&this.parent.skillmode==true){
			this.finished("fall");
		}



		
	}

	onExit(): Record<string, any> {
		return {};
	}
}