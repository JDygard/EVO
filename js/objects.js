class Background extends Phaser.GameObjects.Image {
  constructor (scene, x, y){
    super (scene, x, y, 'background');
    this.setScale(5);
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
    const mainBody = Bodies.rectangle((w * 0.5)-10, (h * 0.5), (w * 0.64) - 10, h * 0.33, { chamfer: { radius: 10 } }); // Create a constant for the main body hitbox
    this.sensors = {                                       // Declaring all of the sensors used on this sprite
      mouth: Bodies.circle((w * 0.5) + 20, h * 0.5, 18, { isSensor: true, label: 'mouth' }) // The mouth, used for eating and eventually biting
    };
    const compoundBody = Body.create({                     // Declaring the compoundBody containing all of the components of the Player sprite
     parts: [mainBody, this.sensors.mouth],                // The components.
    });
    this
      .setExistingBody(compoundBody)//===== Applies the compoundBody defined above to the sprite
      .setFixedRotation()           //===== Sets inertia to infinity so the player can't rotate
      .setFrictionAir(baseFriction) //===== Set values for physics engine
      .setMass(baseMass)            //===== Set values for physics engine
      .setFixedRotation()           //===== Set values for physics engine
  };
}


class Food extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, texture) {
    super(scene.matter.world, x, y, texture)
    scene.sys.displayList.add(this);
    scene.sys.displayList.add(this);
  }
}

class Enemy extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, texture) {
    super(scene.matter.world, x, y, texture)
    scene.sys.displayList.add(this);
    scene.sys.displayList.add(this);
  }
}

class Debris extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, texture) {
    super(scene.matter.world, x, y, texture)
    scene.sys.displayList.add(this);
    scene.sys.displayList.add(this);
  }
}

      
      
      
      //  this.scene = scene;
  
      // Create the animations we need from the player spritesheet
      /* const anims = scene.anims;
      anims.create({
        key: "player-idle",
        frames: anims.generateFrameNumbers("player", { start: 0, end: 3 }),
        frameRate: 3,
        repeat: -1
      });
      anims.create({
        key: "player-run",
        frames: anims.generateFrameNumbers("player", { start: 8, end: 15 }),
        frameRate: 12,
        repeat: -1
      });



      // Create the physics-based sprite that we will move around and animate
      this.sprite = scene.matter.add.sprite(0, 0, "amoeba", 0);
      // The player's body is going to be a compound body that looks something like this:
      //
      //                  A = main body
      //
      //                   +---------+
      //                   |         |
      //                 +-+         +-+
      //       B = left  | |         | |  C = right
      //    wall sensor  |B|    A    |C|  wall sensor
      //                 | |         | |
      //                 +-+         +-+
      //                   |         |
      //                   +-+-----+-+
      //                     |  D  |
      //                     +-----+
      //
      //                D = ground sensor
      //
      // The main body is what collides with the world. The sensors are used to determine if the
      // player is blocked by a wall or standing on the ground.
  
      const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
      const { width: w, height: h } = this.sprite;
      const mainBody = Bodies.rectangle(0, 0, w * 0.6, h, { chamfer: { radius: 10 } });
      this.sensors = {
        bottom: Bodies.rectangle(0, h * 0.5, w * 0.25, 2, { isSensor: true }),
        left: Bodies.rectangle(-w * 0.35, 0, 2, h * 0.5, { isSensor: true }),
        right: Bodies.rectangle(w * 0.35, 0, 2, h * 0.5, { isSensor: true })
      };
      const compoundBody = Body.create({
        parts: [mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right],
        frictionStatic: 0,
        frictionAir: 0.02,
        friction: 0.1
      });
      this.sprite
        .setExistingBody(compoundBody)
        .setScale(2)
        .setFixedRotation() // Sets inertia to infinity so the player can't rotate
        .setPosition(x, y);
  
      // Track which sensors are touching something
      this.isTouching = { left: false, right: false, ground: false };
  
      // Before matter's update, reset our record of which surfaces the player is touching.
      scene.matter.world.on("beforeupdate", this.resetTouching, this);
  
      scene.matterCollision.addOnCollideStart({
        objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
        callback: this.onSensorCollide,
        context: this
      });
      scene.matterCollision.addOnCollideActive({
        objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
        callback: this.onSensorCollide,
        context: this
      });
  
      // Track the keys
      const { LEFT, RIGHT, UP, A, D, W } = Phaser.Input.Keyboard.KeyCodes;
      this.leftInput = new MultiKey(scene, [LEFT, A]);
      this.rightInput = new MultiKey(scene, [RIGHT, D]);
      this.jumpInput = new MultiKey(scene, [UP, W]);
  
      this.scene.events.on("update", this.update, this);
    }
  
    onSensorCollide({ bodyA, bodyB, pair }) {
      // Watch for the player colliding with walls/objects on either side and the ground below, so
      // that we can use that logic inside of update to move the player.
      // Note: we are using the "pair.separation" here. That number tells us how much bodyA and bodyB
      // overlap. We want to teleport the sprite away from walls just enough so that the player won't
      // be able to press up against the wall and use friction to hang in midair. This formula leaves
      // 0.5px of overlap with the sensor so that the sensor will stay colliding on the next tick if
      // the player doesn't move.
      if (bodyB.isSensor) return; // We only care about collisions with physical objects
      if (bodyA === this.sensors.left) {
        this.isTouching.left = true;
        if (pair.separation > 0.5) this.sprite.x += pair.separation - 0.5;
      } else if (bodyA === this.sensors.right) {
        this.isTouching.right = true;
        if (pair.separation > 0.5) this.sprite.x -= pair.separation - 0.5;
      } else if (bodyA === this.sensors.bottom) {
        this.isTouching.ground = true;
      }
    }
  
    resetTouching() {
      this.isTouching.left = false;
      this.isTouching.right = false;
      this.isTouching.ground = false;
    }
  
    freeze() {
      this.sprite.setStatic(true);
    }
  
    update() {
      if (this.destroyed) return;
  
      const sprite = this.sprite;
      const velocity = sprite.body.velocity;
      const isRightKeyDown = this.rightInput.isDown();
      const isLeftKeyDown = this.leftInput.isDown();
      const isJumpKeyDown = this.jumpInput.isDown();
      const isOnGround = this.isTouching.ground;
      const isInAir = !isOnGround;

    }
  
    destroy() {}
  }
  */