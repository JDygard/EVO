class Gameplay extends Phaser.Scene { 
    constructor() {
        super({ key: "Gameplay" });
    }

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'js/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }

//================================== Declaring general use methods ============================
//================================== The health bar ===========================================
//===== The healthbar gameObject carries a great deal more water than its graphic implies =====
//===== It keeps and displays the score, as well as housing the machinery for starting    =====
//===== new rounds, and displaying, purchasing, and rearranging code for new parts.       =====
    makeBar(){                                                          // the method called to generate the healthbar
        healthBar = this.add.sprite(0, 0, 'healthbar')                  // Instantiate the sprite for the bar
            .setScrollFactor(0)                                         // Make the bar static in the camera view
            .setDepth(5)                                                // A depth of 5 will keep it in front of everything else
            .setInteractive()                                           // Makes it so that the graphic for the bar can can be the target of listener events
            .setDataEnabled();                                          // Allows the healthbar to store data
        healthBar.data.set('evoPoints', 0);                             // Sets the beginning score to 0
        if (debugMode == true){                                         // Test for debug mode
            healthBar.data.set('evoPoints', 10)                         // If debug mode is on, the starting evo points is 10
        };
        pointText = this.add.text(-45, 0, '', {fontFamily: '"Roboto Mono", sans serif'}); // A place for points to be displayed
        pointText.setText(evoPoints)                                    // Displays the score  
            .setScrollFactor(0)                                         // Make the number static in the camera view
            .setColor('#264653')                                        // Text display color
            .setDepth(6)                                                // Depth of 6 keeps the score above everything else
            .setFontSize(36)                                            // Font size
            .setOrigin(.5);                                             // Sets the origin to the middle of the text so that when the text increments above 10 it can be adjusted to fit.
        healthContainer = this.add.container(175, 100);                 // Create a container to hold all of the bar elements together
        healthContainer.add(pointText);                                 // Add the point text to the container
        healthContainer.add(healthBar);                                 // Add the health bar graphic to the container
        healthContainer.setScale(healthBarScale);                       // Scale all the elements together to a variable from game-settings.js.
        var scene = this,                                               // To get around the context issues within event listeners
        menu = undefined;                                               // Set the menu as undefined so that it doesn't appear at random
        healthBar.on('pointerdown', function (pointer) {                // Listen for pointer
            if (menu === undefined) {                                   // Test for undefined
                menu = createMenu(scene, healthContainer.x - 35, healthContainer.y + 35, items, function (button) { // If the pointer comes down on the healthbar, generate a menu
                    if (button.text == 'A predatory spike [10 points]'){                // If the player clicks this button
                        if (evoPoints >= 10){                                           // And they have enough points
                            playerUpgrades.head = 'spike'                               // put the selected upgrade into the array
                            scene.newRound()                                            // and start a new round
                        } else if (evoPoints <= 9){                                     // But if they don't have enough points
                            //Print a message about not having enough points for this.  // Let them know
                        }

                    }
                    if (button.text == 'A pair of jaws [8 points]'){                // If the player clicks this button
                        if (evoPoints >= 8){                                           // And they have enough points
                            playerUpgrades.head = 'jaws'                               // put the selected upgrade into the array
                            scene.newRound()                                            // and start a new round
                        } else if (evoPoints <= 7){                                     // But if they don't have enough points
                            //Print a message about not having enough points for this.  // Let them know
                        }

                    }
                    if (button.text == 'Resistance to damage (Requires tail upgrade) [5 points]'){                // If the player clicks this button
                        if (evoPoints >= 5 && playerUpgrades.tail !== 'none'){                                    // And they have enough points AND a tail upgrade
                            playerUpgrades.body = 'stiff'                               // put the selected upgrade into the array
                            scene.newRound()                                            // and start a new round
                        } else if (evoPoints <= 4){                                     // But if they don't have enough points
                            //Print a message about not having enough points for this.  // Let them know
                        } else if (playerUpgrades.tail == 'none'){                      // or if they don't have the requisite tail upgrade
                            // Print a message about not having a tail upgrade     // Let them know
                        }

                    }
                    if (button.text == 'Chitinous body that resists damage at the cost of speed (Requires tail upgrade) [5 points]'){                // If the player clicks this button
                        if (evoPoints >= 5 && playerUpgrades.tail !== 'none'){                                           // And they have enough points AND a tail upgrade
                            playerUpgrades.head = 'chitin'                               // put the selected upgrade into the array
                            scene.newRound()                                            // and start a new round
                        } else if (evoPoints <= 4){                                     // But if they don't have enough points
                            //Print a message about not having enough points for this.  // Let them know
                        } else if (playerUpgrades.tail == 'none'){                      // or if they don't have the requisite tail upgrade
                            // Print a message about not having a tail upgrade  // Let them know
                        }

                    }
                    if (button.text == 'A long, thin tail capable of high speeds, but limited in terms of maneuverability [8 points]'){                // If the player clicks this button
                        if (evoPoints >= 8){                                           // And they have enough points
                            playerUpgrades.head = 'flagellum'                               // put the selected upgrade into the array
                            scene.newRound()                                            // and start a new round
                        } else if (evoPoints <= 7){                                     // But if they don't have enough points
                            //Print a message about not having enough points for this.  // Let them know
                        }

                    }
                    if (button.text == 'A primitive fin which increases speed and maneuverability [10 points]' && evoPoints >= 10){                // If the player clicks this button
                        if (evoPoints >= 10){                                           // And they have enough points
                            playerUpgrades.head = 'fin'                               // put the selected upgrade into the array
                            scene.newRound()                                            // and start a new round
                        } else if (evoPoints <= 9){                                     // But if they don't have enough points
                            //Print a message about not having enough points for this.  // Let them know
                        }

                    }
                    
                });
            } else if (!menu.isInTouching(pointer)) {   //If the pointer comes down outside the boundary of the menu object
                menu.collapse();                        // collapse the menu
                menu = undefined;                       // and reset the variable
            }
        }, this);                                       // context of the event listener started on line 44 above
    }

    applyUpgrades(){
        currentIdleAnimation = '';
        if (playerUpgrades.head == 'none'){
            currentIdleAnimation += '0'
        } else if (playerUpgrades.head == 'spike'){
            currentIdleAnimation += 'S'
        } else if (playerUpgrades.head == 'jaws'){
            currentIdleAnimation += 'J'
        }

        if (playerUpgrades.body == 'none'){
            currentIdleAnimation += '0'
        } else if (playerUpgrades.body == 'stiff'){
            currentIdleAnimation += 'K'
        } else if (playerUpgrades.body == 'chitin'){
            currentIdleAnimation += 'C'
        }

        if (playerUpgrades.tail == 'none'){
            currentIdleAnimation += '0';
        } else if (playerUpgrades.tail == 'tail'){
            currentIdleAnimation += 'T';
            currentPlayerSpeed = tailSpeed;
            currentPlayerRotation = tailRotation;
        } else if (playerUpgrades.tail == 'flagellum'){
            currentIdleAnimation += 'F';
            currentPlayerSpeed = flagellumSpeed;
            currentPlayerRotation = flagellumRotation;
        }
        currentMoveAnimation = currentIdleAnimation + 'M'
    }

// =============================== Food related methods ================================
// ===== Generate food and commit them to an array
    makeFood() {
        for (let i = 0; i < 30; i++){ //Iterate through 30 new food objects
            food[i] = new Food(this, 0, 0, 'food') //Create each new food object and assign them to the array
        }
        foodRemaining = 30; // Set a variable that hopefully will become deprecated
    }

//===== How do enemies find food?
    findFood() {                    // Let's make a method to detect the nearest food bit
        if (food.length > 0){       // First we make sure there's some food to find
            for (let i = 0; i < enemyGroup.length; i++){
                let distanceDecision = []   // An array to contain the distance to each food instance from the enemy
                let testNumber;                   // A throwaway variable to temporarily hold the distance for comparison
                let indexNumber;            // A variable to hold the index number of the lowest distance
                let nearestFood;            // A variable to hold the food instance nearest to the enemy
                let thisPos = {             // A small object to hold the coordinates of the enemy
                    x: enemyGroup[i].x,            // X coord
                    y: enemyGroup[i].y             // Y coord
                    };
                for (let i = 0; i < food.length; i++){ // for loop to iterate through the food array
                    let foodPos = { // Create an object to hold the results
                        x: food[i].x,   // Store the X coordinate of each food bit
                        y: food[i].y,   // Store the Y coordinate of each food bit
                    }
                    distanceDecision.push(Math.abs(thisPos.x - foodPos.x) + Math.abs(thisPos.y - foodPos.y)) // Push the distances into an array
                }
                for (let i = 0; i < distanceDecision.length; i++){ //Iterate through the distance array
                    if (testNumber == undefined){             // If there is no definiton for the variable
                        testNumber = distanceDecision[i]      // Set it to the 0 index
                    }                                   // Then compare the variable to each index in the array. 
                    if (distanceDecision[i] <= testNumber){   // If we find a lower distance value
                        testNumber = distanceDecision[i]      // Set the variable to the lower value
                        indexNumber = distanceDecision.indexOf(testNumber)    //Collect the index of that value  
                        nearestFood = food[indexNumber] // And since the index for the distance array matches that of the food bit array, we can simply take the
                                                        // same index from the food array and get the corresponding food bit, which is closest to the enemy.
                    }
                }
                enemyGroup[i].data.set('target', nearestFood)  // Now hand it off to the enemy gameobject
            }
        } else {
            this.newRound()
        }
    }
    makePlayer() {
        player = new Player(this, 400, 300, currentIdleAnimation);
        player.setDataEnabled();
        player.data.set('inMotion', false);
    }
    makeEnemies() {
        for (let i = 0; i < enemies.length; i++){
            let currentMove = enemies[i]
            enemyGroup[i] = new Enemy(this, 400, 400, enemies[i])
            enemyGroup[i].anims.play({
                key: currentMove,
                repeat: -1,
            })
            enemyGroup[i].setDataEnabled().setRandomPosition(-500,-500,500,500);
            enemyGroup[i].data.set('target', 0);
            enemyGroup[i].data.set('hp', 10)
        }
    }

    moveToTarget() {
        for (let i = 0; i < enemyGroup.length; i++){
            let enemy = enemyGroup[i]
            if (enemy.data !== undefined){
                let target = enemy.data.get('target');
                let angle1 = Phaser.Math.Angle.BetweenPoints(enemy, target);
                let angle2 = enemy.rotation
                let angle = angle1 - angle2
                if (angle > .4){
                    enemy.setAngularVelocity(baseRotation)
                } else if (angle > .1){
                    enemy.setAngularVelocity(baseRotation / 1.5)
                }
                if (angle < .4){
                    enemy.setAngularVelocity(-baseRotation)
                } else if (angle < .1){
                    enemy.setAngularVelocity(-baseRotation / 1.5)
                }
                if (Math.abs(angle) < Math.abs(6)){
                    enemy.thrust(baseSpeed)
                }
            }
        }
    }

    newRound() {
        this.scene.start("Gameplay")
    }
    create(){
//================================== Player animation definitions ========================================
    var scene = this;
    for (let i = 0; i < animationSetter.length; i++){
        this.anims.create({
            key: animationSetter[i],
            frames: scene.anims.generateFrameNumbers("player-master-spritesheet", { start: (i * 4), end: ((i * 4) + 3) }),
            frameRate: 4,
        })
    }
//=============================== Enemy animation definitions =======================================  
    for (let i = 1; i < animationSetter.length; i+=2){
        this.anims.create({
            key: 'E' + animationSetter[i],
            frames: scene.anims.generateFrameNumbers("enemy-master-spritesheet", { start: (i * 4), end: ((i * 4) + 3) }),
            frameRate: 4,
        })
    }

//================================== Building the play area ===============================================
        this.add.background(400, 300);                    // Set scene background             
        this.applyUpgrades()       
        this.makePlayer()                                 // Calling the Player method to create the player object
        player.anims.play({                               // Activating the idle animation of the player object
            key: currentIdleAnimation,                    // Key for the idle animation
            repeat: -1                                    // -1 for infinite repitition
        })

        this.makeFood()                                   // Initial food generation
        this.makeEnemies()
        this.findFood()
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
//======= This is all of the compound body sensor interactions in the game. Dealing damage, eating  =======
//=======                      food, flagging for destruction is all here.                          =======
        this.matter.world.on('collisionstart', function (event) { // Whenever two things collide,
            var pairs = event.pairs;                              // give them a useful nickname
                for (var i = 0; i < pairs.length; i++)            // Then check them all out
                {
                    var bodyA = pairs[i].bodyA;                   // To see if one of them
                    var bodyB = pairs[i].bodyB;                   // is one of our sensors

                    if (pairs[i].isSensor)                        // If there is a sensor
                    {
                        var otherBody;                             // Label for the non-sensor
                        var sensorBody;                           // and for the sensor

                        if (bodyA.isSensor)                       // Then work out which one
                        {
                            otherBody = bodyB;                     // ISN'T the sensor
                            sensorBody = bodyA;                   // and which one is
                        }
                        else if (bodyB.isSensor)
                        {
                            otherBody = bodyA;
                            sensorBody = bodyB;
                        }

                        var sensorSprite = sensorBody.gameObject; // Now grab the game object
                        var otherSprite = otherBody.gameObject;     // for each of the colliders
                        if (otherSprite != null){                 // Test to make sure the collision isn't with the game border, which causes a crash
//================================================== Jaws damage stuff ============================================================
                            if (sensorBody.label === 'mouth' && otherBody.label == 'enemyBody' && playerUpgrades.head == 'jaws'){
                                for (let i = 0; i < enemyGroup.length; i++){    // Iterate through the existing enemies
                                    let result = (otherSprite.x - enemyGroup[i].x) + (otherSprite.y - enemyGroup[i].y)  // See how large the difference between the coordinates are
                                    if (result > -1 && result < 1 ){                                                    // See if the result is roughly 0
                                        let enemy = enemyGroup[i];                                                      // Variable for readability
                                        let bounceAngle = Phaser.Math.Angle.BetweenPoints(player, enemy)                // Find the angle between the player and the target 
                                        let vec = new Phaser.Math.Vector2()                                             // Create a Vector2 vector in a variable
                                            .setToPolar(bounceAngle)                                                    // Store the angle in degrees
                                            .setLength(100)                                                             // Give the vector some more length
                                        enemy.setTint("0xff4646")                                                       // Make the enemy turn red
                                        setTimeout(function(){                                                          // Wait for a moment
                                            enemy.clearTint()                                                           // before removing the tint
                                        }, 75)                                                                          // 75ms
                                        let hp = enemy.data.get("hp");                                                  // Collect the current HP (hit point) value of the target
                                        hp -= 5;                                                                        // Knock 5 hp off
                                        enemy.data.set("hp", hp)                                                        // and set the enemy hp to the new value
                                    }
                                }
                            }
//============================================== Spike damage stuff ==============================================================
                            if (sensorBody.label === 'spike' && otherBody.label == 'enemyBody'){    // If the collision is between the player's spike and the enemy's body
                                    for (let i = 0; i < enemyGroup.length; i++){    // Iterate through the existing enemies
                                        let result = (otherSprite.x - enemyGroup[i].x) + (otherSprite.y - enemyGroup[i].y)  // See how large the difference between the coordinates are
                                        if (result > -1 && result < 1 ){                                                    // See if the result is roughly 0
                                            let enemy = enemyGroup[i];                                                      // Variable for readability
                                            let bounceAngle = Phaser.Math.Angle.BetweenPoints(player, enemy)                // Find the angle between the player and the target 
                                            let vec = new Phaser.Math.Vector2()                                             // Create a Vector2 vector in a variable
                                                .setToPolar(bounceAngle)                                                    // Store the angle in degrees
                                                .setLength(100)                                                             // Give the vector some more length
                                            enemy.setTint("0xff4646")                                                       // Make the enemy turn red
                                            setTimeout(function(){                                                          // Wait for a moment
                                                enemy.clearTint()                                                           // before removing the tint
                                            }, 75)                                                                          // 75ms
                                            let hp = enemy.data.get("hp");                                                  // Collect the current HP (hit point) value of the target
                                            hp -= 3;                                                                        // Knock 3 hp off
                                            enemy.data.set("hp", hp)                                                        // and set the enemy hp to the new value
                                        }
                                    }
                                }
//============================================== Enemy eating food stuff ==========================================================
                            if (sensorBody.label === 'enemyMouth' && otherSprite.label == 'food'){ // If it's an enemy's mouth colliding with food
                                otherSprite.label = 'eatenFood'              // Label the food in the mouth
                                for (let i = 0; i < food.length; i++){      // So that it can be found in the food array
                                    if (otherSprite.label == food[i].label){ // Compare the mouth food with the array 
                                        food.splice(i, 1)                   // Cut out the eaten food out of the array
                                        break                               // We're done here.
                                    }
                                }
                                garbage = otherSprite;                   // Flag the food for cleanup
                                break
                            }
//============================================= Player eating food ==================================================================
                            if (sensorBody.label === 'mouth' && otherSprite.label == 'food'){ // If it's a mouth colliding with food
                                otherSprite.label = 'eatenFood'              // Label the food in the mouth
                                for (let i = 0; i < food.length; i++){      // So that it can be found in the food array
                                    if (otherSprite.label == food[i].label){ // Compare the mouth food with the array 
                                        food.splice(i, 1)                   // Cut out the eaten food out of the array
                                        break                               // We're done here.
                                    }
                                }
                                garbage = otherSprite;                                  // Flag the food for cleanup
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
//===================================================================================================================


//===================================================================================================================
    }    
    
    dumpJoyStickState() {                                           //== Method to handle the output from the joystick
        joystickControls = joyStick.createCursorKeys();             //== plugin
        leftKeyDown = joystickControls.left.isDown;
        rightKeyDown = joystickControls.right.isDown;
        upKeyDown = joystickControls.up.isDown;
        downKeyDown = joystickControls.down.isDown;
    }

    update(){  // Update method, executed every frame
// ======================== Controlling for dead enemies =====================
        for (let i = 0; i < enemyGroup.length; i++){
            if (enemyGroup[i].data !== undefined){
                let hp = enemyGroup[i].data.get('hp')
                if (hp <= 0){
                    garbage = enemyGroup[i];
                    enemyGroup.splice(i, 1)
                }
            }
        }                  

// =============== Statement for destroying flagged gameObjects ================

        if (garbage != undefined){                      // If there's food to be destroyed
            if (garbage.label = 'eatenFood'){           // If it's food disappearing
                this.findFood()                            // Make all the enemies reset their food target
            }
            garbage.destroy()                           // And destroy the marked objects
            garbage = undefined;
        }

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
                });
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
            player.setAngularVelocity(-currentPlayerRotation);
        }
        else if (cursors.right.isDown || rightKeyDown)
        {
            player.setAngularVelocity(currentPlayerRotation);
        }
        if (cursors.up.isDown || upKeyDown)
        {
            player.thrust(currentPlayerSpeed);
        }   
//============================== Enemy target acquisition, calculation and movement ===================
//=====
        this.moveToTarget()
    }
}