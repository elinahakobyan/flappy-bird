import Phaser from 'phaser'

export class BirdComponent extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene) {
    super(scene, 50, 256, 'bird')
    this.setDepth(5)
  }

  public jump(): void {
    this.body.velocity.y = -150
  }

  public activate(): void {
    this.scene.physics.world.enable(this)
  }

  public fall(): void {
    this.rotation = Math.PI / 4
  }

  public die(): void {
    this.scene.physics.world.disable(this)
  }
}
