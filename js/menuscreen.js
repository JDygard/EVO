class MenuScreen extends Phaser.Scene {
    constructor (){
        super('MenuScreen')
    }
    create(){
//=============================== Adding images ============================
        let sky = this.add.image(800, 160, "menu-sky")
        let water = this.add.image(800, 435, "menu-water")
        let underwater = this.add.sprite(800, 970, "menu-underwater")
        let blah = this.anims.create({
            key: "animated-water",
            frames: this.anims.generateFrameNumbers("animatedWater", { start: 0, end: 5 }),
            frameRate: 3,
        })
        let title = this.add.image(800, 300, "menu-title").setAlpha(0)
        let evolve = this.add.image(1240, 550, "menu-evolve").setAlpha(0);
        let consume = this.add.image(350, 550, "menu-consume").setAlpha(0);
        let survive = this.add.image(800, 650, "menu-survive").setAlpha(0);
        let pressKey = this.add.image(800, 750, "menu-press").setAlpha(0);
        let durationSky = 2000;
//=============================== Menu intro ==============================
        console.log(blah)
        underwater.anims.play({
            key: "animated-water",
            repeat: -1,
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
            targets: underwater,
            scaleY: {
                value: .8,
                duration: durationSky,
            },
            y: {
                value:800,
                duration: durationSky,
            },
            ease: "Sine.easeInOut",
            delay: 1000,
        })
        this.tweens.add({               // Start a tween
            targets: consume,
            alpha: 1,
            delay: 1700,
            duration: 600
        })
        this.tweens.add({               // Start a tween
            targets: evolve,
            alpha: 1,
            delay: 2200,
            duration: 600
        })
        this.tweens.add({               // Start a tween
            targets: survive,
            alpha: 1,
            delay: 2700,
            duration: 1000
        })
        this.tweens.add({               // Start a tween
            targets: pressKey,
            alpha: 1,
            delay: 3500,
            duration: 500,
            y: 765
        })
        /*
        
        button to show instructions scene
        ? button to show story screen

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