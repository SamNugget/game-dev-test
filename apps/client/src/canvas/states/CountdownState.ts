import gsap from "gsap";
import { CanvasState } from "./CanvasState";

export class CountdownState extends CanvasState {
  public async enter(): Promise<void> {
    const { batter, ballContainer } = this.gameObjects;

    ballContainer.x = 1050;
    ballContainer.y = 807;
    ballContainer.angle = 0;

    batter.gotoAndStop(0);

    await gsap.to(this, { duration: 1.8 });

    batter.play();

    await gsap.to(this, { duration: 0.6 });
    await gsap.to(ballContainer, { x: 250, angle: 360, ease: "none", duration: 0.2 });
  }

  public async exit(): Promise<void> {

  }
}