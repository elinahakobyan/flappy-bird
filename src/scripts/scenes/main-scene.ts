import Phaser from 'phaser'
import { BgComponent } from '../components/bg-component'
import { BirdComponent } from '../components/bird-component'
import { PipesComponent } from '../components/pipes-component'
import { GameState } from '../constants'
import { PipeEvents, SceneEvents } from '../events'

export default class MainScene extends Phaser.Scene {
  private _bg: BgComponent
  private _bird: BirdComponent
  private _pipes: PipesComponent[] = []
  private _ground: Phaser.Physics.Arcade.Sprite
  private _state: GameState = GameState.Unknown
  private _tutorial: Phaser.GameObjects.Sprite

  public constructor() {
    super({ key: SceneEvents.MainSceneStart })
  }

  public create(): void {
    this._buildBg()
    this._buildBird()
    this._buildPipes()
    this._buildGround()
    this._showTutorial()
  }

  public update(): void {
    if (this._state !== GameState.Unknown && this._state !== GameState.Lose && this._state !== GameState.PreLose) {
      this._updatePipes()
    }

    switch (this._state) {
      case GameState.Lose:
        this._bird.fall()
        this._bird.die()
        break

      case GameState.PreLose:
        this._bird.fall()
        break

      case GameState.Action:
        this._checkCollisions()
        break

      default:
        break
    }
  }

  private _buildBg(): void {
    const bg = new BgComponent(this)
    bg.setInteractive().on('pointerdown', this._onPointerDown, this)
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
  }

  private _buildBird(): void {
    const bird = new BirdComponent(this)
    this.add.existing((this._bird = bird))
  }

  private _showTutorial(): void {
    const tutorial = this.add.sprite(160, 250, 'tutorial')
    this.add.existing((this._tutorial = tutorial))
  }

  private _hideTutorial(): void {
    this._tutorial.visible = false
    this._tutorial.destroy()
  }

  private _checkCollisions(): void {
    this.physics.add.overlap(this._bird, [...this._pipes[0].getPipes()], () => {
      this._state = GameState.PreLose
    })

    this.physics.add.overlap(this._bird, this._ground, () => {
      this._state = GameState.Lose
    })

    if (this._bird.y - this._bird.height / 2 <= 0) {
      this._state = GameState.PreLose
    }
  }

  private _onPointerDown(): void {
    switch (this._state) {
      case GameState.Unknown:
        this._bird.activate()
        this._hideTutorial()
        this._state = GameState.Action
        break

      case GameState.Action:
        this._bird.jump()
        this._checkCollisions()
        break

      default:
        break
    }
  }
}
