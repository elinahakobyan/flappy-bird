import { SceneEvents } from '../events'

export default class PreloadScene extends Phaser.Scene {
  public constructor() {
    super({ key: SceneEvents.PreloadSceneStart })
  }

  public preload() {
    this.load.image('bg', 'assets/img/flappy_bird_bg.png')
    this.load.image('bird', 'assets/img/flappy_bird_bird.png')
    this.load.image('ground', 'assets/img/flappy_bird_ground.png')
    this.load.image('pipeBottom', 'assets/img/flappy_bird_pipeBottom.png')
    this.load.image('pipeUp', 'assets/img/flappy_bird_pipeUp.png')
    this.load.image('tutorial', 'assets/img/tutorial.png')
  }

  public create() {
    this.scene.start(SceneEvents.MainSceneStart)
  }
}
