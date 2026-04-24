import { AnimatedSprite, Assets, Container, Graphics, Sprite } from "pixi.js";

export interface GameObjects {
  batter: AnimatedSprite;
  ballContainer: Container;
}

export class GameFactory {
  public buildGame(root: Container): GameObjects {
    root.addChild(
      new Graphics({ zIndex: -1 })
        .rect(0, 0, 1024, 1024)
        .fill(0x3298cb)
    );

    root.addChild(this.createStadium());

    const ballContainer = this.createBallContainer();
    root.addChild(ballContainer);

    const batter = this.createBatter();
    root.addChild(batter);

    return { batter, ballContainer };
  }

  public createStadium(): Sprite {
    return new Sprite({
      texture: Assets.get("stadium"),
      anchor: 0.5,
      x: 512,
      y: 728,
      scale: 0.67,
      label: "stadium"
    });
  }

  public createBallContainer(): Container {
    const ballContainer = new Container({
      x: 1050,
      y: 807,
      label: "ballContainer"
    });
    const ball = new Sprite({
      texture: Assets.get("ball"),
      anchor: 0.5,
      scale: 0.15,
      label: "sprite"
    });
    ballContainer.addChild(ball);
    return ballContainer;
  }

  public createBatter(): AnimatedSprite {
    return new AnimatedSprite({
      textures: Array.from({ length: 8 }, (_, i) => Assets.get(`swing_${i + 1}`)),
      animationSpeed: 0.1,
      loop: false,
      autoUpdate: true,
      x: 67,
      y: 669,
      scale: 0.67,
      label: "batter"
    });
  }
}