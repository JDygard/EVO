class Preloader extends Phaser.Scene{ // Creating a Preloader class as an extension of the scene.
    constructor() {                   // Calling the constructor to build it.  
        super('Preloader');           // And the super to call functions from the parent class. 
    }                 

//======================== The preload method is used by the library once at the loading of the scene. ==================
//===== We are loading our sprites and images here. Since images are handled by the textureManager, they            =====
//===== can be loaded anywhere within Phaser.Scene and still be used elsewhere.                                     =====
    preload(){                                                                                                                                                 
        this.load.image('background', 'assets/images/BG.jpg');                              // Background image     
        this.load.image('menu-sky', 'assets/images/menuscreen/menu-sky.png')                // Menu sky image  
        this.load.image('menu-underwater', 'assets/images/menuscreen/menu-underwater.png')  // Menu underwater image
        this.load.image('menu-water', 'assets/images/menuscreen/menu-water.png')            // Menu water image             
        this.load.image('food', 'assets/images/sprites/food_green.png')                     // Food image
        this.load.image('healthbar', 'assets/images/sprites/healthbar.png')                 // Healthbar image
        this.load.image('menu-title', 'assets/images/menuscreen/menu-title.png')            // EVO title text
        this.load.image('menu-consume', 'assets/images/menuscreen/menu-consume.png')        // Menu consume text image
        this.load.image('menu-evolve', 'assets/images/menuscreen/menu-evolve.png')          // Menu evolve text
        this.load.image('menu-survive', 'assets/images/menuscreen/menu-survive.png')        // Menu survive text
        this.load.image('menu-press', 'assets/images/menuscreen/menu-press-any-key.png')    // Menu "Press any key" text
        this.load.image('evo-menu-bg', 'assets/images/evolvemenu/evo-menu-background.png')   // Evo menu scene background

        for (let i = 0; i < 16; i++){                                                       // A loop to load all 16 debris images
            debris[i] = this.load.image('debris' + i, 'assets/images/bg_debris/debris' + i + '.png');   // because doing it one-by-one is so pedestrian.
        }
        

//========================================== Animations spritesheet generation ==========================================//
//============= Player animations =================
        this.load.spritesheet(                                  // Method to load spritesheets
            "base-player-idle",                                 // "Key" to refer to this sheet later
            "assets/images/sprites/player_spritemap_idle.png",  // Path to the spritesheet
            {
                frameWidth: 126,                                // Size of the frames' width in the sheet in pixels
                frameHeight: 126                                // Size of the frames' height in the sheet in pixels
            }
        );
        this.load.spritesheet(                                  // Method to load spritesheets
            "base-player-moving",                               // "Key" to refer to this sheet later
            "assets/images/sprites/player_spritemap_moving.png",// Path to the spritesheet
            {
                frameWidth: 126,                                // Size of the frames' width in the sheet in pixels
                frameHeight: 126                                // Size of the frames' height in the sheet in pixels
            }
        )
        this.load.spritesheet(                                          // Method to load spritesheets
            "spike-player-move",                                        // "Key" to refer to this sheet later
            "assets/images/sprites/player_spritemap_spike_moving.png",  // Path to the spritesheet
            {
                frameWidth: 126,                                // Size of the frames' width in the sheet in pixels
                frameHeight: 126                                // Size of the frames' height in the sheet in pixels
            }
        )
        this.load.spritesheet(                                          // Method to load spritesheets
            "spike-player-idle",                                        // "Key" to refer to this sheet later
            "assets/images/sprites/player_spritemap_spike_idle.png",  // Path to the spritesheet
            {
                frameWidth: 126,                                // Size of the frames' width in the sheet in pixels
                frameHeight: 126                                // Size of the frames' height in the sheet in pixels
            }
        )
        this.load.spritesheet(                                          // Method to load spritesheets
            "flagellum-player-idle",                                        // "Key" to refer to this sheet later
            "assets/images/sprites/player_spritemap_flagellum_idle.png",  // Path to the spritesheet
            {
                frameWidth: 126,                                // Size of the frames' width in the sheet in pixels
                frameHeight: 126                                // Size of the frames' height in the sheet in pixels
            }
        )
        this.load.spritesheet(                                          // Method to load spritesheets
            "flagellum-player-moving",                                        // "Key" to refer to this sheet later
            "assets/images/sprites/player_spritemap_flagellum_moving.png",  // Path to the spritesheet
            {
                frameWidth: 126,                                // Size of the frames' width in the sheet in pixels
                frameHeight: 126                                // Size of the frames' height in the sheet in pixels
            }
        )
        this.load.spritesheet(                                          // Method to load spritesheets
            "spikeflagellum-player-moving",                                        // "Key" to refer to this sheet later
            "assets/images/sprites/player_spritemap_flagspike_moving.png",  // Path to the spritesheet
            {
                frameWidth: 126,                                // Size of the frames' width in the sheet in pixels
                frameHeight: 126                                // Size of the frames' height in the sheet in pixels
            }
        )
        this.load.spritesheet(                                          // Method to load spritesheets
            "spikeflagellumstiff-player-moving",                                        // "Key" to refer to this sheet later
            "assets/images/sprites/player_spritemap_flagspikestiff_moving.png",  // Path to the spritesheet
            {
                frameWidth: 126,                                // Size of the frames' width in the sheet in pixels
                frameHeight: 126                                // Size of the frames' height in the sheet in pixels
            }
        )
//=========== Enemy animations ======================

        this.load.spritesheet(                                          // Method to load spritesheets
            "base-enemy-move",                                        // "Key" to refer to this sheet later
            "assets/images/sprites/enemy_spritemap_moving.png",  // Path to the spritesheet
            {
                frameWidth: 126,                                // Size of the frames' width in the sheet in pixels
                frameHeight: 126                                // Size of the frames' height in the sheet in pixels
            }
        )
        this.load.spritesheet(                                          // Method to load spritesheets
            "spike-enemy-move",                                        // "Key" to refer to this sheet later
            "assets/images/sprites/enemy_spritemap_spike_moving.png",  // Path to the spritesheet
            {
                frameWidth: 126,                                // Size of the frames' width in the sheet in pixels
                frameHeight: 126                                // Size of the frames' height in the sheet in pixels
            }
        )
//============ Menu water animation =============
        this.load.spritesheet(                              // Method to load spritesheets
            "animatedWater",                                // "Key" to refer to this sheet later
            "assets/images/menuscreen/animated-water.png",  // Path to the spritesheet
            {
                frameWidth: 1600,                           // Size of the frames' width in the sheet in pixels
                frameHeight: 630                            // Size of the frames' height in the sheet in pixels
            }
        )
        // Preload virtual joystick plugin assets
        var rexURL;rexURL = 'js/rexvirtualjoystickplugin.min.js';
        this.load.plugin('rexvirtualjoystickplugin', rexURL, true);
    }                                                                   

    create(){   // Create method is run after the scene and preloader loads. We're just using it here to launch the game.
        if (debugMode == true){                                         // Test for debug mode
            this.scene.start('Gameplay')                                // Skip menu screen because debug mode.
        } 
        else {
            this.scene.start('MenuScreen')                              // Launch the game.
        }
    }
    
}