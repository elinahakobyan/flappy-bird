import Phaser from 'phaser'

export class BgComponent extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene) {
    super(scene, 144, 256, 'bg')
  }
}
