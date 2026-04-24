import { Application, Assets, Container } from "pixi.js";
import { Manifest } from "./Manifest";
import { GameFactory, GameObjects } from "./GameFactory";
import { GamePhase } from "@crash/shared";
import { CanvasState, CanvasStateContext } from "./states/CanvasState";
import { WaitingState } from "./states/WaitingState";
import { CountdownState } from "./states/CountdownState";
import { FlyingState } from "./states/FlyingState";
import { CrashedState } from "./states/CrashedState";
import { GameState } from "../store/game-store";

export class Game {
  private readonly baseWidth = 1024;
  private readonly baseHeight = 1024;

  private readonly app = new Application();
  private readonly world = new Container();

  private resizeObserver?: ResizeObserver;

  protected gameFactory = new GameFactory();
  protected gameObjects?: GameObjects;
  protected states!: Record<GamePhase, CanvasState>;

  protected currentState?: GamePhase;

  public async init(parent: HTMLElement): Promise<void> {
    await this.app.init({
      width: this.baseWidth,
      height: this.baseHeight,
      background: "#1b1b1b",
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    parent.appendChild(this.app.canvas);
    this.app.stage.addChild(this.world);

    await this.loadAssets();

    this.gameObjects = this.gameFactory.buildGame(this.world);
    this.resize(parent);

    const gameStateContext: CanvasStateContext = {
      gameObjects: this.gameObjects,
      ticker: this.app.ticker
    };
    this.states = {
      [GamePhase.WAITING]: new WaitingState(gameStateContext),
      [GamePhase.COUNTDOWN]: new CountdownState(gameStateContext),
      [GamePhase.FLYING]: new FlyingState(gameStateContext),
      [GamePhase.CRASHED]: new CrashedState(gameStateContext)
    };

    this.resizeObserver = new ResizeObserver(() => this.resize(parent));
    this.resizeObserver.observe(parent);
    window.addEventListener("resize", () => this.resize(parent));

    // expose for devtools
    // todo: use env variables to prevent this from being in prod builds
    (globalThis as any).__PIXI_APP__ = this.app;
  }

  public onPhaseChanged(state: GameState): void {
    if (state.phase === this.currentState) {
      return;
    }

    console.log(`[Game] Entered state: ${state.phase}`);

    if (this.currentState) {
      this.states?.[this.currentState].exit();
    }
    this.states?.[state.phase].enter();

    this.currentState = state.phase;
  }

  private async loadAssets(): Promise<void> {
    await Assets.init({ manifest: Manifest });
    await Assets.loadBundle("game");
  }

  private resize(parent: HTMLElement): void {
    const parentWidth = parent.clientWidth || window.innerWidth;
    const parentHeight = parent.clientHeight || window.innerHeight;

    this.app.renderer.resize(parentWidth, parentHeight);

    const scale = Math.max(
      parentWidth / this.baseWidth,
      parentHeight / this.baseHeight
    );

    this.world.scale.set(scale);

    const scaledWidth = this.baseWidth * scale;
    const scaledHeight = this.baseHeight * scale;

    // Always centre horizontally
    this.world.x = Math.floor((parentWidth - scaledWidth) / 2);

    if (parentWidth > parentHeight) {
      // Landscape → pin to bottom
      this.world.y = parentHeight - scaledHeight;
    } else {
      // Portrait / square → centre vertically
      this.world.y = Math.floor((parentHeight - scaledHeight) / 2);
    }
  }

  public destroy(): void {
    this.resizeObserver?.disconnect();
    this.app.destroy(true);
  }
}