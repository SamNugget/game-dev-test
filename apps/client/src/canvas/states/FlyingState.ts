import { Ticker } from "pixi.js";
import { CanvasState } from "./CanvasState";
import { useGameStore } from "../../store/game-store";
import gsap from "gsap";

export class FlyingState extends CanvasState {
  protected xPositionEase = gsap.parseEase("power1.out");
  protected yPositionEase = gsap.parseEase("power1.out");

  protected _enter(): void {
    const { batter } = this.gameObjects;
    batter.gotoAndStop(7);

    this.ticker.add(this.update, this);
  }

  protected _exit(): void {
    this.ticker.remove(this.update, this);
  }

  protected update(ticker: Ticker): void {
    const { ballContainer } = this.gameObjects;

    const currentAngle = ballContainer.angle;
    const spinSpeed = 720;

    ballContainer.angle = currentAngle + (ticker.deltaMS / 1000) * spinSpeed;

    this.updateStage();
  }

  protected updateStage(): void {
    const { skyGradient, scene, ballContainer } = this.gameObjects;

    const { multiplier } = useGameStore.getState();

    const upSpeed = 10000;
    const position = (multiplier - 1) * upSpeed;

    skyGradient.setAltitude(position);

    scene.y = position;

    const yRange = -500;
    const xRange = 300;

    ballContainer.x = 250 + xRange * this.getProgressFromMulti(multiplier, this.xPositionEase);
    ballContainer.y = 807 + yRange * this.getProgressFromMulti(multiplier, this.yPositionEase);
  }

  protected getProgressFromMulti(multiplier: number, ease: gsap.EaseFunction): number {
    const ballDriftEndsAt = 5;
    return ease(Math.min(1, (multiplier - 1) / (ballDriftEndsAt - 1)));
  }
}