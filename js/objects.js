class Background extends Phaser.GameObjects.Image { // Creating a Preloader class as an extension of the scene.
  constructor (scene, x, y){                        // Calling the constructor to build it
    super (scene, x, y, 'background');              // And the super to call functions from the parent class. 
    this.setScale(4);                               // Set the scale of the background images
    this.setDepth(-5);                              // Set its depth so that it appears behind all other elements
  }
}
class BackgroundPlugin extends Phaser.Plugins.BasePlugin {     // Setting the background up as a plugin class
  constructor (pluginManager){                                 // Calling the constructor to build it                   
      super(pluginManager);                                    // And the super to call functions from the parent class.
      pluginManager.registerGameObject('background', this.createBackground); // Which is how it registers it as a plugin
  }
  createBackground (x, y){                                            // Create the background
      return this.displayList.add(new Background(this.scene, x, y));  // And add it to the scene display list in which it is called
  }
}

//================================== Physics enabled sprite classes ==================================
//========= Player sprite ( Adapted from Michael Hadleys example: https://codesandbox.io/s/5vlzl8j9vp?file=/js/player.js )
class Player extends Phaser.Physics.Matter.Sprite {        // Declare player sprite class as child of sprite class
	constructor(scene,x,y,texture) {                         // Call the constructor
    super(scene.matter.world, x, y, texture);               // Call the super with physics engine
    scene.sys.displayList.add(this);                       // Automatically add the sprite to the display list
    scene.sys.updateList.add(this);                        // Automatically add the sprite to the update list
    const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
    const { width: w, height: h } = this;                  // Declare some useful constants for dimensions
    const mainBody = Bodies.rectangle(8, (h * 0.5), 64, 40, { chamfer: { radius: 10 }, label: 'playerBody' }); // Create a constant for the main body hitbox
    this.sensors = {                                       // Declaring all of the sensors used on this sprite
      mouth: Bodies.circle((w * 0.5) + 20, h * 0.5, 18, { isSensor: true, label: 'mouth' }), // The mouth, used for eating and eventually biting
    };
    let bodyParts = {parts: [mainBody, this.sensors.mouth]};// Declaring a variable containing the basic parts of the player object
    if (playerUpgrades.head == 'spike'){                                                                                            // If the player has upgraded into a spike
      this.sensors.spike = Bodies.trapezoid((w * 0.5) + 20, h * 0.5, 12, 32, 1, { angle: 1.57 });                                // Put the physical spike in place
      this.sensors.spike2 = Bodies.trapezoid((w * 0.5) + 30, h * 0.5, 12, 32, 1, { isSensor: true, angle: 1.57, label: 'spike'}); // and the sensor
      bodyParts.parts.push(this.sensors.spike, this.sensors.spike2);                                                                 // And load it into the parts array
    }
    playerCompoundBody = Body.create(bodyParts);            // create a body from the parts.
    this                                                    // Context
      .setExistingBody(playerCompoundBody)                  //===== Applies the compoundBody defined above to the sprite
      .setFixedRotation()                                   //===== Sets inertia to infinity so the player can't rotate
      .setFrictionAir(baseFriction)                         //===== Set values for physics engine
      .setMass(baseMass);                                   //===== Set values for physics engine
  }
}

class Enemy extends Phaser.Physics.Matter.Sprite {         // Declare Enemy sprite class as child of sprite class
  constructor(scene, x, y, texture) {                      // Call the constructor
    super(scene.matter.world, x, y, texture);              // Call the super with physics engine
    scene.sys.displayList.add(this);                       // Automatically add the sprite to the display list
    scene.sys.displayList.add(this);                       // Automatically add the sprite to the update list
    const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
    const { width: w, height: h } = this;                  // Declare some useful constants for dimensions
    const enemyMainBody = Bodies.rectangle(8, (h * 0.5), 64, 40, { label: 'enemyBody', chamfer: { radius: 10 } }); // Create a constant for the main body hitbox
    if (enemyJaws == false){                               // if the jaws were selected as part of the random upgrade generation
      this.sensors = {                                     // Declaring all of the sensors used on this sprite
        mouth: Bodies.circle((w * 0.5) + 20, h * 0.5, 18, { isSensor: true, label: 'enemyMouth' }) // The mouth, used for eating and eventually biting
      };
    } else {
      this.sensors = {                                     // Declaring all of the sensors used on this sprite
        mouth: Bodies.circle((w * 0.5) + 20, h * 0.5, 18, { isSensor: true, label: 'enemyJaws' }) // The mouth, used for eating and eventually biting
      };
    }
    let bodyParts = {parts: [enemyMainBody, this.sensors.mouth]};// Declaring a variable containing the basic parts of the player object
    if (enemySpike == true){                                     // If the spike was selected as part of the random upgrade generation
      this.sensors.spike = Bodies.trapezoid((w * 0.5) + 20, h * 0.5, 12, 32, 1, { angle: 1.57 });                                      // Put the physical spike in place
      this.sensors.spike2 = Bodies.trapezoid((w * 0.5) + 30, h * 0.5, 12, 32, 1, { isSensor: true, angle: 1.57, label: 'enemySpike'}); // and the sensor
      bodyParts.parts.push(this.sensors.spike, this.sensors.spike2);                                                                      // And load it into the parts array
    }
    enemyCompoundBody = Body.create(bodyParts);         // create a body from the parts.
    this
      .setExistingBody(enemyCompoundBody)               //===== Applies the compoundBody defined above to the sprite
      .setFixedRotation()                               //===== Sets inertia to infinity so the player can't rotate
      .setFrictionAir(baseFriction)                     //===== Set values for physics engine
      .setMass(baseMass);                               //===== Set values for physics engine
  }
}

class Food extends Phaser.Physics.Matter.Sprite {       // Declare player sprite class as child of sprite class
  constructor(scene, x, y, texture) {                   // Calling the constructor to build it
    super(scene.matter.world, x, y, texture);           // And the super to call functions from the parent class. 
    scene.sys.displayList.add(this);                    // Automatically add the sprite to the display list
    scene.sys.displayList.add(this);                    // Automatically add the sprite to the update list
    this.label = 'food';                                // Give it a label to help functions recognize it                             
    this.setRandomPosition(-3440, -1860, 7680, 4320);   // When the food is added to the game, spread it around
  }
}

class Meat extends Phaser.Physics.Matter.Sprite {       // Declare player sprite class as child of sprite class
  constructor(scene, x, y, texture) {                   // Calling the constructor to build it
    super(scene.matter.world, x, y, texture);           // And the super to call functions from the parent class. 
    scene.sys.displayList.add(this);                    // Automatically add the sprite to the display list
    scene.sys.displayList.add(this);                    // Automatically add the sprite to the update list
    this.label = 'food';                                // Give it a label to help functions recognize it
  }
}

class Debris extends Phaser.Physics.Matter.Sprite {     // Declare player sprite class as child of sprite class
  constructor(scene, x, y, texture) {                   // Calling the constructor to build it
    super(scene.matter.world, x, y, texture);           // And the super to call functions from the parent class. 
    scene.sys.displayList.add(this);                    // Automatically add the sprite to the display list
    scene.sys.displayList.add(this);                    // Automatically add the sprite to the update list
    let tempNum = Math.random();                        // Randomly rotate each debris item
    this
      .setFrictionAir(0.005)                            // Make it react to physics normally
      .setMass(tempNum * 30)                            // Randomize its weight
      .setScale(tempNum * 2)                            // Randomize its size
      .setAlpha(0.5)                                    // Make it a little transparent
      .setAngle(tempNum * 360)                          // Randomly rotate it
      .setRandomPosition(-3440, -1860, 7680, 4320);     // Randomize its location
  }
}

class BGDebris extends Phaser.GameObjects.Image {       // Declare player sprite class as child of sprite class
  constructor(scene, x, y, texture) {                   // Calling the constructor to build it
    super(scene, x, y, texture);                        // And the super to call functions from the parent class. 
    scene.sys.displayList.add(this);                    // Automatically add the sprite to the display list
    scene.sys.displayList.add(this);                    // Automatically add the sprite to the update list
    let tempNum = Math.random();                        // Randomly rotate each debris item
    this
      .setScale(tempNum * 2)                            // Randomize its size
      .setAlpha(0.2)                                    // Make it a little transparent                                      
      .setRandomPosition(-3440, -1860, 7680, 4320)      // Randomize its location
      .setDepth(-4)                                     // Put it in the background
      .setAngle(tempNum * 360);                         // Randomize its rotation
  }
}