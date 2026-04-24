import gsap from "gsap";
import { CanvasState } from "./CanvasState";
import { CloudData } from "../GameFactory";
import { Ticker } from "pixi.js";

export class CountdownState extends CanvasState {
  protected openTweens?: gsap.core.Tween[];

  protected _enter(): void {
    const { skyGradient, scene, moon, batter, ballContainer } = this.gameObjects;

    this.openTweens = [];

    // reset the game
    skyGradient.setAltitude(0);
    scene.y = 0;
    moon.y = -5000;
    ballContainer.x = 1050;
    ballContainer.y = 807;
    ballContainer.angle = 0;

    batter.gotoAndStop(0);

    this.openTweens.push(
      gsap.to(this, { duration: 2.2, onComplete: () => this.afterDelay() })
    );

    this.ticker.add(this.update, this);
  }

  protected _exit(): void {
    this.ticker.remove(this.update, this);

    if (!this.openTweens) return;
    for (const tween of this.openTweens) {
      tween.progress(1);
      tween.kill();
    }
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

  protected update(ticker: Ticker): void {
    updateClouds(this.gameObjects.clouds, this.ticker);
  }
}

export function updateClouds(clouds: CloudData[], ticker: Ticker): void {
  for (const cloud of clouds) {
    const sprite = cloud.sprite;

    sprite.x += cloud.speed * ticker.deltaTime;

    const halfWidth = sprite.width * 0.5;

    if (sprite.x < -halfWidth) {
      sprite.x = 1024 + halfWidth;
    } else if (sprite.x > 1024 + halfWidth) {
      sprite.x = -halfWidth;
    }
  }
}