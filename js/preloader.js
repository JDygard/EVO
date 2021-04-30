class Preloader extends Phaser.Scene{ // Creating a Preloader class as an extension of the scene.
    constructor() {                   // Calling the constructor to build it.  
        super('Preloader');           // And the super to call functions from the parent class. 
    }                                 

    preload(){                                                                  // The preload method is used by the library once at the loading of the scene. 
                                                                                // We are loading our sprites and images here. Since images are handled by the
        this.load.image('background', 'assets/images/BG.jpg');                  // textureManager, they can be loaded anywhere within Phaser.Scene
        this.load.image('menuscreen', 'assets/images/menuscreen/temporary.png') // and still be useful elsewhere.
        this.load.image('food', 'assets/images/sprites/food_green.png')
        this.load.image('debris1', 'assets/images/bg_debris/debris1.jpg')
        this.load.image('debris2', 'assets/images/bg_debris/debris2.jpg')
        this.load.image('debris3', 'assets/images/bg_debris/debris3.jpg')
        this.load.image('debris4', 'assets/images/bg_debris/debris4.jpg')
        this.load.image('debris5', 'assets/images/bg_debris/debris5.jpg')
        this.load.image('debris6', 'assets/images/bg_debris/debris6.jpg')
        this.load.image('debris7', 'assets/images/bg_debris/debris7.jpg')
        this.load.image('debris8', 'assets/images/bg_debris/debris8.jpg')
        this.load.image('debris9', 'assets/images/bg_debris/debris9.jpg')
        this.load.image('debris10', 'assets/images/bg_debris/debris10.jpg')
        this.load.image('debris11', 'assets/images/bg_debris/debris11.jpg')
        this.load.image('debris12', 'assets/images/bg_debris/debris12.jpg')
        this.load.image('debris13', 'assets/images/bg_debris/debris13.jpg')
        this.load.image('debris14', 'assets/images/bg_debris/debris14.jpg')
        this.load.image('debris15', 'assets/images/bg_debris/debris15.jpg')
        this.load.image('debris16', 'assets/images/bg_debris/debris16.jpg')
        //========================================== Animations generation ==========================================//
        // Player animation
        this.load.spritesheet(
            "player-idle",
            "../assets/images/sprites/player_spritemap_idle.png",
            {
                frameWidth: 126,
                frameHeight: 126
            }
        );

    }                                                                   

    create(){
        if (debugMode == true){                                         // Test for debug mode
            console.log("Debug mode is set to" + ' ' + debugMode)
            this.scene.start('Gameplay')
        } else{
        this.scene.start('MenuScreen')                                    // Launching the game.
        console.log("preloader start game method")
        }
    }
}