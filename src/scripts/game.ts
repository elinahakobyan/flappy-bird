import 'phaser'
import Phaser from 'phaser'
import MainScene from './scenes/main-scene'
import PreloadScene from './scenes/preload-scene'

const DEFAULT_WIDTH = 288
const DEFAULT_HEIGHT = 512

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#ffffff',
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [PreloadScene, MainScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 600 }
    }
  }
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
