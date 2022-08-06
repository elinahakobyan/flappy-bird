import Phaser from 'phaser'
import { GAP, KeyPointPos, MOVEMENT_SPEED } from '../constants'
import { PipeEvents } from '../events'

export class PipesComponent extends Phaser.Physics.Arcade.Group {
  private _pipeUp: Phaser.Physics.Arcade.Sprite
  private _pipeBottom: Phaser.Physics.Arcade.Sprite
  private _gap: number
  // private _pipes: { x: number; y: number }[] = []

  constructor(public scene: Phaser.Scene) {
    super(scene.physics.world, scene)

    this._build()
    // this.setDepth(7)
  }

  public getPipes(): Phaser.Physics.Arcade.Sprite[] {
    return [this._pipeUp, this._pipeBottom]
  }

  public move(): void {
    this._pipeUp.x -= MOVEMENT_SPEED
    this._pipeBottom.x -= MOVEMENT_SPEED

    if (this._pipeUp.x <= KeyPointPos.x) {
      this.emit(PipeEvents.AchieveAtPoint)
    }

    if (this._pipeUp.x + this._pipeUp.width <= 0) {
      this.emit(PipeEvents.OutOfScreen)
    }
  }

  public stopMoving(): void {
    this._pipeUp.x -= 0
    this._pipeBottom.x -= 0
  }

  private _build(): void {
    const pipeUp = this.scene.physics.add.sprite(288, 0, 'pipeUp')
    pipeUp.y = Math.random() * 0.5 * pipeUp.height - pipeUp.height / 2

    const pipeDown = this.scene.physics.add.sprite(
      288,
      Math.random() * 70 + (pipeUp.y + pipeUp.height + GAP),
      'pipeBottom'
    )

    pipeUp.setOrigin(0)
    pipeDown.setOrigin(0)

    pipeUp.setImmovable(false)
    pipeDown.setImmovable(false)

    pipeUp.body.allowGravity = false
    pipeDown.body.allowGravity = false

    this._pipeUp = pipeUp
    this._pipeBottom = pipeDown
  }
}
