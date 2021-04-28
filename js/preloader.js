class Preloader extends Phaser.Scene{
    constructor() {
        super('Preloader');
    }

    preload(){
        this.load.image('amoeba', 'assets/images/sprites/Amoeba.png');
        this.load.image('background', 'assets/images/sandy-floor.jpg');
    }
    create(){
        this.scene.start('Gameplay')
        console.log("preloader start game method")
    }
}