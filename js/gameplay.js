class Gameplay extends Phaser.Scene { 
    constructor() {
        super({ key: "Gameplay" });
    }

    
    preload() {
        // Preload virtual joystick plugin assets
        var rexURL;rexURL = 'js/rexvirtualjoystickplugin.min.js';
        this.load.plugin('rexvirtualjoystickplugin', rexURL, true);
        // Preload image assets
        console.log("gameplay preload");


    }

//================================== Declaring general use methods ================================
    makeBar(){
        healthBar = this.add.sprite(0, 0, 'healthbar').setScrollFactor(0).setDepth(5);
        healthBar.setDataEnabled();
        healthBar.data.set('evoPoints', 0)
        if (debugMode == true){
            healthBar.data.set('evoPoints', 9)
        }
        pointText = this.add.text(-45, 0, 'blah blah blah', {fontFamily: '"Roboto Mono", sans serif'});
        pointText.setText(evoPoints).setScrollFactor(0).setColor('#264653').setDepth(6).setFontSize(36).setOrigin(.5);
        healthContainer = this.add.container(230, 100);
        healthContainer.add(pointText)
        healthContainer.add(healthBar)
        healthContainer.setScale(healthBarScale)
    }
    makeFood() {
        for (let i = 0; i < 30; i++){
            new Food(this, 0, 0, 'food')
        }
        foodRemaining = 30;
    }
    makePlayer() {
        player = new Creature(this, 400, 300, 'base-player-idle');
    }
    create(){
        console.log("gameplay create")


//================================== Declaring methods for later definition ==============================

/*      this.createPlayer();            //===== Method for making the player object                      =
        this.createFood();              //===== Method for generating edible plant matter                =
        this.createRock();              //===== Method for generating obstacles                          =
        this.enemyBehavior();           //===== Method for managing enemy behavior decisions             =

//================================== Creating class groups for easier management =========================

        this.rock = this.add.group()
        this.enemies = this.add.group()
        this.food = this.add.group()
*/
//================================== Declaring animations =================================================

// Player idle animation
        const idleAnimation = this.anims.create({
            key: "base-player-idle",
            frames: this.anims.generateFrameNumbers("base-player-idle", { start: 0, end: 3 }),
            frameRate: 3,
        });
        const movingAnimation = this.anims.create({
            key: "base-player-move",
            frames: this.anims.generateFrameNumbers("base-player-moving", { start: 0, end: 3 }),
            frameRate: 4,
        })

//================================== Building the play area ===============================================
        this.add.background(400, 300);                    //===== Set scene background                   = 
        this.makePlayer()                                 // Calling the Player method to create the player object
        player.anims.play({                               // Activating the idle animation of the player object
            key: "base-player-idle",                      // Key for the idle animation
            repeat: -1                                    // -1 for infinite repitition
        })

        this.makeFood()                                   // Initial food generation
        if (debugMode == true){                           // triple food during debug mode
            for (let i = 0; i < 30; i++){
                new Food(this, 0, 0, 'food')
            }
            for (let i = 0; i < 30; i++){
                new Food(this, 0, 0, 'food')
            }
        }

        for (let i = 0; i < 16; i++){                     // A pair of loops to produce copies of the debris decoration
            new Debris(this, 0,0, 'debris' + i)
            new Debris(this, 0,0, 'debris' + i)
            new Debris(this, 0,0, 'debris' + i)
            new Debris(this, 0,0, 'debris' + i)
        }
        
        for (let i = 0; i < 16; i++){
            new BGDebris(this, 0,0, 'debris' + i)
            new BGDebris(this, 0,0, 'debris' + i)
            new BGDebris(this, 0,0, 'debris' + i)
            new BGDebris(this, 0,0, 'debris' + i)
        }

//================================== Building the Evo bar ======================================
        this.makeBar()
        healthBar.on('changedata-evoPoints', function (gameObject, value){
            evoPoints = healthBar.data.get('evoPoints')
            if (evoPoints == 10){
                pointText.setFontSize(22)
                console.log("health bar reduce size")
            }
            pointText.setText(evoPoints);
        })

//========================== Setting up pair interactions with sensors ====================================
//======= Thanks to https://labs.phaser.io/edit.html?src=src/physics\matterjs\compound%20sensors.js =======
//=======                     for the code adapted into this section                                =======
        this.matter.world.on('collisionstart', function (event) { // Whenever two things collide,
            var pairs = event.pairs;                              // give them a useful nickname

                for (var i = 0; i < pairs.length; i++)            // Then check them all out
                {
                    var bodyA = pairs[i].bodyA;                   // To see if one of them
                    var bodyB = pairs[i].bodyB;                   // is one of our sensors

                    if (pairs[i].isSensor)                        // If there is a sensor
                    {
                        var foodBody;                             // Label for the non-sensor
                        var playerBody;                           // and for the sensor

                        if (bodyA.isSensor)                       // Then work out which one
                        {
                            foodBody = bodyB;                     // ISN'T the sensor
                            playerBody = bodyA;                   // and which one is
                        }
                        else if (bodyB.isSensor)
                        {
                            foodBody = bodyA;
                            playerBody = bodyB;
                        }

                        var playerSprite = playerBody.gameObject; // Now grab the game object
                        var foodSprite = foodBody.gameObject;     // for each of the colliders
                        if (foodSprite != null){
                            if (playerBody.label == 'mouth' && foodSprite.label == 'food'){ // If it's a mouth colliding with food
                                foodSprite.destroy()                  // Destroy the food
                                healthBar.data.values.evoPoints += 1;                       // Add an evoPoint
                                evoPoints += 1;
                                console.log(healthBar.data.values.evoPoints)                // And tell the console
                            }
                        }
                    }
                }
            });

//================================== Setting up the controls =============================================

        this.matter.world.setBounds(-4400, -2400, 9600, 5400);      //===== Don't let the player go out of bounds
        this.cameras.main.setBounds(-4400, -2400, 9600, 5400);      //===== Don't let the camera show out of bounds
        this.cameras.main.startFollow(player, true, 0.1, 0.1, 0, 0);//===== Set camera to follow player
        cursors = this.input.keyboard.createCursorKeys();           //===== Declare keyboard controls variable

        
        joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, { //== Add the contents of our joystick plugin
            x: viewX -200,                                          //== Put it in the bottom-right
            y: viewY -200,                                          //== corner for the thumb
            radius: 100,                                            //== and set the size
            base: this.add.circle(0, 0, 100, 0x888888),             //== Draw the outer circle
            thumb: this.add.circle(0, 0, 50, 0xcccccc),             //== and the inner one
            dir: '8dir'                                             //== Set it to collect 8 directions of info
        })
        .on('update', this.dumpJoyStickState, this);                //== Deliver the information to the controls
        if (touch !== true) {                                       //== Hide the joystick if the player is using keyboard controls
            joyStick.visible = false
        }

    }    
    
    dumpJoyStickState() {                                           //== Method to handle the output from the joystick
        joystickControls = joyStick.createCursorKeys();             //== plugin
        leftKeyDown = joystickControls.left.isDown;
        rightKeyDown = joystickControls.right.isDown;
        upKeyDown = joystickControls.up.isDown;
        downKeyDown = joystickControls.down.isDown;
    }

    update(){
//================================= Listen for control inputs and execute movements ======================
//=====    Thanks to https://phaser.io/examples/v3/view/physics/matterjs/rotate-body-with-cursors    =====
//=====                           for the example code used here.                                    =====


        this.input.keyboard.on("keydown-UP", function(){      //== Start playing the movement animation ==
            player.anims.play({                               //== when the player is moving forward    ==
                key: currentMoveAnimation,
                repeat: -1,
            })
        })         
        this.input.on("dragstart", function(){      //== Start playing the movement animation ==
            player.anims.play({                               //== when the player is moving forward    ==
                key: currentMoveAnimation,
                repeat: -1,
            })
            console.log("dragstart")
        })  
            this.input.keyboard.on("keyup-UP", function() {
            player.anims.play({
                key: currentIdleAnimation,
                repeat: -1,
            })
        })
            if (cursors.left.isDown || leftKeyDown)
        {
            player.setAngularVelocity(-baseRotation);
        }
        else if (cursors.right.isDown || rightKeyDown)
        {
            player.setAngularVelocity(baseRotation);
        }

        if (cursors.up.isDown || upKeyDown)
        {
            player.thrust(baseSpeed);
        }
    
    }
}