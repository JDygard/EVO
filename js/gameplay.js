class Gameplay extends Phaser.Scene { 
    constructor() {
        super({ key: "Gameplay" });
    }

    
    preload() {
        // Preload virtual joystick plugin assets
        //var matterCollisionURL; matterCollisionURL = "//cdn.jsdelivr.net/npm/phaser-matter-collision-plugin";
        //this.load.plugin('matterCollision', matterCollisionURL, true)
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
//================================== Building the play area ===============================================

        this.add.background(400, 300);                 //===== Set scene background                   = 
        //player = this.matter.add.sprite(400, 300, "amoeba");
        player = new Player(this, 400,300,'amoeba')


//================================== Setting scene physics variables ======================================

        player.setFrictionAir(baseFriction);//===== Set values for physics engine
        player.setMass(baseMass);           //===== Set values for physics engine
        player.setFixedRotation();          //===== Set values for physics engine

//================================== Setting up the controls =============================================

        this.cameras.main.startFollow(player, true, 0.1, 0.1, 0, 0);//===== Set camera to follow player
        cursors = this.input.keyboard.createCursorKeys();           //===== Declare keyboard controls variable

 /*       this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
                x: 400,
                y: 300,
                radius: 100,
                base: this.add.circle(0, 0, 100, 0x888888),
                thumb: this.add.circle(0, 0, 50, 0xcccccc),
                // dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
                // forceMin: 16,
                // enable: true
            })
            .on('update', this.dumpJoyStickState, this);
            this.text = this.add.text(0, 0);

            }    
            dumpJoyStickState() {
                var cursorKeys = this.joyStick.createCursorKeys();
                var s = 'Key down: ';
                for (var name in cursorKeys) {
                    if (cursorKeys[name].isDown) {
                        s += name + ' ';
                    }
                }
                s += '\n';
                s += ('Force: ' + Math.floor(this.joyStick.force * 100) / 100 + '\n');
                s += ('Angle: ' + Math.floor(this.joyStick.angle * 100) / 100 + '\n');
                this.text.setText(s);

*/
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