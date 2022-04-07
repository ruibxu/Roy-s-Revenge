import State from "../../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Timer from "../../../Wolfie2D/Timing/Timer";
import { finalproject_Events } from "../../finalproject_constants";
import PlayerController from "../PlayerController";


export default abstract class PlayerState extends State {
	owner: GameNode;
	gravity: number = 1000;
	parent: PlayerController;
	positionTimer: Timer;
	faceDirection: Vec2;
	skillmode:boolean = false;


	constructor(parent: StateMachine, owner: GameNode){
		super(parent);
		this.owner = owner;
		this.positionTimer = new Timer(250);
		this.positionTimer.start();
		this.faceDirection=new Vec2(1,0);
	}

	// Change the suit color on receiving a suit color change event
	handleInput(event: GameEvent): void {
	}

	/** 
	 * Get the inputs from the keyboard, or Vec2.Zero if nothing is being pressed
	 */
	getInputDirection(): Vec2 {
		let direction = Vec2.ZERO;
		direction.x = (Input.isPressed("left") ? -1 : 0) + (Input.isPressed("right") ? 1 : 0);
		direction.y = (Input.isJustPressed("jump") ? -1 : 0);
		if(this.owner.onGround)
		{if(Input.isPressed("left")) this.faceDirection.x=-1;
		else if(Input.isPressed("right")) this.faceDirection.x=1;}
		return direction;
	}

	/**This function is left to be overrided by any of the classes that extend this base class. That way, each
	 * class can swap their animation1,s accordingly.
	*/
	updateSuit() {
		
	}

	update(deltaT: number): void {
		// Do gravity
		this.updateSuit();
		if (this.positionTimer.isStopped()){
			this.emitter.fireEvent(finalproject_Events.PLAYER_MOVE, {position: this.owner.position.clone()});
			this.positionTimer.start();
		}
		if(Input.isMouseJustPressed())
		{	
			this.emitter.fireEvent(finalproject_Events.ATTACK,{position:this.owner.position.clone(),direction:this.faceDirection});}
			this.parent.velocity.y += this.gravity*deltaT;
	}
}