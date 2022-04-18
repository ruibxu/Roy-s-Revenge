export enum finalproject_Names {
    NAVMESH = "navmesh"
}

export enum finalproject_Events {
    //in level events
    ATTACK = "attack",
    SHOOT_BULLET="shootBullet",
    SLICE="slice",
    PLAYER_HIT_WEAPON="playerHitWeapon",
    PLAYER_HIT_TRAP="playerHitTrap",
    PLAYER_DAMAGE="playerDamage",
    PLAYER_DEAD="playerDead",
    PLAYER_WEAPON_CHANGE="playerWeaponChange",
    SHOT_FIRED = "shotFired",
    UNLOAD_ASSET = "unloadAsset",
    PLAYER_MOVE = "playerMove",
    PLAYER_JUMP = "PlayerJump",
    PLAYER_HIT_SWITCH = "playerHitSwitch",
    PLAYER_ENTERED_LEVEL_END = "playerEnteredLevelEnd",
    LEVEL_START = "levelStart",
    LEVEL_PAUSED = "levelPaused",
    LEVEL_END = "levelEnd",
    PLAYER_KILLED = "playerKilled",
    PICKUP_HEALTHPACK = "pickupHealthpack",
    PICKUP_GEAR = "pickupGear",
    GEAR = "gear",

    //menu events
    IN_GAME_MENU = "ingame_menu",
    BACK_TO_GAME = "back_to_game",
    HEALTHPACK = "healthpack",
    RESUME = "resume",
    NEWGAME = "newgame",
    HELP = "help",
    CONTROL = "control",
    MENU = "menu"
}

export enum finalproject_Statuses {
    IN_RANGE = "IN_RANGE",
    LOW_HEALTH = "LOW_HEALTH",
    CAN_RETREAT = "CAN_RETREAT",
    CAN_BERSERK = "CAN_BERSERK",
    REACHED_GOAL = "GOAL"
}