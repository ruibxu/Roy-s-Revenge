import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import NavigationPath from "../../../Wolfie2D/Pathfinding/NavigationPath";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import { finalproject_Events, finalproject_Names } from "../../finalproject_constants";
import EnemyAI, { EnemyStates } from "../EnemyAI";
import EnemyState from "./EnemyState";
import GameLevel from "../../Scenes/GameLevel";

export default class Patrol extends EnemyState {

    // The route this AI takes when patrolling
    protected patrolRoute: Array<Vec2>;

    // The current patrolRoute index
    protected routeIndex: number;

    // The current path
    protected currentPath: NavigationPath;

    // A return object for exiting this state
    protected retObj: Record<string, any>;

    constructor(parent: EnemyAI, owner: GameNode, patrolRoute: Array<Vec2>){
        super(parent, owner);

        this.patrolRoute = patrolRoute;
        this.routeIndex = 0;
    }

    onEnter(options: Record<string, any>): void {
        this.currentPath = this.getNextPath();
    }

    handleInput(event: GameEvent): void { }

    update(deltaT: number): void {
        let gamelevel = <GameLevel> this.owner.getScene();
        if(gamelevel.isPaused()){
            return;
        }

        // If the enemy sees the player, start attacking
        this.parent.lastPlayerPos = this.parent.getPlayerPosition();
        console.log(this.parent.lastPlayerPos);
        if(this.parent.lastPlayerPos !== null&&this.parent.lastPlayerPos.distanceTo(this.owner.position)<this.parent.inRange){
            this.finished(EnemyStates.TARGETING);
        }
        else{
            //Move along patrol path
            if(this.currentPath.isDone()){
                this.currentPath = this.getNextPath();
            } else {
                this.owner.moveOnPath(this.parent.speed * deltaT, this.currentPath);

                //this.owner.rotation = Vec2.UP.angleToCCW(this.currentPath.getMoveDirection(this.owner));
                
                if (this.currentPath.getMoveDirection(this.owner).x>0){
                    (<Sprite>this.owner).invertX=false;
                }
                else{
                    (<Sprite>this.owner).invertX=true;
                }

                if((<Sprite>this.owner).imageId==="platform"){
                    if ((this.currentPath.getMoveDirection(this.owner).y>=0)){
                        (<Sprite>this.owner).invertY=false;
                    }
                    else{
                        (<Sprite>this.owner).invertY=true;
                    }
                }
            }
        }
    }

    onExit(): Record<string, any> {
        return this.retObj;
    }

    getNextPath(): NavigationPath {
        let path = this.owner.getScene().getNavigationManager().getPath(finalproject_Names.NAVMESH, this.owner.position, this.patrolRoute[this.routeIndex]);
        this.routeIndex = (this.routeIndex + 1)%this.patrolRoute.length;
        return path;
    }

}