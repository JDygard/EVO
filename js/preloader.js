class Preloader extends Phaser.Scene{ // Creating a Preloader class as an extension of the scene.
    constructor() {                   // Calling the constructor to build it.  
        super('Preloader');           // And the super to call functions from the parent class. 
    }                                 

    preload(){                                                                  // The preload method is used by the library once at the loading of the scene. 
        this.load.image('amoeba', 'assets/images/sprites/Amoeba.png');          // We are loading our sprites and images here. Since images are handled by the
        this.load.image('background', 'assets/images/sandy-floor.jpg');         // textureManager method, they can be loaded anywhere within Phaser.Scene
        this.load.image('menuscreen', 'assets/images/menuscreen/temporary.png') // and still be useful elsewhere.
    }                                                                   

    create(){
        this.scene.start('MenuScreen')                                    // Launching the game.
        console.log("preloader start game method")
    }
}