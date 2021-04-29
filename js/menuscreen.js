class MenuScreen extends Phaser.Scene {
    constructor (){
        super('MenuScreen')
    }
    create(){
        this.menuScreen = this.add.image(centerX, centerY, 'menuscreen');
        this.menuScreen.setDisplaySize(viewX, viewY);
        this.cameras.main.fadeIn(300);
        this.clickToPlay = this.add.text(centerX, centerY, 'Tap to play', { fontFamily: '"Roboto Mono", sans serif' });
        this.clickToPlay.setScale(viewX/1000)
        spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    update(){
        if (this.input.activePointer.isDown){
            touch = true;
            this.scene.start('Gameplay')
            console.log(touch)
        }
        if (spaceKey.isDown){
            touch = false;
            this.scene.start('Gameplay')
            console.log(touch)
        }
    }
}