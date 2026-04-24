import { Ticker } from "pixi.js";
import { CanvasState } from "./CanvasState";
import { useGameStore } from "../../store/game-store";

export class FlyingState extends CanvasState {
  public async enter(): Promise<void> {
    this.ticker.add(this.update, this);
  }

  public async exit(): Promise<void> {
    this.ticker.remove(this.update, this);
  }

  protected update(ticker: Ticker): void {
    const { batter, ballContainer } = this.gameObjects;
    const currentAngle = ballContainer.angle;

    batter.gotoAndStop(7);

    const spinSpeed = 150;
    ballContainer.angle = currentAngle + (ticker.deltaMS / 1000) * spinSpeed;

    const xSpeedScale = 200, ySpeedScale = -600;

    const { multiplier } = useGameStore.getState();
    ballContainer.x = 250 + (multiplier - 1) * xSpeedScale;
    ballContainer.y = 807 + (multiplier - 1) * ySpeedScale;
  }
}