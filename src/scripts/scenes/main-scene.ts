import Phaser from 'phaser'
import { BgComponent } from '../components/bg-component'
import { BirdComponent } from '../components/bird-component'
import { LoseView } from '../components/lose-view'
import { PipesComponent } from '../components/pipes-component'
import { GameState } from '../constants'
import { LoseViewEvents, PipeEvents, SceneEvents } from '../events'

export default class MainScene extends Phaser.Scene {
  private _bg: BgComponent
  private _bird: BirdComponent
  private _pipes: PipesComponent[] = []
  private _ground: Phaser.Physics.Arcade.Sprite
  private _state: GameState = GameState.Unknown
  private _tutorial: Phaser.GameObjects.Sprite
  private _score: number = 0
  private _scoreText: Phaser.GameObjects.Text
  private _loseView: LoseView

  public constructor() {
    super({ key: SceneEvents.MainSceneStart })
  }

  public create(): void {
    this._setGameState(GameState.Unknown)

    this._buildBg()
    this._buildBird()
    this._buildPipes()
    this._buildGround()
    this._buildTutorial()
    this._buildScore()
    this._buildLoseView()
  }

  public update(): void {
    if (this._state !== GameState.Unknown && this._state !== GameState.Lose && this._state !== GameState.PreLose) {
      this._updatePipes()
    }
  }

  private _setGameState(state: GameState): void {
    if (this._state !== state) {
      this._state = state
    }

    this._onStateUpdate(this._state)
  }

  private _onStateUpdate(state: GameState): void {
    switch (state) {
      case GameState.Lose:
        this._bird.fall()
        this._bird.die()
        this._showLoseView()
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
    ++this._score
    this._updateScore()

    const prevPipes = this._pipes.shift()
    prevPipes?.setVisible(false)
    prevPipes?.destroy()
  }

  private _showNextPipes(): void {
    this._buildPipes()
  }

  private _updatePipes(): void {
    this._pipes &&
      this._pipes.forEach(pipes => {
        pipes.move()
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

  private _buildTutorial(): void {
    const tutorial = this.add.sprite(160, 260, 'tutorial')
    tutorial.visible = false
    this.add.existing((this._tutorial = tutorial))

    this._showTutorial()
  }

  private _hideTutorial(): void {
    this._tutorial.visible = false
    this._tutorial.destroy()
  }

  private _showTutorial(): void {
    this._tutorial.visible = true
  }

  private _buildScore(): void {
    const score = this.add.text(0, 0, `Score: ${this._score}`)
    score.setDepth(15)
    this.add.existing((this._scoreText = score))
  }

  private _updateScore(): void {
    this._scoreText.text = `Score: ${this._score}`
  }

  private _buildLoseView(): void {
    const loseView = new LoseView(this)
    loseView.setDepth(15)
    loseView.on(LoseViewEvents.RetryButtonClick, this._onRetryBtnClick, this)
    this.add.existing((this._loseView = loseView))
  }

  private _showLoseView(): void {
    this._loseView.show()
  }

  private _hideLoseView(): void {
    this._loseView.hide()
  }

  private _onRetryBtnClick(): void {
    this._hideLoseView()
    this._resetScore()
    this._destroyPipes()
    this._resetBird()

    this._setGameState(GameState.Unknown)
  }

  private _resetScore(): void {
    this._score = 0
    this._updateScore()
  }

  private _resetBird(): void {
    this._bird.destroy()
    this._buildBird()
  }

  private _destroyPipes(): void {
    this._pipes.forEach(p => {
      p.setVisible(false)
      p.getPipes().forEach(p => p.destroy())
    })
    this._pipes = []

    this._buildPipes()
  }

  private _checkCollisions(): void {
    this.physics.add.overlap(this._bird, [...this._pipes[0].getPipes()], () => {
      this._setGameState(GameState.PreLose)
    })

    this.physics.add.overlap(this._bird, this._ground, () => {
      this._setGameState(GameState.Lose)
    })

    if (this._bird.y - this._bird.height / 2 <= 0) {
      this._setGameState(GameState.PreLose)
    }
  }

  private _onPointerDown(): void {
    switch (this._state) {
      case GameState.Unknown:
        this._bird.activate()
        this._hideTutorial()
        this._setGameState(GameState.Action)
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
