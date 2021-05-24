const config = {
    type: Phaser.AUTO, // Lets the game select the graphics engine based on the device automatically
    width: 1600,
    height: 900,
    backgroundColor: '#00676C', // Sets the color of the background
    pixelArt: false, // Tell the graphics engine not to blur or anti-alias, in order to preserve the pixel art effect
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    plugins: {      //Declare plugins
        global: [
            { key: 'BackgroundPlugin', plugin: BackgroundPlugin, start: true },
        ],
    },
    physics: { // Selects a physics engine
        default: 'matter', // A physics engine with collisions and complex material interaction
        matter: { 
            
            /*debug: {

                showAxes: false,
                showAngleIndicator: true,
                angleColor: 0xe81153,

                showBroadphase: false,
                broadphaseColor: 0xffb400,

                showBounds: false,
                boundsColor: 0xffffff,

                showVelocity: true,
                velocityColor: 0x00aeef,

                showCollisions: true,
                collisionColor: 0xf5950c,
    
                showSeparations: false,
                separationColor: 0xffa500,

                showBody: true,
                showStaticBody: true,
                showInternalEdges: true,

                renderFill: false,
                renderLine: true,
    
                fillColor: 0x106909,
                fillOpacity: 1,
                lineColor: 0x28de19,
                lineOpacity: 1,
                lineThickness: 1,
    
                staticFillColor: 0x0d177b,
                staticLineColor: 0x1327e4,

                showSleeping: true,
                staticBodySleepOpacity: 1,
                sleepFillColor: 0x464646,
                sleepLineColor: 0x999a99,
    
                showSensors: true,
                sensorFillColor: 0x0d177b,
                sensorLineColor: 0x1327e4,
    
                showPositions: true,
                positionSize: 4,
                positionColor: 0xe042da,
    
                showJoint: true,
                jointColor: 0xe0e042,
                jointLineOpacity: 1,
                jointLineThickness: 2,
    
                pinSize: 4,
                pinColor: 0x42e0e0,
    
                springColor: 0xe042e0,
    
                anchorColor: 0xefefef,
                anchorSize: 4,
    
                showConvexHulls: true,
                hullColor: 0xd703d0
            },*/
            
            gravity: {
                x: 0,
                y: 0
            }
        }
    },    
    fps: {
        min: 10,
        target: 50,
        forceSetTimeOut: false,
        deltaHistory: 10
    },
    scene: [ // Declaring the key names for scenes
        Preloader,
        Gameplay,
        MenuScreen,
    ]
    
};


// ===================================== Game variables ====================================
// === This is where all of the constants for game elements can be adjusted in one place ===

// ==Debug mode : Turns off touch controls and menu scene for rapid testing
var debugMode = false;

// ==Rotation speed
const baseRotation = 0.055
const tailRotation = 0.069
const flagellumRotation = 0.03

// ==Acceleration
const baseSpeed = 0.03
const tailSpeed = 0.04
const flagellumSpeed = 0.048
const chitinSpeed = -0.005

// ==Fluid friction
const baseFriction = 0.1

// ==Player mass
const baseMass = 30

// RexUI function
const COLOR_PRIMARY = 0x634d0a;
const COLOR_LIGHT = 0xffd100;
const COLOR_DARK = 0x499689;        
var items = [
    {
        name: 'Head upgrades',
        children: [
            {
                name: 'Spike',
                children: [
                    { name: 'A predatory spike [10 points]' },
                ]
            },
            {
                name: 'Jaws',
                children: [
                    { name: 'A pair of jaws [8 points]' },
                ]
            },
        ]
    },
    {
        name: 'Body upgrades',
        children: [
            {
                name: 'Stiffened body',
                children: [
                    { name: 'Resistance to damage (Requires tail upgrade) [5 points]' },
                ]
            },
            {
                name: 'Chitinous body',
                children: [
                    { name: 'Chitinous body that resists damage at the cost of speed (Requires tail upgrade) [5 points]' },
                ]
            },
        ]
    },
    {
        name: 'Tail upgrades',
        children: [
            {
                name: 'Flagellum',
                children: [{
                    name: 'A long, thin tail capable of high speeds, but limited in terms of maneuverability [8 points]',
                }]
            },
            {
                name: 'Pseudofin',
                children: [
                    { name: 'A primitive fin which increases speed and maneuverability [10 points]' },
                ]
            },
        ]
    },    
    {
        name: 'Size upgrade',
        children: [
            {
                name: 'Increase size',
                children: [
                    { name: 'Evolve in round 4 to win [10 points]' },
                ]
            },
        ]
    },
];

var createMenu = function (scene, x, y, items, onClick) {
    var expandOrientation = 'y';
    var easeOrientation = 'y';
  
    var menu = scene.rexUI.add.menu({
        x: x,
        y: y,
        orientation: expandOrientation,
        // subMenuSide: 'right',

        items: items,
        createButtonCallback: function (item, i) {
            return scene.rexUI.add.label({
                background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_PRIMARY),
                text: scene.add.text(0, 0, item.name, {
                    fontSize: '20px'
                }),
                icon: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_DARK),
                space: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10,
                    icon: 10
                }
            })
        },

        // easeIn: 500,
        easeIn: {
            duration: 500,
            orientation: easeOrientation
        },

        // easeOut: 100,
        easeOut: {
            duration: 100,
            orientation: easeOrientation
        }

        // expandEvent: 'button.over'
    }).setScrollFactor(0);

    menu
        .on('button.over', function (button) {
            button.getElement('background').setStrokeStyle(1, 0xffffff);
        })
        .on('button.out', function (button) {
            button.getElement('background').setStrokeStyle();
        })
        .on('button.click', function (button) {
            onClick(button);
        })

    return menu;
}

var playerUpgrades = {
    head: 'none',
    body: 'none',
    tail: 'none'
}

// This is an array to house the keys for all of the animations. It is used by the animation-creating for-loop to efficiently name, create amd call animations.
// KEY: 0 = null/no other upgrades, J = jaws, S = spike, F = flagellum, T = tail, K = stiff skin, C = chitin, M = moving
var animationSetter = [
    '000','000M','J00','J00M','S00','S00M','00F','00FM','J0F','J0FM','S0F','S0FM','0KF','0KFM','0CF','0CFM','00T','00TM','J0T','J0TM','S0T','S0TM','0KT','0KTM','0CT','0CTM','JKF','JKFM','JCF','JCFM','SKF','SKFM','SCF','SCFM','JKT','JKTM','JCT','JCTM','SKT','SKTM','SCT','SCTM',
]
// ================================= Global Variables ====================================
// =========This is where the global variables for the game are being declared ===========
// General variables
var music;
var soundMute = false;
var timer = false; // A timer to avoid building a message queue
var round = 1; // Global variable for storing the current round
var gameText; // Global variable for accessing the center screen text element
var currentPlayerSpeed = baseSpeed; // global variable for storing the player's speed
var currentPlayerRotation = baseRotation; //Global variable for storing the player's rotation speed
var playerDead = false;
var newRound = false;
var deathScreen = false;
var player; // The player object
var playerHP = 10;     // Determines how durable the player is
var playerMaxHP = 10;  // Used to determine how to increment the energy bar
var referenceHP = 10;  // Used to determine if the HP total has changed between frames
var stepWidth; // The increment by which the health bar moves
var enemySpike = false; // A boolean to be flipped on while generating enemy gameObjects and flipped off immediately after
var enemyJaws = false;
var foodBit = 0; // Global variable for containing the amount of foodBits in the active scene
var food = [];  // An array for storing all instances of food for reference
var evoPoints = 0; // Global variable for managing the player's score in a round
var cursors; // Global variable for storing directional inputs
var healthBar; // The gameObject that displays the UI for the healthbar, evo points and dropdown evolution menu. Also stores most game values.
var healthBarScale = 1.5 // A handy place to adjust the scale of the healthbar
var energyMask;
var startGame = false // Keeps the listener for any key presses in the menu screen separate from the function that starts the game
var healthContainer; // A container that holds all of the graphics for the UI
var pointText; // The text displaying the current points value
var garbage; // A variable for temporarily storing gameObjects queued for deletion to avoid removing them from the game in the middle of functions
var enemyGroup = []  // An array for storing the actual instance of each enemy gameObject
var enemies = [   // An array for storing the current evolution stage of each enemy. The value of each being the name of the relevant animation for that stage
    'E000M',
    "E000M",
    "E000M",
];
console.log(enemies)
var posX = [0,0];
var posY = [0,0];
var moving = false;//Variable for testing if the player is in motion
var currentIdleAnimation = '000';  // Initial animation state for the player. "000" means no upgrades
var currentMoveAnimation = '000M'; // initial moving animation state for the player. "000" means no upgrades, "M" means this is the moving version of that sprite
var chitinPenalty = 0; // A variable for storing the speed penalty for the chitin upgrade
var spike = false; // Variable for testing whether the player has the spike part
var playerCompoundBody; //Object holding static body parts for the player
var enemyCompoundBody;  //Object holding the static body parts for the enemies
var debris = []; //Empty array for holding all the background debris

// Virtual joystick objects
var touch;
var joystickControls;
var joyStickKeys;
var joyStick;

// Variables for joyStick states
var leftKeyDown;
var rightKeyDown;
var upKeyDown;
var downKeyDown;
var spaceKey;

// Uses the config object keys to set the start conditions for the game
var game = new Phaser.Game(config);