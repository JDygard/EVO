class Background extends Phaser.GameObjects.Image {
  constructor (scene, x, y){
    super (scene, x, y, 'background');
    this.setScale(5);
    this.setDepth(-5);
  }
}
class BackgroundPlugin extends Phaser.Plugins.BasePlugin {
  constructor (pluginManager){
      super(pluginManager);
      pluginManager.registerGameObject('background', this.createBackground);
  }
  createBackground (x, y){
      return this.displayList.add(new Background(this.scene, x, y));
  }
}

//================================== Physics enabled sprite classes ==================================
//========= Player sprite ( Adapted from Michael Hadleys example: https://codesandbox.io/s/5vlzl8j9vp?file=/js/player.js )
class Player extends Phaser.Physics.Matter.Sprite {        // Declare player sprite class as child of sprite class
	constructor(scene,x,y,texture) {                         // Call the constructor
    super(scene.matter.world, x, y, texture)               // Call the super with physics engine
    scene.sys.displayList.add(this);                       // Automatically add the sprite to the display list
    scene.sys.updateList.add(this);                        // Automatically add the sprite to the update list
    const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
    const { width: w, height: h } = this;                  // Declare some useful constants for dimensions
    const mainBody = Bodies.rectangle(8, (h * 0.5), 64, 40, { chamfer: { radius: 10 }, label: 'playerBody' }); // Create a constant for the main body hitbox
    this.sensors = {                                       // Declaring all of the sensors used on this sprite
      mouth: Bodies.circle((w * 0.5) + 20, h * 0.5, 18, { isSensor: true, label: 'mouth' }), // The mouth, used for eating and eventually biting
    };
    let bodyParts = {parts: [mainBody, this.sensors.mouth]}// Declaring a variable containing the basic parts of the player object
    if (playerUpgrades.head == 'spike'){                                                                                            // If the player has upgraded into a spike
      this.sensors.spike = Bodies.trapezoid((w * 0.5) + 20, h * 0.5 -3, 12, 32, 1, { angle: 1.57 });                                // Put the physical spike in place
      this.sensors.spike2 = Bodies.trapezoid((w * 0.5) + 30, h * 0.5 -3, 12, 32, 1, { isSensor: true, angle: 1.57, label: 'spike'}) // and the sensor
      bodyParts.parts.push(this.sensors.spike, this.sensors.spike2)                                                                 // And load it into the parts array
    }
    playerCompoundBody = Body.create(bodyParts);           // create a body from the parts.
    this
      .setExistingBody(playerCompoundBody)//===== Applies the compoundBody defined above to the sprite
      .setFixedRotation()           //===== Sets inertia to infinity so the player can't rotate
      .setFrictionAir(baseFriction) //===== Set values for physics engine
      .setMass(baseMass)            //===== Set values for physics engine
  };
}

class Enemy extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, texture) {
    super(scene.matter.world, x, y, texture)
    scene.sys.displayList.add(this);
    scene.sys.displayList.add(this);    
    const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
    const { width: w, height: h } = this;                  // Declare some useful constants for dimensions
    const enemyMainBody = Bodies.rectangle(8, (h * 0.5), 64, 40, { label: 'enemyBody', chamfer: { radius: 10 } }); // Create a constant for the main body hitbox
    if (enemyJaws == false){
      this.sensors = {                                       // Declaring all of the sensors used on this sprite
        mouth: Bodies.circle((w * 0.5) + 20, h * 0.5, 18, { isSensor: true, label: 'enemyMouth' }) // The mouth, used for eating and eventually biting
      };
    } else {
      this.sensors = {                                       // Declaring all of the sensors used on this sprite
        mouth: Bodies.circle((w * 0.5) + 20, h * 0.5, 18, { isSensor: true, label: 'enemyJaws' }) // The mouth, used for eating and eventually biting
      };
    }
    let bodyParts = {parts: [enemyMainBody, this.sensors.mouth]}
    if (enemySpike == true){
      this.sensors.spike = Bodies.trapezoid((w * 0.5) + 20, h * 0.5 -3, 12, 32, 1, { angle: 1.57 });
      this.sensors.spike2 = Bodies.trapezoid((w * 0.5) + 30, h * 0.5 -3, 12, 32, 1, { isSensor: true, angle: 1.57, label: 'enemySpike'})
      bodyParts.parts.push(this.sensors.spike, this.sensors.spike2)
    }
    enemyCompoundBody = Body.create(bodyParts);
    this
      .setExistingBody(enemyCompoundBody)//===== Applies the compoundBody defined above to the sprite
      .setFixedRotation()           //===== Sets inertia to infinity so the player can't rotate
      .setFrictionAir(baseFriction) //===== Set values for physics engine
      .setMass(baseMass)            //===== Set values for physics engine
  }
}

class Food extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, texture) {
    super(scene.matter.world, x, y, texture)
    scene.sys.displayList.add(this);
    scene.sys.displayList.add(this);
    this.label = 'food'
    this.setRandomPosition(-4400, -2400, 9600, 5400);
  }
}

class Meat extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, texture) {
    super(scene.matter.world, x, y, texture)
    scene.sys.displayList.add(this);
    scene.sys.displayList.add(this);
    this.label = 'food'
  }
}



class Debris extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, texture) {
    super(scene.matter.world, x, y, texture)
    scene.sys.displayList.add(this);
    scene.sys.displayList.add(this);
    let tempNum = Math.random()
    this
      .setFrictionAir(0.005)
      .setMass(tempNum * 30)
      .setScale(tempNum * 2)
      .setAlpha(.5)
      .setAngle(tempNum * 360)
      .setRandomPosition(-4400, -2400, 9600, 5400)
  }
}

class BGDebris extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture)
    scene.sys.displayList.add(this);
    scene.sys.displayList.add(this);
    let tempNum = Math.random()
    this
      .setScale(tempNum * 2)
      .setAlpha(.2)
      .setRandomPosition(-4400, -2400, 9600, 5400)
      .setDepth(-4)
      .setAngle(tempNum * 360);
  }
}