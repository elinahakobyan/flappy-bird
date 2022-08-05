import Phaser from 'phaser'

export class GroundComponent extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, gameWidth: number, gameHeight: number) {
    super(scene, gameWidth / 2, gameHeight - 59, 'ground')
    this.setDepth(10)
  }
}
