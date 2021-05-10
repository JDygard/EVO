class Gameplay extends Phaser.Scene { 
    constructor() {
        super({ key: "Gameplay" });
    }

    preload() {
        // Preload image assets
    }

//================================== Declaring general use methods ================================
    makeBar(){
        healthBar = this.add.sprite(0, 0, 'healthbar').setScrollFactor(0).setDepth(5);
        healthBar.setDataEnabled();
        healthBar.data.set('evoPoints', 0)
        if (debugMode == true){
            healthBar.data.set('evoPoints', 9)
        }
        pointText = this.add.text(-45, 0, '', {fontFamily: '"Roboto Mono", sans serif'});
        pointText.setText(evoPoints).setScrollFactor(0).setColor('#264653').setDepth(6).setFontSize(36).setOrigin(.5);
        healthContainer = this.add.container(175, 100);
        healthContainer.add(pointText)
        healthContainer.add(healthBar)
        healthContainer.setScale(healthBarScale)
    }
    makeFood() {
        for (let i = 0; i < 30; i++){
            food[i] = new Food(this, 0, 0, 'food')
        }
        foodRemaining = 30;
    }
    findFood() {
        let distanceDecision = []
        let boof;
        let indexNumber;
        let nearestFood;
        let thisPos = {
            x: enemy1.x, 
            y: enemy1.y
            };
        for (let i = 0; i < food.length; i++){
            let foodPos = {
                x: food[i].x,
                y: food[i].y,
            }
            distanceDecision.push(Math.abs(thisPos.x - foodPos.x) + Math.abs(thisPos.y - foodPos.y))
        }
        for (let i = 0; i < distanceDecision.length; i++){
            if (boof == undefined){
                boof = distanceDecision[i]
            }
            if (distanceDecision[i] <= boof){
                boof = distanceDecision[i]
                indexNumber = distanceDecision.indexOf(boof)
                nearestFood = food[indexNumber]
                console.log(i + ': ' + indexNumber + ' at value ' + boof)
            }
        }
        enemy1.data.set('target', nearestFood)
    }
    makePlayer() {
        player = new Creature(this, 400, 300, 'base-player-idle');
        player.setDataEnabled();
        player.data.set('inMotion', false)
    }
    makeEnemy() {
        enemy1 = new Creature(this, 400, 400, 'base-player-moving')
        enemy1.anims.play({
            key: 'base-player-move',
            repeat: -1
        })
        enemy1.setDataEnabled();
        enemy1.data.set('target', 0)
    }
    create(){
        console.log("gameplay create")

//================================== Player animation definitions ========================================
        this.anims.create({
            key: "base-player-idle",
            frames: this.anims.generateFrameNumbers("base-player-idle", { start: 0, end: 3 }),
            frameRate: 3,
        });
        this.anims.create({
            key: "base-player-move",
            frames: this.anims.generateFrameNumbers("base-player-moving", { start: 0, end: 3 }),
            frameRate: 5,
        })
        this.anims.create({
            key: "spike-player-move",
            frames: this.anims.generateFrameNumbers("spike-player-move", { start: 0, end: 3})
        })

//================================== Building the play area ===============================================
        this.add.background(400, 300);                    // Set scene background                    
        this.makePlayer()                                 // Calling the Player method to create the player object
        player.anims.play({                               // Activating the idle animation of the player object
            key: currentIdleAnimation,                      // Key for the idle animation
            repeat: -1                                    // -1 for infinite repitition
        })

        this.makeFood()                                   // Initial food generation
        this.makeEnemy()
        this.findFood()
        var rotateTo = this.plugins.get('rexRotateTo').add(enemy1, {
            speed: 10
        });
        console.log(enemy1.data.get('target'))
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
                                foodSprite.label = 'eatenFood'              // Label the food in the mouth
                                for (let i = 0; i < food.length; i++){      // So that it can be found in the food array
                                    if (foodSprite.label == food[i].label){ // Compare the mouth food with the array 
                                        food.splice(i, 1)                   // Cut out the eaten food
                                        break                               // We're done here.
                                    }
                                }
                                foodSprite.destroy()                                        // Destroy the food
                                healthBar.data.values.evoPoints += 1;                       // Add an evoPoint
                                evoPoints += 1;
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

        // ================================== Joystick plugin =========================================
        joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, { //== Add the contents of our joystick plugin
            x: 1400,                                          //== Put it in the bottom-right
            y: 700,                                          //== corner for the thumb
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

    update(){  // Update method, executed every frame

//======================================= Calculate speed and activate the right animations ======================================
//=====                  Thanks to me for this kickass piece of code. No credit to anyone, I'm pretty                        =====
//=====                                                  proud of this bit.                                                  =====

        posX.unshift(player.x)                                                             // Put the current position of the
        posY.unshift(player.y)                                                             // player in the front of the array
        let oldPosX = posX.pop()                                                           // Save and pop off the last frame's
        let oldPosY = posY.pop()                                                           // position from the array.
        var speed = Math.round(Math.abs(posX[0] - oldPosX) + Math.abs(posY[0] - oldPosY)); // Compare the values to get the speed
        if (speed >= 1 && player.data.values.inMotion === false){ // If the player is in motion, and the tag isn't already true
            player.data.values.inMotion = true;                   // Set the tag to true
        }
        if (speed < 1 && player.data.values.inMotion === true){   // If the player is stopped, and the tag isn't already false
            player.data.values.inMotion = false;                  // set the tag to false
        }                                                       
        player.on('changedata-inMotion', function(){              // All so that this bit only triggers when the state changes
            if (player.data.values.inMotion === true){            // And if the tag just flipped to true,
                player.anims.play                                 // Play
                ({                                                // 
                    key: currentMoveAnimation,                    // the current move animation
                    repeat: -1,                                   // forever.
                })
                } else {                                          // Otherwise,
                    player.anims.play({                           // go back to
                        key: currentIdleAnimation,                // the current idle animation
                        repeat: -1,                               // forever.
                })
            }
        })

//============================== Listen for control inputs and execute movements ======================
//=====  Thanks to https://phaser.io/examples/v3/view/physics/matterjs/rotate-body-with-cursors   =====
//=====                     for the modified example code used here.                              =====

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
//============================== Enemy target acquisition, calculation and movement ===================
//=====
        enemy1.rotateTo.rotateTowardsPosition(nearestFood.x, nearestFood.y)

    }
}