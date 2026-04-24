import { AnimatedSprite, Application, Assets, Container, Graphics, Sprite, Texture } from "pixi.js";
import { Manifest } from "./Manifest";

export class Game {
  private readonly baseWidth = 1024;
  private readonly baseHeight = 1024;

  private readonly app = new Application();
  private readonly world = new Container();

  private resizeObserver?: ResizeObserver;

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
    this.createScene();

    this.resize(parent);

    this.resizeObserver = new ResizeObserver(() => this.resize(parent));
    this.resizeObserver.observe(parent);
    window.addEventListener("resize", () => this.resize(parent));

    // expose for devtools
    // todo: use env variables to prevent this from being in prod builds
    (globalThis as any).__PIXI_APP__ = this.app;
  }

  private async loadAssets(): Promise<void> {
    await Assets.init({ manifest: Manifest });
    await Assets.loadBundle("game");
  }

  private createScene(): void {
    this.world.addChild(
      new Graphics({ zIndex: -1 })
        .rect(0, 0, this.baseWidth, this.baseHeight)
        .fill(0x3298cb)
    );

    this.world.addChild(this.createStadium());

    this.world.addChild(this.createBall());

    this.world.addChild(this.createBatter());
  }

  public createStadium(): Sprite {
    const ball = new Sprite({
      texture: Assets.get("stadium"),
      anchor: 0.5,
      x: 512,
      y: 728,
      scale: 0.67
    });
    return ball;
  }

  public createBall(): Sprite {
    const ball = new Sprite({
      texture: Assets.get("ball"),
      anchor: 0.5,
      x: 512,
      y: 512
    });
    return ball;
  }

  public createBatter(): AnimatedSprite {
    return new AnimatedSprite({
      textures: Array.from({ length: 8 }, (_, i) => Assets.get(`swing_${i + 1}`)),
      animationSpeed: 0.1,
      loop: true,
      autoPlay: true,
      x: 67,
      y: 669,
      scale: 0.67
    });
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