import State from "../../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Timer from "../../../Wolfie2D/Timing/Timer";
import { finalproject_Events } from "../../finalproject_constants";
import PlayerController, { PlayerStates } from "../PlayerController";
import GameLevel from "../../Scenes/GameLevel";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import Debug from "../../../Wolfie2D/Debug/Debug";


export default abstract class PlayerState extends State {
	owner: GameNode;
	parent:PlayerController;
	positionTimer: Timer;
	faceDirection: Vec2;



	constructor(parent: StateMachine, owner: GameNode){
		super(parent);
		this.owner = owner;
		this.positionTimer = new Timer(250);
		this.positionTimer.start();

	}
	
	// Change the suit color on receiving a suit color change event
	handleInput(event: GameEvent): void {
		if(event.type === finalproject_Events.SKILLMODE){
			console.log("yes");

			let direction = this.getInputDirection();
		
			if(this.parent.skillmode==true){
				(<Sprite>this.owner).invertY = MathUtils.sign(direction.y) > 0 ; 
			}
			else{
				(<Sprite>this.owner).invertY = false;
			}	
		}



	}

	/** 
	 * Get the inputs from the keyboard, or Vec2.Zero if nothing is being pressed
	 */
	getInputDirection(): Vec2 {
		let gamelevel = <GameLevel> this.owner.getScene();
		let direction = Vec2.ZERO;
		if(gamelevel.isPaused()){
            direction.x=0;
			return direction;
        }
		direction.x = (Input.isPressed("left") ? -1 : 0) + (Input.isPressed("right") ? 1 : 0);
		direction.y = (Input.isJustPressed("jump") ? -1 : 0);
		return direction;
	}

	/**This function is left to be overrided by any of the classes that extend this base class. That way, each
	 * class can swap their animation1,s accordingly.
	*/
	updateSuit() {
		
	}

	update(deltaT: number): void {
		let gamelevel = <GameLevel> this.owner.getScene();
        if(gamelevel.isPaused()){
            return;
        }
		// Do gravity
		this.updateSuit();
		if (this.positionTimer.isStopped()){
			this.emitter.fireEvent(finalproject_Events.PLAYER_MOVE, {position: this.owner.position.clone()});
			this.positionTimer.start();
		}
		


		if(this.parent.skillmode==false){
			//console.log(this.parent.velocity.y);
			this.parent.velocity.y += this.parent.gravity*deltaT;
		}
		else if (this.parent.skillmode==true){
			this.parent.velocity.y += this.parent.gravity*deltaT;
		}
		//
		if(this.parent.skillmode==true){
			Debug.log("skillmode", "skill mode : true");
		} else if (this.parent.skillmode==false){
			Debug.log("skillmode", "skill mode : false");
		}

		if(this.owner.onGround==true){
			Debug.log("onGround", "OnGround : true");
		}
		else if(this.owner.onGround==false){
			Debug.log("onGround", "OnGround : false");
		}
		if(this.owner.onCeiling==true){
			Debug.log("onCeiling", "onCeiling : true");
		}
		else if(this.owner.onCeiling==false){
			Debug.log("onCeiling", "onCeiling : false");
		}
		

	}
}