import { Ticker } from "pixi.js";
import { GameObjects } from "../GameFactory";

export interface CanvasStateContext {
  readonly gameObjects: GameObjects;
  readonly ticker: Ticker;
}

export abstract class CanvasState {
  public readonly gameObjects: GameObjects;
  public readonly ticker: Ticker;
  public inState = false;

  constructor({ gameObjects, ticker }: CanvasStateContext) {
    this.gameObjects = gameObjects;
    this.ticker = ticker;
  }

  public enter(): void {
    this.inState = true;
    this._enter();
  }

  public exit(): void {
    this.inState = false;
    this._exit();
  }

  protected abstract _enter(): void;
  protected abstract _exit(): void;
}