class ScenaPregunta1 extends Phaser.Scene {
    constructor() {
        super({ key: 'ScenaPregunta1' });
    }
    preload() {
        this.load.image('background', 'assets/background.svg');
    }
    create() {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
    }
}
