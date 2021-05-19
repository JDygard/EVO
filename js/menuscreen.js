class MenuScreen extends Phaser.Scene {
    constructor (){
        super('MenuScreen')
    }
    create(){
        
//======================================= Adding images ======================================
//===== There's a lot of moving pieces in this animation. We are adding them all in a    =====
//=====                                   big chunk here.                                =====

        let sky = this.add.image(800, 160, "menu-sky")                      // Sky image
        let water = this.add.image(800, 435, "menu-water")                  // Water surface
        let underwater = this.add.sprite(800, 970, "menu-underwater")       // Underwater
        let title = this.add.image(800, 300, "menu-title").setAlpha(0)      // Title text, alpha set to 0 to make it invisible
        let evolve = this.add.image(1240, 550, "menu-evolve").setAlpha(0);  // Evolve text, alpha set to 0 to make it invisible
        let consume = this.add.image(350, 550, "menu-consume").setAlpha(0); // Consume text, alpha set to 0 to make it invisible
        let survive = this.add.image(800, 650, "menu-survive").setAlpha(0); // Survive text, alpha set to 0 to make it invisible
        let pressKey = this.add.image(800, 750, "menu-press").setAlpha(0);  // Press any key text, alpha set to 0 to make it invisible
        this.anims.create({                                                 // Creating our water animation
            key: "animated-water",                                          // Declaring the key to which it will be referred
            frames: this.anims.generateFrameNumbers("animatedWater", { start: 0, end: 5 }), // Getting the spritesheet and numbering the frames for the array
            frameRate: 3,                                                   // Speed at which the frames are cycled
        })
        let durationSky = 2000;                                             // A useful variable for adjusting the duration of the initial "dive" animation in one place

//=============================== Menu intro ==============================
        underwater.anims.play({         // Start playing the underwater animation
            key: "animated-water",      // Call on the key declared above in the this.anims.create() method
            repeat: -1,                 // "repeat: -1" means to repeat it ad infinitum
        })
        this.cameras.main.fadeIn(300);  // A short fade into the background
        this.tweens.add({               // Start a tween
            targets: title,             // Targeting the title image
            alpha: {                    // Set the alpha target
                value:1,                // Going from 0 to 1
                duration: 700,          // in 700ms
                delay: 300              // 300ms after scene load
            }
        })
        this.tweens.add({               // Start a tween           
            targets: sky,               // Targeting the sky image
            scaleY: {                   // Set the Y scale
                value: .7,              // From 1 to 0.7
                duration: durationSky,  // for 2000ms
            },
            y: {                        // Move in the y axis
                value: -50,             // to -50 pixels
                duration: durationSky,  // over 2000ms
            },
            ease: "Sine.easeInOut",     // Nice and easy
            delay: 1000,                // 1000ms after scene load
        })
        this.tweens.add({               // Start a tween
            targets: water,             // Targeting the water image
            scaleY: {                   // Set the Y scale
                value: .2               // From 1 to 0.2
            },
            y: {                        // Move in the y axis
                value: 40,              // to 0, 40
            },
            duration: durationSky,      // Over 2000ms
            ease: "Sine.easeInOut",     // Nice and easy
            delay: 1000,                // 1000ms
        })
        this.tweens.add({               // Start a tween
            targets: underwater,        // Targeting the underwater animation
            scaleY: {                   // Set the Y scale 
                value: .8,              // Go from 1 to 0.8
                duration: durationSky,  // over 2000ms
            },
            y: {                        // Move in the y axis
                value:800,              // to 800 pixels
                duration: durationSky,  // over 2000ms
            },
            ease: "Sine.easeInOut",     // Do it dramatically
            delay: 1000,                // 2000ms after scene load
        })
        this.tweens.add({               // Start a tween
            targets: consume,           // Target the consume image
            alpha: 1,                   // Go from 0 to 1 alpha
            delay: 1700,                // 1.7 seconds after scene load
            duration: 600               // Over 600ms
        })
        this.tweens.add({               // Start a tween
            targets: evolve,            // Targeting the evolve image
            alpha: 1,                   // Go from 0 to 1 alpha
            delay: 2200,                // 2.2 seconds after scene load
            duration: 600               // Over 600ms
        })
        this.tweens.add({               // Start a tween
            targets: survive,           // Targeting the survive image
            alpha: 1,                   // Go from 0 to 1 alpha
            delay: 2700,                // 2.7 seconds after scene load
            duration: 1000              // over 1 second
        })
        this.tweens.add({               // Start a tween
            targets: pressKey,          // Targeting the pressKey text
            alpha: 1,                   // From 0 to 1 alpha
            delay: 3500,                // 3.5 seconds after scene load
            duration: 500,              // Lasts .5 seconds
            y: 765                      // Transition to 765 (just 15 pixels)
        })
        /*
        
        Instructions will go here

        */    
    }
    update(){
//================= Conditions for starting the game with/without touch controls ================
        if (this.input.activePointer.isDown){   // Did someone tap or click on the screen?
            touch = true;                       // Then activate touch controls
            this.scene.start('Gameplay')        // And start the show
        }
        this.input.keyboard.on('keydown', function(event){ // Did someone press a key on a keyboard?
            touch = false;                                 // Then no touch controls
            startGame = true;                              // And set the startgame var to true
        })
        if (startGame == true){                            // Is the startgame var true?
            this.scene.start('Gameplay')                   // Then start the show.
        }
    }
}