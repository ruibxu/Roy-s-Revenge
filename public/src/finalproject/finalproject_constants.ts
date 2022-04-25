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

    //menu events
    IN_GAME_MENU = "ingame_menu",
    BACK_TO_GAME = "back_to_game",
    HEALTHPACK = "healthpack",
    RESUME = "resume",
    NEWGAME = "newgame",
    HELP = "help",
    CONTROL = "control",
    MENU = "menu",
    HINT1 = "hint1",
    HINT2 = "hint2",
    HINT3 = "hint3",
    HINT4 = "hint4",
    HINT5 = "hint5",
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
    SWITCH_GREEN_ON = 999,  //dummies
    SWITCH_GREEN_OFF = 999,
    LASER_GREEN = 999,
    SWITCH_BLUE_ON = 999,
    SWITCH_BLUE_OFF = 999,
    LASER_BLUE = 999,
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
    SWITCH_RED_ON = 35,
    SWITCH_RED_OFF = 43,
    LASER_RED = 46,
    SWITCH_GREEN_ON = 34,
    SWITCH_GREEN_OFF = 42,
    LASER_GREEN = 45,
    SWITCH_BLUE_ON = 36,
    SWITCH_BLUE_OFF = 44,
    LASER_BLUE = 47,
    SPIKE_UP = 33,
    SPIKE_DOWN = 41
}