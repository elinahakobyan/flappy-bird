import Phaser from 'phaser'
import { LoseViewEvents } from '../events'

export class LoseView extends Phaser.GameObjects.Group {
  private _gameOverText: Phaser.GameObjects.Sprite
  private _retryBtn: Phaser.GameObjects.Sprite

  public constructor(scene: Phaser.Scene) {
    super(scene)

    this._build()
  }

  public show(): void {
    this._gameOverText.visible = true
    this._retryBtn.visible = true
  }

  public hide(): void {
    this._gameOverText.visible = false
    this._retryBtn.visible = false
  }

  private _build(): void {
    const gameOverText = this.scene.add.sprite(144, 206, 'game_over')
    gameOverText.visible = false

    this.add((this._gameOverText = gameOverText))

    const retryBtn = this.scene.add.sprite(144, 266, 'retry_btn')
    retryBtn.visible = false

    retryBtn
      .setInteractive()
      .on(
        'pointerdown',
        () => {
          this._retryBtn.scaleX = 0.9
          this._retryBtn.scaleY = 0.9
        },
        this
      )
      .on(
        'pointerup',
        () => {
          this._retryBtn.scaleX = 1
          this._retryBtn.scaleY = 1
          this.emit(LoseViewEvents.RetryButtonClick)
        },
        this
      )
    this.add((this._retryBtn = retryBtn))
  }
}
