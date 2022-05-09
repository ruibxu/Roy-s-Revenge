export enum finalproject_Names {
    NAVMESH = "navmesh"
}


export enum finalproject_Events {
    //in level events
    ATTACK = "attack",
    SHOOT_BULLET = "shootBullet",
    SLICE = "slice",
    PLAYER_HIT_WEAPON = "playerHitWeapon",
    // PLAYER_HIT_TRAP = "playerHitTrap",
    // PLAYER_HIT_LASER = "playerHitLaser",
    // PLAYER_HIT_SPIKE = "playerHitSpike",
    PLAYER_DAMAGE = "playerDamage",
    PLAYER_DEAD = "playerDead",
    PLAYER_WEAPON_CHANGE = "playerWeaponChange",
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
    ENEMY_DEAD = "enemyDied",
    ENEMY_SHOOT_BULLET="enemy_shoot_bullet",
    PLAYER_HIT_GEAR="playerHitGear",

    //menu events
    IN_GAME_MENU = "ingame_menu",
    BACK_TO_GAME = "back_to_game",
    HEALTHPACK = "healthpack",
    RESUME = "resume",
    NEWGAME = "newgame",
    SELECT = "select",
    HELP = "help",
    CONTROL = "control",
    MENU = "menu",
    HINT = "hint",
    HINTDISABLE = "hintdisable",
    SKILLMODE ="skillmode"
}

export enum finalproject_Statuses {
    IN_RANGE = "IN_RANGE",
    LOW_HEALTH = "LOW_HEALTH",
    CAN_RETREAT = "CAN_RETREAT",
    CAN_BERSERK = "CAN_BERSERK",
    REACHED_GOAL = "GOAL"
}

export enum level1_tiles {
    EMPTY = 0,
    SWITCH_RED_ON = 12,
    SWITCH_RED_OFF = 13,
    LASER_RED = 16,
    SWITCH_GREEN_ON = 33,
    SWITCH_GREEN_OFF = 34,
    LASER_GREEN = 36,
    SWITCH_BLUE_ON = 31,
    SWITCH_BLUE_OFF = 32,
    LASER_BLUE = 56,
    SPIKE_UP = 15,
    SPIKE_DOWN = 4
}

export enum level3_tiles {
    EMPTY = 9,
    SWITCH_RED_ON = 36,
    SWITCH_RED_OFF = 44,
    LASER_RED = 47,
    SWITCH_GREEN_ON = 35,
    SWITCH_GREEN_OFF = 43,
    LASER_GREEN = 46,
    SWITCH_BLUE_ON = 37,
    SWITCH_BLUE_OFF = 45,
    LASER_BLUE = 48,
    SPIKE_UP = 42,
    SPIKE_DOWN = 34
}

export enum level5_tiles {
    EMPTY = 0,
    SWITCH_RED_ON = 12,
    SWITCH_RED_OFF = 13,
    LASER_RED = 16,
    SWITCH_GREEN_ON = 56, 
    SWITCH_GREEN_OFF = 57,
    LASER_GREEN = 35,
    SWITCH_BLUE_ON = 59,
    SWITCH_BLUE_OFF = 60,
    LASER_BLUE = 20,
    SPIKE_UP = 15,
    SPIKE_DOWN = 4
}