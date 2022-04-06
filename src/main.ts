import Game from "./Wolfie2D/Loop/Game";
import MainMenu from "./finalproject/Scenes/MainMenu";
import Splash from "./finalproject/Scenes/Splash";
import WeaponTemplateRegistry from "./finalproject/Registry/WeaponRegistry";
import RegistryManager from "./Wolfie2D/Registry/RegistryManager";
import WeaponTypeRegistry from "./finalproject/Registry/WeaponTypeRegistry";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // Run any tests
    runTests();

    // Set up options for our game
    let options = {
        canvasSize: {x: 1200, y: 800},          // The size of the game
        clearColor: {r: 0, g: 74, b: 111},   // The color the game clears to
        inputs: [
            {name: "left", keys: ["a"]},
            {name: "right", keys: ["d"]},
            {name: "jump", keys: ["w", "space"]},
            {name: "ultimate", keys: ["q"]},
            {name: "switch", keys: ["e"]},
            {name: "run", keys: ["shift"]},
            {name: "pickup", keys: ["f"]}

        ],
        useWebGL: false,                        // Tell the game we want to use webgl
        showDebug: false                       // Whether to show debug messages. You can change this to true if you want
    }

    // Set up custom registries
    let weaponTemplateRegistry = new WeaponTemplateRegistry();
    RegistryManager.addCustomRegistry("weaponTemplates", weaponTemplateRegistry);
    
    let weaponTypeRegistry = new WeaponTypeRegistry();
    RegistryManager.addCustomRegistry("weaponTypes", weaponTypeRegistry);

    // Create a game with the options specified

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(Splash, {});
})();

function runTests(){};