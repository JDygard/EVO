class Preloader extends Phaser.Scene{ // Creating a Preloader class as an extension of the scene.
    constructor() {                   // Calling the constructor to build it.  
        super('Preloader');           // And the super to call functions from the parent class. 
    }                                 

    preload(){                                                                  // The preload method is used by the library once at the loading of the scene.                                                                                
        this.load.image('background', 'assets/images/BG.jpg');                  // We are loading our sprites and images here. Since images are handled by the
        this.load.image('menu-sky', 'assets/images/menuscreen/menu-sky.png')    // textureManager, they can be loaded anywhere within Phaser.Scene
        this.load.image('menu-underwater', 'assets/images/menuscreen/menu-underwater.png')         // and still be useful elsewhere.
        this.load.image('menu-water', 'assets/images/menuscreen/menu-water.png')
        this.load.image('food', 'assets/images/sprites/food_green.png')
        this.load.image('healthbar', 'assets/images/sprites/healthbar.png')
        this.load.image('menu-title', 'assets/images/menuscreen/menu-title.png')
        this.load.image('menu-consume', 'assets/images/menuscreen/menu-consume.png')
        this.load.image('menu-evolve', 'assets/images/menuscreen/menu-evolve.png')
        this.load.image('menu-survive', 'assets/images/menuscreen/menu-survive.png')
        this.load.image('menu-press', 'assets/images/menuscreen/menu-press-any-key.png')
        for (let i = 0; i < 16; i++){                                                       // A loop to load all 16 debris graphics
            this.load.image('debris' + i, 'assets/images/bg_debris/debris' + i + '.png');   // because doing it one-by-one is so pedestrian
            debris[i] = 'debris' + i;
        }

        //========================================== Animations spritesheet generation ==========================================//
        // Player animation
        this.load.spritesheet(
            "base-player-idle",
            "assets/images/sprites/player_spritemap_idle.png",
            {
                frameWidth: 126,
                frameHeight: 126
            }
        );
        this.load.spritesheet(
            "base-player-moving",
            "assets/images/sprites/player_spritemap_moving.png",
            {
                frameWidth: 126,
                frameHeight: 126
            }
        )
        this.load.spritesheet(
            "spike-player-move",
            "assets/images/sprites/player_spritemap_spike_moving.png",
            {
                frameWidth: 126,
                frameHeight: 126
            }
        )
        this.load.spritesheet(
            "animatedWater",
            "assets/images/menuscreen/animated-water.png",
            {
                frameWidth: 1600,
                frameHeight: 630
            }
        )
    }                                                                   

    create(){
        if (debugMode == true){                                         // Test for debug mode
            console.log("Debug mode is set to" + ' ' + debugMode)
            this.scene.start('Gameplay')
        } 
        else {
            this.scene.start('MenuScreen')                                    // Launch the game.
        }
    }
}