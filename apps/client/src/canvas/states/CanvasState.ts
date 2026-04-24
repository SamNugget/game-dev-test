import { Ticker } from "pixi.js";
import { GameObjects } from "../GameFactory";

export interface CanvasStateContext {
  readonly gameObjects: GameObjects;
  readonly ticker: Ticker;
}

export abstract class CanvasState {
  public readonly gameObjects: GameObjects;
  public readonly ticker: Ticker;

  constructor({ gameObjects, ticker }: CanvasStateContext) {
    this.gameObjects = gameObjects;
    this.ticker = ticker;
  }

  public abstract enter(): Promise<void>;
  public abstract exit(): Promise<void>;
}