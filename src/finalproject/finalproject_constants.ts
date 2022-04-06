export enum finalproject_Names {
    NAVMESH = "navmesh"
}

export enum finalproject_Events {
    ATTACK = "Attack",
    SHOOT_BULLET="Shoot_Bullet",
    SLICE="Slice",
    //when people touch with weapon sprite
    PLAYER_HIT_WEAPON="PlayerHitWeapon",
    PLAYER_HIT_TRAP="PlayerHitTRAP",
    PLAYER_DAMAGE="PlayerDamage",
    PLAYER_DEAD="PlayerDead",
    PLAYER_WEAPON_CHANGE="PlayerWeaponChange",
    SHOT_FIRED = "SHOT_FIRED",
    UNLOAD_ASSET = "UNLOAD_ASSET",
    SWAP_PLAYER = "SWAP_PLAYER",
    PLAYER_MOVE = "PlayerMove",
    PLAYER_JUMP = "PlayerJump",
    PLAYER_HIT_SWITCH = "PlayerHitSwitch",
    PLAYER_ENTERED_LEVEL_END = "PlayerEnteredLevelEnd",
    LEVEL_START = "LevelStart",
    LEVEL_PAUSED = "LevelPaused",
    LEVEL_END = "LevelEnd",
    PLAYER_KILLED = "PlayerKilled",
}

export enum finalproject_Statuses {
    IN_RANGE = "IN_RANGE",
    LOW_HEALTH = "LOW_HEALTH",
    CAN_RETREAT = "CAN_RETREAT",
    CAN_BERSERK = "CAN_BERSERK",
    REACHED_GOAL = "GOAL"
}