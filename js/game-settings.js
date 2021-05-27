const config = {
    type: Phaser.AUTO,          // Lets the game select the graphics engine based on the device automatically
    width: 1600,                // Set the canvas width
    height: 900,                // Set the canvas width
    backgroundColor: '#00676C', // Sets the color of the background
    pixelArt: false,            // Tell the graphics engine not to blur or anti-alias, in order to preserve the pixel art effect
    scale: {
        mode: Phaser.Scale.FIT, // Scale the canvas to fit the viewport, while maintaining the aspect ratio
        autoCenter: Phaser.Scale.CENTER_BOTH    // Center the canvas
    },
    plugins: {                  //Declare plugins
        global: [
            { key: 'BackgroundPlugin', plugin: BackgroundPlugin, start: true }, // The weird stuff I did to make a background when I didn't know what was going on
        ],
    },
    physics: {              // Selects a physics engine
        default: 'matter',  // A physics engine with collisions and complex material interaction
        matter: {           // Configure the physics engine
            gravity: {      // Set the gravity
                x: 0,       // To nothing
                y: 0        // To nothing
            }
        }
    },    
    fps: {                      // Try to control the fps
        min: 10,                // Minimum value
        target: 50,             // Aim for 50 fps
        forceSetTimeOut: false, // Control how the game times out
        deltaHistory: 10        // Using the last 10 frames to determine the fps
    },
    scene: [                    // Declaring the key names for scenes
        Preloader,              // Declare the preloader scene
        Gameplay,               // declare the gameplay scene
        MenuScreen,             // declare the menuscreen scene
    ]
    
};


// ===================================== Game variables ====================================
// === This is where all of the constants for game elements can be adjusted in one place ===

// ==Debug mode : Turns off touch controls and menu scene for rapid testing
var debugMode = false;          // Set the debug mode to false

// ==Rotation speed
const baseRotation = 0.055;     // Set the base rotation value
const tailRotation = 0.069;     // Set the rotation value for the tail upgrade
const flagellumRotation = 0.03; // Set the rotation value for the flagellum upgrade

// ==Acceleration
const baseSpeed = 0.03;         // Set the base speed value
const tailSpeed = 0.04;         // Set the speed value for the tail upgrade
const flagellumSpeed = 0.048;   // Set the speed value for the flagellum upgrade
const chitinSpeed = -0.005;     // Set the penalty to speed for upgrade to the chitin skin

// ==Fluid friction
const baseFriction = 0.1;       // Set the friction for the physics engine

// ==Player mass
const baseMass = 30;            // Set the base mass for the physics engine

//====================================== RexUI Plugin =====================================
//=== Thanks to https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-overview/   ===
//===                   For the skeleton of the code used here below                    ===
const COLOR_PRIMARY = 0x634d0a; // A color variable
const COLOR_LIGHT = 0xffd100;   // A color variable
const COLOR_DARK = 0x499689;    // a color variable
var items = [                   // An array to hold information for the menu plugin
    {
        name: 'Head upgrades',  // The name that will be displayed in the menu
        children: [
            {
                name: 'Spike',  // The name that will be displayed in the menu
                children: [
                    { name: 'A predatory spike [10 points]' },
                ]
            },
            {
                name: 'Jaws',  // The name that will be displayed in the menu
                children: [
                    { name: 'A pair of jaws [8 points]' },  // The name that will be displayed in the menu
                ]
            },
        ]
    },
    {
        name: 'Body upgrades',  // The name that will be displayed in the menu
        children: [
            {
                name: 'Stiffened body',  // The name that will be displayed in the menu
                children: [
                    { name: 'Resistance to damage (Requires tail upgrade) [5 points]' },  // The name that will be displayed in the menu
                ]
            },
            {
                name: 'Chitinous body',  // The name that will be displayed in the menu
                children: [
                    { name: 'Chitinous body that resists damage at the cost of speed (Requires tail upgrade) [5 points]' },  // The name that will be displayed in the menu
                ]
            },
        ]
    },
    {
        name: 'Tail upgrades',  // The name that will be displayed in the menu
        children: [
            {
                name: 'Flagellum',  // The name that will be displayed in the menu
                children: [{
                    name: 'A long, thin tail capable of high speeds, but limited in terms of maneuverability [8 points]',  // The name that will be displayed in the menu
                }]
            },
            {
                name: 'Pseudofin',  // The name that will be displayed in the menu
                children: [
                    { name: 'A primitive fin which increases speed and maneuverability [10 points]' },  // The name that will be displayed in the menu
                ]
            },
        ]
    },    
    {
        name: 'Size upgrade',  // The name that will be displayed in the menu
        children: [
            {
                name: 'Increase size',  // The name that will be displayed in the menu
                children: [
                    { name: 'Evolve in round 4 to win [10 points]' },  // The name that will be displayed in the menu
                ]
            },
        ]
    },
];

var createMenu = function (scene, x, y, items, onClick) { // Create the function that will call the menu objects
    var expandOrientation = 'y';    // Variable for easy adjustment
    var easeOrientation = 'y';      // Variable for easy adjustment
  
    var menu = scene.rexUI.add.menu({   // Use the UI to add the menu to the game
        x: x,                           // Context
        y: y,                           // Context
        orientation: expandOrientation, // Sets how the menu expands

        items: items,                               // Call up the items variable defined above
        createButtonCallback: function (item, i) {  // Creating a callback for the buttons
            return scene.rexUI.add.label({          // Pass the label to pointer events
                background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_PRIMARY),   // Set the menu UI background
                text: scene.add.text(0, 0, item.name, {                             // Add the text to the UI
                    fontSize: '20px'                                                // And how big it is
                }),
                icon: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_DARK),   // The object on which everything is projected
                space: {        // Padding, essentially
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10,
                    icon: 10
                }
            });
        },
        easeIn: {   // Set the ease
            duration: 500,
            orientation: easeOrientation
        },
        easeOut: {  // Set the ease
            duration: 100,
            orientation: easeOrientation
        }
    }).setScrollFactor(0); // And make sure the meny is locked to the viewport

    menu                                            // The menu veriable
        .on('button.over', function (button) {      // Event listener when the mouse moves over the buttons
            button.getElement('background').setStrokeStyle(1, 0xffffff);    // Put a highlight around the box
        })      
        .on('button.out', function (button) {       // Event listener for when the mouse moves off the button  
            button.getElement('background').setStrokeStyle();   // Remove the highlight
        })
        .on('button.click', function (button) {     // Event listener for clicks on buttons
            onClick(button);                        // Return the button label
        });

    return menu;
};

var playerUpgrades = {  // An object for saving the player's chosen upgrade
    head: 'none',       // The head,
    body: 'none',       // body
    tail: 'none'        // and tail
};

// This is an array to house the keys for all of the animations. It is used by the animation-creating for-loop to efficiently name, create amd call animations.
// KEY: 0 = null/no other upgrades, J = jaws, S = spike, F = flagellum, T = tail, K = stiff skin, C = chitin, M = moving, E = enemy, though that is appended while generating the enemy animation codes and can't be seen here.
var animationSetter = [
    '000','000M','J00','J00M','S00','S00M','00F','00FM','J0F','J0FM','S0F','S0FM','0KF','0KFM','0CF','0CFM','00T','00TM','J0T','J0TM','S0T','S0TM','0KT','0KTM','0CT','0CTM','JKF','JKFM','JCF','JCFM','SKF','SKFM','SCF','SCFM','JKT','JKTM','JCT','JCTM','SKT','SKTM','SCT','SCTM',
];
// ================================= Global Variables ====================================
// ========= This is where the global variables for the game are being declared ==========
// ===== General variables
var menuMovement = false;                   // a variable for disabling movement when the menu is open
var evoMenu = false;                        // Set the evoMenu to false for checking movement
var scarceMessage = false;                  // A toggle for only showing the food scarcity message once per round
var slainMessage = false;                   // a toggle for only showing the 'consumed all other creatures' message once per round
var pressKey;                               // A variable to store the press any key sprite
var music;                                  // declare the music variables to use between scenes
var soundMute = false;                      // Set a global variable to save the mute setting between scenes
var timer = false;                          // A timer to avoid building a message queue
var round = 1;                              // Global variable for storing the current round
var gameText;                               // Global variable for accessing the center screen text element
var currentPlayerSpeed = baseSpeed;         // global variable for storing the player's speed
var currentPlayerRotation = baseRotation;   // Global variable for storing the player's rotation speed
var playerDead = false;                     // Global variable to save the dead state between scenes
var newRound = false;                       // Global variable to save the newround state between scenes
var deathScreen = false;                    // Global variable to save the deathscreen state
var player;                                 // The player object
var playerHP = 10;                          // Determines how durable the player is
var playerMaxHP = 10;                       // Used to determine how to increment the energy bar
var referenceHP = 10;                       // Used to determine if the HP total has changed between frames
var stepWidth;                              // The increment by which the health bar moves
var enemySpike = false;                     // A boolean to be flipped on while generating enemy gameObjects and flipped off immediately after
var enemyJaws = false;                      // A boolean to be flipped on while generating enemy gameObjects and flipped off immediately after
var foodBit = 0;                            // Global variable for containing the amount of foodBits in the active scene
var food = [];                              // An array for storing all instances of food for reference
var evoPoints = 0;                          // Global variable for managing the player's score in a round
var cursors;                                // Global variable for storing directional inputs
var healthBar;                              // The gameObject that displays the UI for the healthbar, evo points and dropdown evolution menu. Also stores most game values.
var healthBarScale = 1.5;                   // A handy place to adjust the scale of the healthbar
var energyMask;                             // Save the energy mask through all methods
var startGame = false;                      // Keeps the listener for any key presses in the menu screen separate from the function that starts the game
var healthContainer;                        // A container that holds all of the graphics for the UI
var pointText;                              // The text displaying the current points value
var garbage;                                // A variable for temporarily storing gameObjects queued for deletion to avoid removing them from the game in the middle of functions
var enemyGroup = [];                        // An array for storing the actual instance of each enemy gameObject
var enemies = [                             // An array for storing the current evolution stage of each enemy. The value of each being the name of the relevant animation for that stage
    'E000M',                                // Animation code
    "E000M",                                // Animation code
    "E000M",                                // Animation code
];
var posX = [0,0];                           // Save position for the player speed function
var posY = [0,0];                           // Save position for the player speed function
var moving = false;                         // Variable for testing if the player is in motion
var currentIdleAnimation = '000';           // Initial animation state for the player. "000" means no upgrades
var currentMoveAnimation = '000M';          // initial moving animation state for the player. "000" means no upgrades, "M" means this is the moving version of that sprite
var chitinPenalty = 0;                      // A variable for storing the speed penalty for the chitin upgrade
var spike = false;                          // Variable for testing whether the player has the spike part
var playerCompoundBody;                     // Object holding static body parts for the player
var enemyCompoundBody;                      // Object holding the static body parts for the enemies
var debris = [];                            // Empty array for holding all the background debris
var touch = false;                          // Save the touch setting between scenes
var game = new Phaser.Game(config);         // Uses the config object keys to set the start conditions for the game