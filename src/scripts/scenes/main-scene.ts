import Phaser from 'phaser'
import { PipeEvents, SceneEvents } from '../../events'
import { BgComponent } from '../components/bg-component'
import { PipesComponent } from '../components/pipes-component'

export default class MainScene extends Phaser.Scene {
  private _bg: BgComponent
  private _pipes: PipesComponent[] = []
  private _ground: Phaser.Physics.Arcade.Sprite

  public constructor() {
    super({ key: SceneEvents.MainSceneStart })
  }

  public create(): void {
    this._buildBg()
    this._buildPipes()
    this._buildGround()
    this._buildBird()
    //buildPipes
    //buildBird
    //buildBird
  }

  public update(): void {
    this._updatePipes()
  }

  private _buildBg(): void {
    const bg = new BgComponent(this)
    bg.setInteractive().on('pointerdown', this._onBgClick)
    this.add.existing((this._bg = bg))
  }

  private _buildPipes(): void {
    const pipes = new PipesComponent(this)

    pipes.once(PipeEvents.AchieveAtPoint, this._showNextPipes, this)
    pipes.once(PipeEvents.OutOfScreen, this._onPipesOutOfScreen, this)

    this._pipes.push(pipes)

    this.add.existing(pipes)
  }

  private _onPipesOutOfScreen(): void {
    console.warn('OutOfScreen')

    const prevPipes = this._pipes.shift()
    prevPipes?.destroy()
  }

  private _showNextPipes(): void {
    this._buildPipes()
  }

  private _updatePipes(): void {
    this._pipes &&
      this._pipes.forEach(pipes => {
        pipes.movePipes()
      })
  }

  private _buildGround(): void {
    const { width, height } = this.game.canvas

    const ground = this.physics.add.sprite(width / 2, height - 59, 'ground')
    ground.body.allowGravity = false
    ground.setImmovable(true)
    ground.setDepth(10)

    this.add.existing(ground)
    this._ground = ground

    // const ground = new GroundComponent(this, this.game.canvas.width, this.game.canvas.height)
    // ground.body.allowGravity = false
    // this.physics.add.existing((this._ground = ground))
  }

  private _buildBird(): void {
    //
  }

  private _onBgClick(): void {
    console.warn('BirdMove')
  }
}
