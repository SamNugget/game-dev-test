import gsap from "gsap";
import { CanvasState } from "./CanvasState";

export class CountdownState extends CanvasState {
  protected openTweens?: gsap.core.Tween[];

  protected _enter(): void {
    const { skyGradient, scene, batter, ballContainer } = this.gameObjects;

    this.openTweens = [];

    // reset the game
    skyGradient.setAltitude(0);
    scene.y = 0;
    ballContainer.x = 1050;
    ballContainer.y = 807;
    ballContainer.angle = 0;

    batter.gotoAndStop(0);

    this.openTweens.push(
      gsap.to(this, { duration: 2.2, onComplete: () => this.afterDelay() })
    );
  }

  protected afterDelay(): void {
    const { batter } = this.gameObjects;
    batter.play();

    this.openTweens!.push(
      gsap.to(this, { duration: this.inState ? 0.6 : 0, onComplete: () => this.midSwing() }),
    );
  }

  protected midSwing(): void {
    const { ballContainer } = this.gameObjects;
    this.openTweens!.push(
      gsap.to(ballContainer, { x: 250, angle: 360, ease: "none", duration: this.inState ? 0.2 : 0 })
    );
  }

  protected _exit(): void {
    if (!this.openTweens) return;
    for (const tween of this.openTweens) {
      tween.progress(1);
      tween.kill();
    }
  }
}