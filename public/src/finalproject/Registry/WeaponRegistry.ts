import Registry from "../../Wolfie2D/Registry/Registries/Registry";
import ResourceManager from "../../Wolfie2D/ResourceManager/ResourceManager";
import LaserGun from "../GameSystems/items/WeaponTypes/LaserGun";
import SemiAutoGun from "../GameSystems/items/WeaponTypes/SemiAutoGun";
import Slice from "../GameSystems/items/WeaponTypes/Slice";
import WeaponType from "../GameSystems/items/WeaponTypes/WeaponType";

export default class WeaponTemplateRegistry extends Registry<WeaponConstructor> {
    
    public preload(): void {
        const rm = ResourceManager.getInstance();

        // Load sprites
        rm.image("pistol", "final_project_assets/sprites/pistol.png");
        rm.image("knife", "final_project_assets/sprites/knife.png");
        rm.image("laserGun", "final_project_assets/sprites/laser_gun.png");
        rm.image("machineGun","final_project_assets/sprites/machine_gun.png");
        rm.image("lightSaber","final_project_assets/sprites/light_saber.png");

        // Load spritesheets
        rm.spritesheet("slice", "final_project_assets/spritesheets/slice.json");

        // Register default types
        this.registerItem("slice", Slice);
        this.registerItem("laserGun", LaserGun);
        this.registerItem("semiAutoGun", SemiAutoGun);
    }

    // We don't need this for this assignment
    public registerAndPreloadItem(key: string): void {}

    public registerItem(key: string, constr: WeaponConstructor): void {
        this.add(key, constr);
    }
}

type WeaponConstructor = new (...args: any) => WeaponType;