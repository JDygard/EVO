const config = {
    type: Phaser.AUTO, // Lets the game select the graphics engine based on the device automatically
    width: (this.window.devicePixelRatio * this.window.innerWidth) * 0.99, // Fits the game viewport width to the size of the device screen/browser window
    height: (this.window.devicePixelRatio * this.window.innerHeight) * 0.99, // Fits the game viewport height to the size of the device screen/browser window
    backgroundColor: 'black', // Sets the color of the background
    pixelArt: true, // Tell the graphics engine not to blur or anti-alias, in order to preserve the pixel art effect
    plugins: {      //Declare plugins
        global: [
            { key: 'BackgroundPlugin', plugin: BackgroundPlugin, start: true },
        ],
    },
    physics: { // Selects a physics engine
        default: 'matter', // A physics engine with collisions and complex material interaction
        matter: { 
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [ // Declaring the key names for scenes
        Preloader,
        Gameplay,
        MenuScreen,
    ]
    
};


// ==================================== Game variables ====================================
// ===This is where all of the constants for game elements can be adjusted in one place.===

// ==Debug mode : Turns off touch controls and menu scene for rapid testing
var debugMode = true

// ==Rotation speed
// Unupgraded speed
var baseRotation = 0.065

// ==Acceleration
// Unupgraded speed
var baseSpeed = 0.03

// ==Fluid friction
// Probably a constant
var baseFriction = 0.1

// ==Player mass
// Probably a constant
var baseMass = 30

// ================================= Global Variables ====================================
// =========This is where the global variables for the game are being declared ===========

// General variables
var player;
var cursors;
var background;
var pointer;
var touchX;
var touchY;

// Variables with useful screen size values
var viewX = this.window.devicePixelRatio * this.window.innerWidth * .99;
var viewY = this.window.devicePixelRatio * this.window.innerHeight * .99;
var centerX = (this.window.devicePixelRatio * this.window.innerWidth * .99) / 2;
var centerY = (this.window.devicePixelRatio * this.window.innerHeight * .99) / 2;

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