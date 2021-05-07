class MenuScreen extends Phaser.Scene {
    constructor (){
        super('MenuScreen')
    }
    create(){
//=============================== Adding images ============================
        let sky = this.add.image(800, 160, "menu-sky")
        let water = this.add.image(800, 435, "menu-water")
        let underwater = this.add.image(800, 970, "menu-underwater")
        let title = this.add.image(800, 300, "menu-title").setAlpha(0)
        let evolve = this.add.image(1240, 550, "menu-evolve").setAlpha(0);
        let consume = this.add.image(350, 550, "menu-consume").setAlpha(0);
        let survive = this.add.image(800, 650, "menu-survive").setAlpha(0);
        let pressKey = this.add.image(800, 750, "menu-press").setAlpha(0);
        let durationSky = 2000;
//=============================== Menu intro ==============================
        this.cameras.main.fadeIn(300);
        this.tweens.add({
            targets: title,
            alpha: {
                value:1,
                duration: 700,
                delay: 300                
            }
        })
        this.tweens.add({
            targets: sky,
            scaleY: {
                value: .7,
                duration: durationSky,      
            },
            y: {
                value: -50,
                duration: durationSky,
            },
            ease: "Sine.easeInOut",     
            delay: 1000,
        })
        this.tweens.add({
            targets: water,
            scaleY: {
                value: .2
            },
            y: {
                value: 40,
            },
            duration: durationSky,
            ease: "Sine.easeInOut",
            delay: 1000,
        })
        this.tweens.add({
            targets: underwater,
            scaleY: {
                value: .8,
                duration: durationSky,
            },
            y: {
                value:800,
                duration: durationSky,
            },
            ease: "Sine.easeInOut",
            delay: 1000,
        })
        this.tweens.add({
            targets: consume,
            alpha: 1,
            delay: 1700,
            duration: 600
        })
        this.tweens.add({
            targets: evolve,
            alpha: 1,
            delay: 2200,
            duration: 600
        })
        this.tweens.add({
            targets: survive,
            alpha: 1,
            delay: 2700,
            duration: 1000
        })
        this.tweens.add({
            targets: pressKey,
            alpha: 1,
            delay: 3500,
            duration: 500,
            y: 765
        })
        /*
        
        listen for keyboard input
        button to listen for tap
        button to show instructions scene
        ? button to show story screen
        text "Press any key to start
            or tap for touch controls"


        //==================== OLD CODE ===================
       
    */    
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