import { SceneEvents } from '../events'

export default class PreloadScene extends Phaser.Scene {
  public constructor() {
    super({ key: SceneEvents.PreloadSceneStart })
  }

  public preload() {
    this.load.image('bg', 'assets/img/bg.png')
    this.load.image('bird', 'assets/img/bird.png')
    this.load.image('ground', 'assets/img/ground.png')
    this.load.image('pipeBottom', 'assets/img/pipeBottom.png')
    this.load.image('pipeUp', 'assets/img/pipeUp.png')
    this.load.image('tutorial', 'assets/img/tutorial.png')
    this.load.image('game_over', 'assets/img/game_over.png')
    this.load.image('retry_btn', 'assets/img/retry_btn.png')
  }

  public create() {
    this.scene.start(SceneEvents.MainSceneStart)
  }
}
