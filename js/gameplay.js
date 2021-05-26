class Gameplay extends Phaser.Scene {       // Creating a Preloader class as an extension of the scene.
    constructor() {                         // Calling the constructor to build it.  
        super({ key: "Gameplay" });         // And the super to call functions from the parent class. 
    }

    preload() {
        this.load.scenePlugin({             // Set up the UI plugin
            key: 'rexuiplugin',             // For referencing it later
            url: 'js/rexuiplugin.min.js',   // And where it's being pulled from
            sceneKey: 'rexUI'               // And the sceneKey. I think this is unique to the rex plugin environment
        });
    }

//================================== Declaring general use methods ============================
// ============== Generate a mute button =============
    makeMuteButton(){                                                       // Method for making the mute button
        let muteButton = this.add.image(1500, 100, "mute-icon");            // Mute button
        let muteButtonOff = this.add.image(1500, 100, "mute-icon-off");     // Mute button
        var scene = this;                                                   // Context for event listeners
        muteButton                                                          // Edit the muteButton
            .setInteractive()                                               // Make it listen for clicks on the object itself
            .setDepth(5)                                                    // Put it on top of all other objects
            .setScrollFactor(0)                                             // It shouldn't move around
            .setScale(0.8)                                                  // Make it a little smaller
        if (soundMute == false){                                            // If the user hasn't muted sound in the menu screen
            muteButton.setAlpha(0.1);                                       // Make the X translucent
        }
        muteButtonOff                                                       // Modifying the sound icon
            .setDepth(4)                                                    // Put it in front of everything but the mute button
            .setScrollFactor(0)                                             // Fix it in the viewport
            .setScale(0.8)                                                  // Scale it slightly
        muteButton.on('pointerdown', function(){                            // Listen for a click
            if (soundMute == false){                                        // Check to see if we're muted already
                scene.sound.stopAll();                                      // Stop all the current sounds
                muteButton.setAlpha(1)                                      // Make the X visible
                soundMute = true;                                           // Make all sounds silent
                music.pause();                                              // Stop the music
            } else {
                muteButton.setAlpha(0.1)                                    // Make the X invisible again
                soundMute = false;                                          // Flip the mute button again
                music.play();                                               // Strike up the band!!
            }
        });
    }
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
            healthBar.data.set('evoPoints', 10);                        // If debug mode is on, the starting evo points is 10
            evoPoints = 10;                                             // And set that variable up too
        }
        pointText = this.add.text(-45, 0, '', {fontFamily: '"Roboto Mono", sans serif'}); // A place for points to be displayed
        pointText.setText(evoPoints)                                    // Displays the score  
            .setScrollFactor(0)                                         // Make the number static in the camera view
            .setColor('#264653')                                        // Text display color
            .setDepth(6)                                                // Depth of 6 keeps the score above everything else
            .setFontSize(36)                                            // Font size
            .setOrigin(0.5);                                             // Sets the origin to the middle of the text so that when the text increments above 10 it can be adjusted to fit.
        healthContainer = this.add.container(175, 100);                 // Create a container to hold all of the bar elements together
        healthContainer.add(pointText);                                 // Add the point text to the container
        healthContainer.add(healthBar);                                 // Add the health bar graphic to the container
        healthContainer.setScale(healthBarScale);                       // Scale all the elements together to a variable from game-settings.js.
        var scene = this,                                               // To get around the context issues within event listeners
        evoMenu = false;                                                // Set the menu as false so that it doesn't appear at random
        healthBar.on('pointerdown', function (pointer) {                // Listen for pointer
            if (evoMenu === false) {                                   // Test for undefined
                menuMovement = true;                                                                                // Restrict movement while menu is open
                evoMenu = createMenu(scene, healthContainer.x - 35, healthContainer.y + 35, items, function (button) { // If the pointer comes down on the healthbar, generate a menu
                    if (button.text == 'A predatory spike [10 points]'){                                            // If the player clicks this button
                        if (evoPoints >= 10 && playerUpgrades.head == 'none'){                                      // And they have enough points
                            playerUpgrades.head = 'spike';                                                          // put the selected upgrade into the array
                            scene.newRound();                                                                       // and start a new round
                        } else if (evoPoints <= 9){                                                                 // But if they don't have enough points
                            scene.showText('More food needed for that', 1500);                                      // Let them know
                            scene.playSound('denied');                                                              // Play a 'denied' sound
                        } else if (playerUpgrades.head != 'none'){
                            scene.showText('You have already upgraded your head', 1500);
                            scene.playSound('denied');                                                              // Play a 'denied' sound
                        }
                    }

                    if (button.text == 'A pair of jaws [8 points]'){                                                // If the player clicks this button
                        if (evoPoints >= 8 && playerUpgrades.head == 'none'){                                       // And they have enough points
                            playerUpgrades.head = 'jaws';                                                           // put the selected upgrade into the array
                            scene.newRound();                                                                       // and start a new round
                        } else if (evoPoints <= 7){                                                                 // But if they don't have enough points
                            scene.showText('More food needed for that', 1500);                                      // Let them know
                            scene.playSound('denied');                                                              // Play a 'denied' sound
                        } else if (playerUpgrades.head != 'none'){                                                  // If they already have a head upgrade
                            scene.showText('You have already upgraded your head', 1500);                            // Give them a message
                            scene.playSound('denied');                                                              // Play a 'denied' sound
                        }
                    }

                    if (button.text == 'Resistance to damage (Requires tail upgrade) [5 points]'){                  // If the player clicks this button
                        if (evoPoints >= 5 && playerUpgrades.tail !== 'none' && playerUpgrades.body == 'none'){     // And they have enough points AND a tail upgrade
                            playerUpgrades.body = 'stiff';                                                          // put the selected upgrade into the array
                            scene.newRound();                                                                       // and start a new round
                        } else if (evoPoints <= 4){                                                                 // But if they don't have enough points
                            scene.showText('More food needed for that', 1500);                                      // Let them know
                            scene.playSound('denied');                                                              // Play a 'denied' sound                                
                        } else if (playerUpgrades.tail == 'none'){                                                  // or if they don't have the requisite tail upgrade
                            scene.showText('You require a tail upgrade before a body upgrade', 1500);               // Let them know
                            scene.playSound('denied');                                                              // Play a 'denied' sound
                        } else if (playerUpgrades.head != 'none'){                                                  // If they already have a head upgrade
                            scene.showText('You have already upgraded your body', 1500);                            // Give them a message
                            scene.playSound('denied');                                                              // Play a 'denied' sound
                        }
                    }

                    if (button.text == 'Chitinous body that resists damage at the cost of speed (Requires tail upgrade) [5 points]'){                // If the player clicks this button
                        if (evoPoints >= 5 && playerUpgrades.tail !== 'none' && playerUpgrades.body == 'none'){     // And they have enough points AND a tail upgrade
                            playerUpgrades.body = 'chitin';                                                         // put the selected upgrade into the array
                            scene.newRound();                                                                       // and start a new round
                        } else if (evoPoints <= 4){                                                                 // But if they don't have enough points
                            scene.showText('More food needed for that', 1500);                                      // Let them know
                            scene.playSound('denied');                                                              // Play a 'denied' sound
                        } else if (playerUpgrades.tail == 'none'){                                                  // or if they don't have the requisite tail upgrade
                            scene.showText('You require a tail upgrade before a body upgrade', 1500);               // Let them know
                            scene.playSound('denied');                                                              // Play a 'denied' sound
                        } else if (playerUpgrades.body != 'none'){                                                  // If they already have a body upgrade                             
                            scene.showText('You have already upgraded your body', 1500);                            // Give them a message
                            scene.playSound('denied');                                                              // Play a 'denied' sound
                        }
                    }

                    if (button.text == 'A long, thin tail capable of high speeds, but limited in terms of maneuverability [8 points]'){                // If the player clicks this button
                        if (evoPoints >= 8 && playerUpgrades.tail == 'none'){                                       // And they have enough points
                            playerUpgrades.tail = 'flagellum';                                                      // put the selected upgrade into the array
                            scene.newRound();                                                                       // and start a new round
                        } else if (evoPoints <= 7){                                                                 // But if they don't have enough points
                            scene.showText('More food needed for that', 1500);                                      // Let them know
                            scene.playSound('denied');                                                              // Play a 'denied' sound
                        } else if (playerUpgrades.tail != 'none'){                                                  // If they already have a tail upgrade 
                            scene.showText('You have already upgraded your tail', 1500);                            // Give them a message                            
                            scene.playSound('denied');                                                              // Play a 'denied' sound
                        }
                    }

                    if (button.text == 'A primitive fin which increases speed and maneuverability [10 points]'){    // If the player clicks this button
                        if (evoPoints >= 10 && playerUpgrades.tail == 'none'){                                      // And they have enough points
                            playerUpgrades.tail = 'tail';                                                           // put the selected upgrade into the array
                            scene.newRound();                                                                       // and start a new round
                        } else if (evoPoints <= 9){                                                                 // But if they don't have enough points
                            scene.showText('More food needed for that', 1500);                                      // Let them know
                            scene.playSound('denied');                                                              // Play a 'denied' sound
                        } else if (playerUpgrades.tail != 'none'){                                                  // If they already have a tail upgrade 
                            scene.showText('You have already upgraded your tail', 1500);                            // Give them a message 
                            scene.playSound('denied');                                                              // Play a 'denied' sound
                        }
                    }

                    if (button.text == 'Evolve in round 4 to win [10 points]'){                                     // If the player clicks this button
                        if (round <= 3){                                                                            // If it's not the last round
                            scene.showText('You must evolve further before attempting this.', 1500);                // Give them a message
                            scene.playSound('denied');                                                              // Play a 'denied' sound
                        } else if (evoPoints <= 9) {                                                                // If they don't have enough points
                            scene.showText('More food needed for that', 1500);                                      // Give them a message
                            scene.playSound('denied');                                                              // Play a 'denied' sound
                        } else {
                            scene.youWin();                                                                         // Run the youWin() method
                        }
                    } 
                });

            } else if (!evoMenu.isInTouching(pointer)) {   //If the pointer comes down outside the boundary of the menu object
                evoMenu.collapse();                        // collapse the menu
                evoMenu = false;                           // and reset the variable
                menuMovement = false;                      // re-enable movement
            }
        }, this);                                       // context of the event listener started on line 44 above
    }
//============================= Upgrades ================================
    applyUpgrades(){                                        // A method for controlling upgrades and applying stat boosts
        currentIdleAnimation = '';                          // Clear the current idle animation code
        if (playerUpgrades.head == 'none'){                 // If there's no upgrade on the head
            currentIdleAnimation += '0';                    // then the first character is a 0
        } else if (playerUpgrades.head == 'spike'){         // If it's a spike
            currentIdleAnimation += 'S';                    // then it's S
        } else if (playerUpgrades.head == 'jaws'){          // if it's jaws
            currentIdleAnimation += 'J';                    // then it's J
        }

        if (playerUpgrades.body == 'none'){                 // If there's no upgrade on the body
            currentIdleAnimation += '0';                    // Then the second character is 0
        } else if (playerUpgrades.body == 'stiff'){         // If it's stiff body
            currentIdleAnimation += 'K';                    // Then it's a K
            playerHP = 18;                                  // Set upgrade HP
            playerMaxHP = 18;                               // And max hp
            referenceHP = 18;                               // and reference HP
        } else if (playerUpgrades.body == 'chitin'){        // If it's chitinous
            currentIdleAnimation += 'C';                    // Then it's a C
            chitinPenalty = chitinSpeed;                    // Apply the chitinSpeed penalty
            playerHP = 25;                                  // Set upgrade HP
            playerMaxHP = 25;                               // And max hp
            referenceHP = 25;                               // and reference HP
        }

        if (playerUpgrades.tail == 'none'){                 // If there's no upgrade on the tail
            currentIdleAnimation += '0';                    // Then the third character is a 0
        } else if (playerUpgrades.tail == 'tail'){          // If there's a tail upgrade
            currentIdleAnimation += 'T';                    // It's a T
            currentPlayerSpeed = tailSpeed;                 // And we adjust the player speed   
            currentPlayerRotation = tailRotation;           // and rotation
        } else if (playerUpgrades.tail == 'flagellum'){     // If there's a flagellum
            currentIdleAnimation += 'F';                    // it's an F
            currentPlayerSpeed = flagellumSpeed;            // And we adjust the speed
            currentPlayerRotation = flagellumRotation;      // and rotation
        }
        currentMoveAnimation = currentIdleAnimation + 'M';  // Now put an M on the of the movement variable to get the right animation code.
    }

// =============================== Food related methods ================================
// ===== Generate food and commit them to an array
    makeFood() {
        for (let i = 0; i < 30; i++){ //Iterate through 30 new food objects
            food[i] = new Food(this, 0, 0, 'food'); //Create each new food object and assign them to the array
        }
    }

//===== Method for selecting targets for enemies =====
    findFood() {                                        // Let's make a method to detect the nearest food bit
        if (food.length > 0){                           // First we make sure there's some food to find
            for (let i = 0; i < enemyGroup.length; i++){// A loop to run through the enemies
                let distanceDecision = [];              // An array to contain the distance to each food instance from the enemy
                let testNumber;                         // A throwaway variable to temporarily hold the distance for comparison
                let indexNumber;                        // A variable to hold the index number of the lowest distance
                let nearestFood;                        // A variable to hold the food instance nearest to the enemy
                let thisPos = {                         // A small object to hold the coordinates of the enemy
                    x: enemyGroup[i].x,                 // X coord
                    y: enemyGroup[i].y                  // Y coord
                    };
                for (let i = 0; i < food.length; i++){  // for loop to iterate through the food array
                    let foodPos = {                     // Create an object to hold the results
                        x: food[i].x,                   // Store the X coordinate of each food bit
                        y: food[i].y,                   // Store the Y coordinate of each food bit
                    };
                    distanceDecision.push(Math.abs(thisPos.x - foodPos.x) + Math.abs(thisPos.y - foodPos.y)); // Push the distances into an array
                }
                for (let i = 0; i < distanceDecision.length; i++){  //Iterate through the distance array
                    if (testNumber == undefined){                   // If there is no definiton for the variable (first iteration)
                        testNumber = distanceDecision[i];           // Set it to the 0 index
                    }                                               // Then compare the variable to each index in the array. 
                    if (distanceDecision[i] <= testNumber){         // If we find a lower distance value
                        testNumber = distanceDecision[i];           // Set the variable to the lower value
                        indexNumber = distanceDecision.indexOf(testNumber);    //Collect the index of that value  
                        nearestFood = food[indexNumber];            // And since the index for the distance array matches that of the food bit array, we can simply take the
                                                                    // same index from the food array and get the corresponding food bit, which is closest to the enemy.
                    }
                }
                let enemyArmed = enemyGroup[i].data.get('armed');   // Determine whether the enemy is armed
                if (enemyArmed == 1){                               // If they are armed
                    let playerDistance = Math.abs(thisPos.x - player.x) + Math.abs(thisPos.y - player.y); // Push the distances into an array
                    if (playerDistance <= testNumber *2){           // Then we're going to test for the player distance also
                        nearestFood = player;                       // And if the player is close, send it to the findTarget() method
                    }

                }
                enemyGroup[i].data.set('target', nearestFood);  // Now hand it off to the enemy gameobject
            }
        }
    }
//====================== Method for making the player object ==================
    makePlayer() {                                                  // Declare the makePlayer() method
        player = new Player(this, 400, 300, currentIdleAnimation);  // Create a new Player object
        player.setDataEnabled();                                    // Set the player object to accept data
        player.data.set('inMotion', false);                         // Save the inMotion state to the player
    }

//=============================== Method for generating enemy gameObjects =================
    makeEnemies() {                                                     // Declare the makeEnemies() method
        for (let i = 0; i < enemies.length; i++){                       // For loop for working throught then enemy loops
            //=============================== Generating random upgrades for enemies ==================
            let hp = 10;                                                // Enemy HP is 10 to start with
            let enemySpeed = baseSpeed;                                 // Set the speed initially to the baseSpeed
            let enemyRotation = baseRotation;                           // Set the rotation initially to the baseRotation
            let enemyChitin = 0;                                        // Set the chitin penalty to 0
            let enemyArmed = 0;                                         // Initially the enemy has no weapon
            let randomUpgrades = ['0','0','0'];                         // Configure an array to store the results
            for (let y = 0; y < round - 1; y++){                        // Iterate once for each elapsed round. Note that on round one, this does not fire
                let randomInt = Math.floor(Math.random() * 3);          // Generate a random number, 0, 1, or 2
                // Trying for head upgrade first on a 0
                if (randomInt == 0){                                    // If we get a 0
                    // Head upgrade
                    if (randomUpgrades[0] == '0'){                      // and if there is no head upgrade
                        let selectIt = Math.floor(Math.random() * 2);   // pick a 0 or 1
                        if (selectIt == 0){                             // if it's 0
                            randomUpgrades[0] = 'S';                    // set the code for spike
                            enemySpike = true;                          // Set a variable for letting the enemy generation know it needs a spike
                            enemyArmed = 1;                             // And enemyArmed lets the generation know that the enemy will be targeting players
                        } else {                                        // otherwise
                            randomUpgrades[0] = 'J';                    // set the code for jaws
                            enemyArmed = 1;                             // And enemyArmed lets the generation know that the enemy will be targeting players
                            enemyJaws = true;                           // Set a variable for letting the enemy generation know it needs to label the mouth a weapon
                        }
                    // Tail upgrade
                    } else if (randomUpgrades[2] == '0'){               // If there was a head upgrade, test if there is no tail and run the tail upgrade
                        let selectIt = Math.floor(Math.random() * 2);   // flip a coin
                        if (selectIt == 0){                             // If it's a 0
                            randomUpgrades[2] = 'T';                    // set the code for tail
                            enemySpeed = tailSpeed;                     // set the speed to tailspeed
                            enemyRotation = tailRotation;               // Set the rotation to tailrotation
                        } else {                                        // otherwise
                            randomUpgrades[2] = 'F';                    // code for flagellum
                            enemySpeed = flagellumSpeed;                // Set the speed to flagellumspeed
                            enemyRotation = flagellumRotation;          // set the rotation to flagellumreotation
                        }
                    // Body upgrade
                    } else {                                            // If all else fails
                        let selectIt = Math.floor(Math.random() * 2);   // Flip a coin
                        if (selectIt == 0){                             // if it's 0
                            randomUpgrades[1] = 'C';                    // apply code for chitin
                            enemyChitin = chitinSpeed;                  // Apply the penalty for the chitin skin
                        } else {                                        // otherwise
                            randomUpgrades[1] = 'K';                    // apply code for stiff skin
                        }
                    }
                }
                // Trying for a tail upgrade on a 1
                if (randomInt == 1){                                    // if it's a 1
                    // Try for tail upgrade
                    if (randomUpgrades[2] == '0'){                      // Check to see if there's already a tail
                        let selectIt = Math.floor(Math.random() * 2);   // Flip a coin
                        if (selectIt == 0){                             // If it's heads
                            randomUpgrades[2] = 'T';                    // Apply code for tail
                            enemySpeed = tailSpeed;                     // set the speed to tailspeed
                            enemyRotation = tailRotation;               // Set the rotation to tailrotation
                        } else {                                        // Otherwise
                            randomUpgrades[2] = 'F';                    // apply code for flagellum
                            enemySpeed = flagellumSpeed;                // Set the speed to flagellumspeed
                            enemyRotation = flagellumRotation;          // set the rotation to flagellumreotation
                        }
                    // Try for a head upgrade
                    } else if (randomUpgrades[0] == '0'){               // Check to see if there's already a head
                        let selectIt = Math.floor(Math.random() * 2);   // Flip a coin
                        if (selectIt == 0){                             // If it's heads
                            randomUpgrades[0] = 'S';                    // Apply spike code
                            enemySpike = true;                          // Set a variable for letting the enemy generation know it needs a spike
                            enemyArmed = 1;                             // And enemyArmed lets the generation know that the enemy will be targeting players
                        } else {                                        // otherwise
                            randomUpgrades[0] = 'J';                    // apply jaws code
                            enemyArmed = 1;                             // And enemyArmed lets the generation know that the enemy will be targeting players
                            enemyJaws = true;                           // Set a variable for letting the enemy generation know it needs to label the mouth a weapon
                        }
                    // Try for a body upgrade
                    } else {                                            // If all else fails
                        let selectIt = Math.floor(Math.random() * 2);   // flip a coin
                        if (selectIt == 0){                             // If it's heads
                            randomUpgrades[1] = 'C';                    // apply code for chitin
                            enemyChitin = chitinSpeed;                  // Apply the penalty for the chitin skin
                        } else {                                        // otherwise
                            randomUpgrades[1] = 'K';                    // apply stiff skin code
                        }
                    }
                }
                // Trying for a body upgrade on 2
                if (randomInt == 2){                                            // If it's a 2
                    // Try for a body upgrade
                    if (randomUpgrades[2] !== '0' && randomUpgrades[1] == '0'){ // First, double check that there's a required tail upgrade, and that there's no body upgrade
                        let selectIt = Math.floor(Math.random() * 2);           // flip a coin
                        if (selectIt == 0){                                     // If it's heads
                            randomUpgrades[1] = 'C';                            // Apply chitin code
                            enemyChitin = chitinSpeed;                          // Apply the penalty for the chitin skin
                        } else {                                                // otherwise
                            randomUpgrades[1] = 'K';                            // apply stiff skin code
                        }
                    // Try for a tail upgrade
                    } else if (randomUpgrades[2] == '0'){                       // If there's no tail already
                        let selectIt = Math.floor(Math.random() * 2);           // flip a coin
                        if (selectIt == 0){                                     // if it's heads
                            randomUpgrades[2] = 'T';                            // apply tail code
                            enemySpeed = tailSpeed;                             // set the speed to tailspeed
                            enemyRotation = tailRotation;                       // Set the rotation to tailrotation
                        } else {                                                // otherwise
                            randomUpgrades[2] = 'F';                            // apply flagellum code
                            enemySpeed = flagellumSpeed;                        // Set the speed to flagellumspeed
                            enemyRotation = flagellumRotation;                  // set the rotation to flagellumreotation
                        }
                    // try for a head upgrade
                    } else {                                                    // If all else fails
                        let selectIt = Math.floor(Math.random() * 2);           // flip a coin
                        if (selectIt == 0){                                     // If it's heads
                            randomUpgrades[0] = 'S';                            // Apply spike code
                            enemySpike = true;                                  // Set a variable for letting the enemy generation know it needs a spike
                            enemyArmed = 1;                                     // And enemyArmed lets the generation know that the enemy will be targeting players
                        } else {                                                // otherwise
                            randomUpgrades[0] = 'J';                            // apply jaws code
                            enemyArmed = 1;                                     // And enemyArmed lets the generation know that the enemy will be targeting players
                            enemyJaws = true;                                   // Set a variable for letting the enemy generation know it needs to label the mouth a weapon
                        }
                    }
                }
            }
            let currentMove = 'E' + randomUpgrades[0] + randomUpgrades[1] + randomUpgrades[2] + 'M'; // Build the code used to determine which animation to apply. 'E' for the enemy spritesheet, the 3 character code, then 'M' for moving
            // ==================================  END random upgrade generation ===============================
            enemyGroup[i] = new Enemy(this, 400, 400, enemies[i]);       // Build the gameObjects
            enemySpike = false;         // Reset the spike variable for the next enemy
            enemyJaws = false;          // Reset the jaws variable for the next enemy
            enemySpeed += enemyChitin;  // Apply the chitin skin penalty
            enemyGroup[i].anims.play({  // Start the animation
                key: currentMove,       // using the animation code
                repeat: -1,             // repeat ad infinitum
            });
            enemyGroup[i]
                .setDataEnabled()                       // enable the enemy to hold individual data
                .setRandomPosition(-500,-500,500,500);  // randomize start position slightly
            enemyGroup[i].data.set('jaws', enemyJaws);  // Let the enemy know he has jaws
            enemyGroup[i].data.set('armed', enemyArmed);// Let the enemy know he is armed
            enemyGroup[i].data.set('target', 0);        // Make space for the enemy to store target data
            enemyGroup[i].data.set('hp', hp);           // Set their starting HP
            enemyGroup[i].data.set('speed', enemySpeed);// Set their speed
            enemyGroup[i].data.set('rotation', enemyRotation);       // Set their rotation speed
        }
    }
// ============================================== END enemy gameObject method =================================

// =========================== moveToTarget() method ===================================
// ===== This takes the target from the findFood() method and uses it to orient    =====
// =====                 and move the enemy toward targets                         =====
    moveToTarget() {
        for (let i = 0; i < enemyGroup.length; i++){            // A for loop to go through all of the enemies
            let enemy = enemyGroup[i];                          // Save the enemy as a variable
            if (enemy.data !== undefined && food.length >= 1){  // Make sure there is information to process
                let enemySpeed = enemy.data.get('speed');       // Gather the speed information from the specific enemy
                let enemyRotation = enemy.data.get('rotation'); // Gather the rotation information from the specific enemy
                let target = enemy.data.get('target');          // Gather the target as determined in the findFood() method
                let angleToPointer = Phaser.Math.Angle.BetweenPoints(enemy, target);        // Gather the angle between the enemy and the target
                let angleDelta = Phaser.Math.Angle.Wrap(angleToPointer - enemy.rotation);   // Find the difference between the two angles
                enemy.thrust(enemySpeed);                       // The enemies are constantly moving forward
                if (Phaser.Math.Within(angleDelta, 0, 0.02)) {  // Figure out if the angle is within a certain range
                    enemy.rotation = angleToPointer;            // If it is, set the rotation to the correct angle
                    enemy.setAngularVelocity(0);                // And stop the rotation
                  } else {
                    enemy.setAngularVelocity(Math.sign(angleDelta) * enemyRotation);    // Otherwise, rotate the enemy toward the target
                }
            } else {
                this.findFood();                                // If the statement doesn't fire, try to find a new target
            }
        }
    }
// ============================== Game and round end methods ============================
    youWin() {                                                          // Declare youWin() method
        this.playSound('victory');                                      // Play a victory sound
        this.showText('Your evolutionary line was successful!', 4000);  // Show a message
        this.cameras.main.fadeOut(4000);                                // Fade the camera
        this.resetConditions();                                         // run resetConditions()
        setTimeout(() => { this.scene.start("MenuScreen"); }, 5000);    // After the fadeout, go back to the menú screen
    }

    youLose() {                                                         // Declare the youLose() method
        this.playSound('game-over');                                    // Play a loss song
        this.showText('Your evolutionary line was cut short', 4000);    // Display a message
        this.cameras.main.fadeOut(4000);                                // Fade the camera out
        this.resetConditions();                                         // run resetConditions()
        setTimeout(() => { this.scene.start("MenuScreen"); }, 5000);    // After the fadeout, go back to the menú screen
    }

    resetConditions(){                          // Declare resetConditions() method. This is housekeeping after the end of a game.
        round = 1;                              // Reset the round
        playerHP = 10;                          // Reset HP
        playerMaxHP = 10;                       // Reset maxhp
        referenceHP = 10;                       // reset referenceHP
        foodBit = 0;                            // reset the foodbit variable
        food = [];                              // reset the food array
        evoPoints = 0;                          // reset evo points
        currentPlayerRotation = baseRotation;   // Set the player to standard speed
        currentPlayerSpeed = baseSpeed;         // and standard rotation speed
        chitinPenalty = 0;                      // Reset the chitin penalty
        currentIdleAnimation = '000';           // Reset the idle animation
        currentMoveAnimation = '000M';          // reset the move animation
        scarceMessage = false;                  // Reset the message switch
        slainMessage = false;                   // reset the message switch
        playerUpgrades = {                      // reset the upgrades object
            head: 'none',
            body: 'none',
            tail: 'none'
        };
        music.stop();                           // Stop the music
    }

    newRound() {                                // Declare newRound() method. It's mostly housekeeping between rounds.
        music.stop();                           // Stop the music
        playerHP = 10;                          // Reset HP
        playerMaxHP = 10;                       // Reset maxhp
        referenceHP = 10;                       // reset referenceHP
        slainMessage = false;                   // Reset the message switch
        scarceMessage = false;                  // Reset the message switch
        if (debugMode == false){                // If debug mode isn't true
            evoPoints = 0;                      // Reset the evo points
            healthBar.data.set('evoPoints', 0); // Reset the evo points
        }
        round++;                                // Increment the round
        this.scene.start("Gameplay");           // Start the next round
    }

    showText(message, duration){            // A method for displaying text with the message and duration variables
        if (timer == false){                // Check if there is currently a message being displayed
            timer = true;                   // Show that there is current a message being displayed
            gameText.setText(message);      // Display the message
            this.tweens.add({               // Start a tween
                targets: gameText,          // Targeting the evolve image
                alpha: 1,                   // Go from 0 to 1 alpha
                duration: 600,              // Over 600ms
                yoyo: true,                 // "Yoyo" the message
                hold: duration,             // Hold it on display for the designated time
            });
            let scene = this;               // Maintain context for the timeout function
            setTimeout(() => {              // Make a timeout
                timer = false;              // Show that the message has been cleared from the screen
            }, duration + 1200);            // After the hold duration and both sides of the animation duration
        }
    }

    playSound(effect){                      // playSound() method, which surprisingly is used to play sounds
        let sound = this.sound.add(effect); // Store the sound
        sound.play({                        // Play the sound
            mute: soundMute                 // See if we need to mute it
        });
    }


    create(){                                   // The create method for setting up the scene
        music = this.sound.add('game-music');   // Save the music to a global variable
        music.play({                            // Play the music
            mute: false,                        // Just play it
            loop: true,                         // And loop it
        });
        if (soundMute == true){
            music.pause();
        }

        gameText = this.add.text(800, 340, '', {fontFamily: '"Luckiest Guy", sans serif'}); // Set up the text object for displaying messages to the user
        gameText                // The text object
            .setScrollFactor(0) // Make the text fixed in the viewport
            .setOrigin(0.5)     // Set the origin in the middle so it displays cleanly
            .setFontSize(40)    // Set the font size to a visible size
            .setColor(0xe60022) // The color for the text
            .setDepth(5)        // Set the depth to 5 so it appears in front of everything
            .setAlpha(0);       // Make it start invisible
        this.showText('Round ' + round, 2000);  // Use showText() to display the round number
        this.playSound('new-round');            // Play the new round sound

// ================= Setting up the energy bar in the healthBar object ================
// == Thanks to Emanuele Feronato for the simple tutorial on using masks for this ==
// == ref = https://www.emanueleferonato.com/2019/04/24/add-a-nice-time-bar-energy-bar-mana-bar-whatever-bar-to-your-html5-games-using-phaser-3-masks/
        let energyBar = this.add.sprite(207, 90, 'energybar')   // Make an energy bar
            .setDepth(6)                                        // Set the depth so it appears on top of everything
            .setScrollFactor(0)                                 // Fix it in viewport
            .setScale(1.5);                                     // Make it a little bigger :)
        energyMask = this.add.sprite(207, 90, 'energybar')      // Make a mask to hide some of the bar when the health is below max
            .setDepth(6)                                        // Set the depth so it appears on top of everything                                    
            .setScrollFactor(0)                                 // Fix it in viewport
            .setScale(1.5);                                     // Make it a little bigger :)
        energyMask.visible = false;                             // Make it invisble
        energyBar.mask = new Phaser.Display.Masks.BitmapMask(this, energyMask); // Make the mask act like a mask

//================================== Player animation definitions ========================================
        var scene = this;                                   // Context
        for (let i = 0; i < animationSetter.length; i++){   // Go through the animation array
            this.anims.create({                             // Create an animation
                key: animationSetter[i],                    // Give each set of 4 frames a code from the animationSetter array
                frames: scene.anims.generateFrameNumbers("player-master-spritesheet", { start: (i * 4), end: ((i * 4) + 3) }), // Select the correct 4 frames for each set
                frameRate: 4,                               // Give it the appropriate framerate
            });
        }

//=============================== Enemy animation definitions =======================================  
        for (let i = 1; i < animationSetter.length; i+=2){   // Go through the animation array
            this.anims.create({                              // Create an animation
                key: 'E' + animationSetter[i],               // Give each set of 4 frames a code from the animationSetter array. Put an E in front of it to denote Enemy, which are a different color
                frames: scene.anims.generateFrameNumbers("enemy-master-spritesheet", { start: (i * 4), end: ((i * 4) + 3) }), // Select the correct 4 frames for each set
                frameRate: 4,                                // Give it the appropriate framerate
            });
        }

//================================== Building the play area ===============================================
        this.add.background(400, 300);                    // Set scene background             
        this.applyUpgrades();                             // Run the applyUpgrades() function, which finds the right player upgrades and animations for player generation
        this.makePlayer();                                // Calling the Player method to create the player object
        player.anims.play({                               // Activating the idle animation of the player object
            key: currentIdleAnimation,                    // Key for the idle animation
            repeat: -1                                    // -1 for infinite repitition
        });

        this.makeFood();                                  // Initial food generation
        this.makeEnemies();                               // Initial enemy generation
        this.findFood();                                  // Tell the enemies to go find food or prey
        for (let i = 0; i < 16; i++){                     // A pair of loops to produce copies of the debris decoration
            new Debris(this, 0,0, 'debris' + i);
            new Debris(this, 0,0, 'debris' + i);
            new Debris(this, 0,0, 'debris' + i);
            new Debris(this, 0,0, 'debris' + i);
        }
        for (let i = 0; i < 16; i++){
            new BGDebris(this, 0,0, 'debris' + i);
            new BGDebris(this, 0,0, 'debris' + i);
            new BGDebris(this, 0,0, 'debris' + i);
            new BGDebris(this, 0,0, 'debris' + i);
        }
//================================== Building the UI ======================================
        this.makeMuteButton();                      // Generate the mute button
        this.makeBar();                             // Generate the healthbar
        healthBar.on('changedata-evoPoints', function (gameObject, value){  // When the evo points change
            evoPoints = healthBar.data.get('evoPoints');                    // Store the evopoints
            if (evoPoints == 10){                                           // If the evopoints is two digits
                pointText.setFontSize(22);                                  // Adjust the size
            }   
            pointText.setText(evoPoints);                                   // Otherwise, just display the number of points
        });

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
//================================================== Player-primary sensor interactions ==================================================
//================================================== Player Jaws damage stuff ================================================
                            if (sensorBody.label === 'mouth' && otherBody.label == 'enemyBody' && playerUpgrades.head == 'jaws'){
                                for (let i = 0; i < enemyGroup.length; i++){    // Iterate through the existing enemies
                                    let result = (otherSprite.x - enemyGroup[i].x) + (otherSprite.y - enemyGroup[i].y); // See how large the difference between the coordinates are
                                    if (result > -1 && result < 1 ){                                                    // See if the result is roughly 0
                                        let enemy = enemyGroup[i];                                                      // Variable for readability
                                        scene.playSound('crunch');
                                        enemy.setTint("0xff4646");                                                      // Make the enemy turn red
                                        setTimeout(function(){                                                          // Wait for a moment
                                            enemy.clearTint();                                                          // before removing the tint
                                        }, 75);                                                                         // 75ms
                                        let hp = enemy.data.get("hp");                                                  // Collect the current HP (hit point) value of the target
                                        hp -= 5;                                                                        // Knock 5 hp off
                                        enemy.data.set("hp", hp);                                                       // and set the enemy hp to the new value
                                    }
                                }
                            }
//============================================== Player Spike damage stuff ==============================================================
                            if (sensorBody.label === 'spike' && otherBody.label == 'enemyBody'){    // If the collision is between the player's spike and the enemy's body
                                    for (let i = 0; i < enemyGroup.length; i++){    // Iterate through the existing enemies
                                        let result = (otherSprite.x - enemyGroup[i].x) + (otherSprite.y - enemyGroup[i].y); // See how large the difference between the coordinates are
                                        if (result > -1 && result < 1 ){                                                    // See if the result is roughly 0
                                            let enemy = enemyGroup[i];                                                      // Variable for readability
                                            scene.playSound('hit');
                                            enemy.setTint("0xff4646");                                                      // Make the enemy turn red
                                            setTimeout(function(){                                                          // Wait for a moment
                                                enemy.clearTint();                                                          // before removing the tint
                                            }, 75);                                                                         // 75ms
                                            let hp = enemy.data.get("hp");                                                  // Collect the current HP (hit point) value of the target
                                            hp -= 3;                                                                        // Knock 3 hp off
                                            enemy.data.set("hp", hp);                                                       // and set the enemy hp to the new value
                                        }
                                    }
                                }
//============================================= Player eating food ==================================================================
                            if (sensorBody.label === 'mouth' && otherSprite.label == 'food'){ // If it's a mouth colliding with food
                                otherSprite.label = 'eatenFood';              // Label the food in the mouth
                                for (let i = 0; i < food.length; i++){      // So that it can be found in the food array
                                    if (otherSprite.label == food[i].label){ // Compare the mouth food with the array 
                                        scene.playSound('crunch');
                                        food.splice(i, 1);                   // Cut out the eaten food out of the array
                                        break;                               // We're done here.
                                    }
                                }
                                garbage = otherSprite;                                  // Flag the food for cleanup
                                healthBar.data.values.evoPoints += 1;                       // Add an evoPoint
                                evoPoints += 1;
                            }
//=========================================END PLAYER-PRIMARY SENSOR INTERACTIONS =================================================

//=========================================  Enemy-primary sensor interactions ====================================================
//========================================= Enemy jaw damage ========================================================
                            if (sensorBody.label === 'enemyJaws' && otherBody.label == 'playerBody'){
                                scene.playSound('crunch');
                                player.setTint("0xff4646");                                                       // Make the enemy turn red
                                setTimeout(function(){                                                          // Wait for a moment
                                    player.clearTint();                                                           // before removing the tint
                                }, 75);                                                                      // 75ms    
                                playerHP -= 5;
                                console.log(playerHP);
                            }
//========================================= Enemy spike damage =======================================================
                            if (sensorBody.label === 'enemySpike' && otherBody.label == 'playerBody'){
                                scene.playSound('hit');
                                player.setTint("0xff4646");                                                       // Make the enemy turn red
                                setTimeout(function(){                                                          // Wait for a moment
                                    player.clearTint();                                                           // before removing the tint
                                }, 75);                                                                          // 75ms
                                playerHP -= 3;
                            }
//============================================== Enemy eating food stuff ==========================================================
                            if ((sensorBody.label === 'enemyMouth' || sensorBody.label === 'enemyJaws') && otherSprite.label == 'food'){ // If it's an enemy's mouth colliding with food
                                otherSprite.label = 'eatenFood';              // Label the food in the mouth
                                for (let i = 0; i < food.length; i++){      // So that it can be found in the food array
                                    if (otherSprite.label == food[i].label){ // Compare the mouth food with the array 
                                        food.splice(i, 1);                   // Cut out the eaten food out of the array
                                        break;                              // We're done here.
                                    }
                                }
                                garbage = otherSprite;                   // Flag the food for cleanup
                                break;
                            }
                        }
                    }
                }
            });
            
//================================== Setting up the controls =============================================

        this.matter.world.setBounds(-3440, -1860, 7680, 4320);      //===== Don't let the player go out of bounds
        this.cameras.main.setBounds(-3440, -1860, 7680, 4320);      //===== Don't let the camera show out of bounds
        this.cameras.main.startFollow(player, true, 0.1, 0.1, 0, 0);//===== Set camera to follow player
        cursors = this.input.keyboard.createCursorKeys();           //===== Declare keyboard controls variable
    }

    update(){  // Update method, executed every frame
        if (food.length <= 0){                                      // If there's no food left
            if (scarceMessage == false){                            // If the scarce message hasn't already been shown
                scarceMessage = true;                               // Flip that switch
                this.showText('Food is growing scarce...', 1500);   // And show a message that food is growing scarce
            }
            food[0] = new Food(this, 0, 0, 'food');                 // Generate another food
            food[1] = new Food(this, 0, 0, 'food');                 // And another
        }

        if (enemyGroup.length <= 0){                                // If the enemies are dead
            if (slainMessage == false){                             // and if the slain message hasn't already been shown
                slainMessage = true;                                // Flip that switch
                this.showText('You have consumed all other creatures in the pool'); // Show a message that lets them know they've killed the rest
            }
        }
// ========== Healthbar and player death business conducted here =============
        if (playerHP >= 1){                                     // If the player has hp left
            stepWidth = energyMask.displayWidth / playerMaxHP;  // Figure out how much the bar should move for each point based on the max value
            if (playerHP !== referenceHP){                      // If the hp has changed since last update
                let lostHP = referenceHP - playerHP;            // Figure out how much it has changed
                referenceHP = playerHP;                         // Reset the expected hp
                energyMask.x -= lostHP * stepWidth;             // Move the mask
            }
        } else if (playerDead == false) {                       // If the player isn't already flagged as dead
            playerDead = true;                                  // Flag him as dead
            this.youLose();                                     // And run the youLose() method
        }
        
// ======================== Controlling for dead enemies =====================
        for (let i = 0; i < enemyGroup.length; i++){            // Run through the enemy ground
            if (enemyGroup[i].data !== undefined){              // If the information to be processed is there
                let hp = enemyGroup[i].data.get('hp');          // Save enemy hp to a variable
                if (hp <= 0){                                   // If the hp is gone
                    let deathTarget = enemyGroup[i];            // Get the target
                    enemyGroup.splice(i, 1);                    // Pop them out of the enemyGroup array
                    let foodX = deathTarget.x;                  // Figure out where to put a food drop
                    let foodY = deathTarget.y;                  // Figure out where to put a food drop
                    let deathTween = this.tweens.add({          // Start a tween
                        targets: deathTarget,                   // Targeting the pressKey text
                        scale: 0.7,                             // Shrink the dying enemy
                        duration: 180,                          // Lasts .5 seconds
                    });
                    setTimeout(() => {                          // Wait a second
                        garbage = deathTarget;                  // Then toss him in the TRASH
                    }, 200);                                    // after 200ms
                    setTimeout(() => {                          // Wait a bit
                            let deathFood = new Meat(this, foodX, foodY, 'meat');   // Then squirt out some bonus meat
                            food.push(deathFood);                                   // Put it in the food array
                            deathFood = new Meat(this, foodX, foodY, 'meat');       // Squirt out even more bonus meat
                            food.push(deathFood);                                   // Put that one in the array also
                    }, 250);                                                        // But only after 250ms
                }
            }
        }                  

// =============== Statement for destroying flagged gameObjects ================

        if (garbage != undefined){                      // If there's food to be destroyed
            if (garbage.label == 'eatenFood'){          // If it's food disappearing
                this.findFood();                        // Make all the enemies reset their food target
            }
            garbage.destroy();                          // And destroy the marked objects
            garbage = undefined;                        // Clean out the garbage can
        }

//======================================= Calculate speed and activate the right animations ======================================
//=====                  Thanks to me for this kickass piece of code. No credit to anyone, I'm pretty                        =====
//=====                                                  proud of this bit.                                                  =====
        posX.unshift(player.x);                                                             // Put the current position of the
        posY.unshift(player.y);                                                             // player in the front of the array
        let oldPosX = posX.pop();                                                           // Save and pop off the last frame's
        let oldPosY = posY.pop();                                                           // position from the array.
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
                });
            }
        });
//============================== Listen for control inputs and execute movements ======================
//=====  Thanks to https://phaser.io/examples/v3/view/physics/matterjs/rotate-body-with-cursors   =====
//=====                     for the modified example code used here.                              =====
        let thrustSpeed = currentPlayerSpeed + chitinPenalty;       // Calculate in the chitin movespeed penalty
        //============================== Touch controls =================================='
        var scene = this;                                           // Context
        var pointer = scene.input.activePointer;                    // A var for simplicity
        if (pointer.isDown && touch == true && menuMovement == false){                                             // If the pointer is down and touch is active
            var angleToPointer = Phaser.Math.Angle.Between(player.x, player.y, pointer.worldX, pointer.worldY); // Find the angle between the player and the pointer
            var angleDelta = Phaser.Math.Angle.Wrap(angleToPointer - player.rotation);                          // Find the difference in that angle and the player object's rotation
            if (Phaser.Math.Within(angleDelta, 0, 1)){      // If the angle is within a certain range
                player.thrust(thrustSpeed);                 // Make the player move forward
            }
            if (Phaser.Math.Within(angleDelta, 0, 0.02)) {  // If the angle is within a certain range
                player.rotation = angleToPointer;           // Set the correct angle
                player.setAngularVelocity(0);               // Stop the rotation
              } else {                                      // Otherwise
                player.setAngularVelocity(Math.sign(angleDelta) * currentPlayerRotation);   // Rotate toward the pointer at the correct speed
            }
        }

        //========================= Keyboard controls =======================
        if (touch == false && menuMovement == false){                    // If touch is off and the menu isn't open
            if (cursors.left.isDown)                                // If the user is pressing the left key
            {
                player.setAngularVelocity(-currentPlayerRotation);  // Rotate to the left
            }
            else if (cursors.right.isDown)                          // If the user is pressing the right key
            {
                player.setAngularVelocity(currentPlayerRotation);   // Rotate to the right
            }
            if (cursors.up.isDown)                                  // Is the user is pressing the up key
            {
                player.thrust(thrustSpeed);                         // Apply the calculated thrust speed
            }   
        }
//============================== Enemy target acquisition, calculation and movement ===================
//=====
        if (menuMovement == false){
            this.moveToTarget();                                        // run moveToTarget() once everything else is settled
        }
    }
}