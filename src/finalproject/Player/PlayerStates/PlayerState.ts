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


export default abstract class PlayerState extends State {
	owner: GameNode;
	gravity: number ;
	parent: PlayerController;
	positionTimer: Timer;
	faceDirection: Vec2;
	skillmode:boolean;
	skillcooldown: Timer;
	flag:number;


	constructor(parent: StateMachine, owner: GameNode){
		super(parent);
		this.owner = owner;
		this.positionTimer = new Timer(250);
		this.positionTimer.start();
		this.skillmode=false;
		this.gravity=1000;
		this.skillcooldown=new Timer(2000);
		this.flag=0;
	}

	// Change the suit color on receiving a suit color change event
	handleInput(event: GameEvent): void {
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
		if(Input.isPressed("skill")){	
			if(!this.skillcooldown.hasRun()){
				this.skillcooldown.start();
			}
				
			if(this.skillmode==false){
				if(!this.skillcooldown.hasRun()&&this.flag==0){
					this.gravity=-1000;
					this.skillmode=true;
					this.flag=1;
					console.log("skilled	");
				}
				if(this.skillcooldown.isStopped()){
	
					this.skillcooldown.start();
					console.log("yes");
				}
				
			}
			if(this.skillmode==true){
				if(this.skillcooldown.hasRun()){
					this.owner._velocity.y=-1000;
					this.skillmode=false;
					console.log("what");
				}
				if(this.skillcooldown.isStopped()){
					this.skillcooldown.reset();
					//this.skillcooldown.start();
					console.log("no");
				}
				
			}
		}

		this.parent.velocity.y += this.gravity*deltaT;
		

	}
}