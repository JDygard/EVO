class Gameplay extends Phaser.Scene { 
    constructor() {
        super({ key: "Gameplay" });
    }

    
    preload() {
        // Preload virtual joystick plugin assets
        var rexURL;rexURL = '/js/rexvirtualjoystickplugin.min.js';
        this.load.plugin('rexvirtualjoystickplugin', rexURL, true);
        // Preload image assets
        console.log("gameplay preload");

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
            key: "player-idle",
            frames: this.anims.generateFrameNumbers("player-idle", { start: 0, end: 3 }),
            frameRate: 3,
        });

//================================== Building the play area ===============================================

        this.add.background(400, 300);                 //===== Set scene background                   = 
        player = new Player(this, 400,300,'player-idle');
        player.anims.play({
            key: "player-idle",
            repeat: -1
        })


//================================== Setting scene physics variables ======================================

        player.setFrictionAir(baseFriction);//===== Set values for physics engine
        player.setMass(baseMass);           //===== Set values for physics engine
        player.setFixedRotation();          //===== Set values for physics engine

//================================== Setting up the controls =============================================

        this.cameras.main.startFollow(player, true, 0.1, 0.1, 0, 0);//===== Set camera to follow player
        cursors = this.input.keyboard.createCursorKeys();           //===== Declare keyboard controls variable


        
        joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
            x: viewX -200,
            y: viewY -200,
            radius: 100,
            base: this.add.circle(0, 0, 100, 0x888888),
            thumb: this.add.circle(0, 0, 50, 0xcccccc),
            dir: '8dir'
        })
        .on('update', this.dumpJoyStickState, this);
        if (touch !== true) {
            joyStick.visible = false
        }
    }    
    
    dumpJoyStickState() {
        joystickControls = joyStick.createCursorKeys();
        leftKeyDown = joystickControls.left.isDown;
        rightKeyDown = joystickControls.right.isDown;
        upKeyDown = joystickControls.up.isDown;
        downKeyDown = joystickControls.down.isDown;
    }

    update(){

//================================= Listen for control inputs and execute movements ======================
//=====    Thanks to https://phaser.io/examples/v3/view/physics/matterjs/rotate-body-with-cursors    =====
//=====                           for the example code used here.                                    =====

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