import { AnimatedSprite, Assets, Container, Graphics, Sprite, Texture } from "pixi.js";
import { SkyGradient } from "./components/SkyGradient";

export interface GameObjects {
  skyGradient: SkyGradient;
  scene: Container;
  clouds: CloudData[];
  moon: Sprite;
  batter: AnimatedSprite;
  ballContainer: Container;
}

export class GameFactory {
  public buildGame(root: Container): GameObjects {
    const skyGradient = new SkyGradient();
    root.addChild(skyGradient.sprite);

    const scene = new Container({ label: "scene" });
    root.addChild(scene);

    const clouds = this.generateClouds({
      count: 80,
      textures: Array.from({ length: 6 }, (_, i) => Assets.get(`cloud_${i + 1}`))
    });
    for (const cloud of clouds) {
      scene.addChild(cloud.sprite);
    }

    const moon = this.createMoon();
    root.addChild(moon);

    scene.addChild(this.createStadium());

    const batter = this.createBatter();
    scene.addChild(batter);

    const ballContainer = this.createBallContainer();
    root.addChild(ballContainer);

    return { skyGradient, scene, clouds, moon, batter, ballContainer };
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

  public createMoon(): Sprite {
    return new Sprite({
      texture: Assets.get("moon"),
      anchor: 0.5,
      x: 512,
      y: 5000,
      scale: 0.75,
      label: "moon"
    });
  }

  protected generateClouds({
    count,
    textures,
    worldWidth = 1024,
    minAltitude = -400,
    maxAltitude = 32000,
    minDistance = 260,
  }: CloudConfig): CloudData[] {
    const clouds: CloudData[] = [];
    const maxAttempts = count * 80;

    let attempts = 0;

    while (clouds.length < count && attempts < maxAttempts) {
      attempts++;

      const altitude = this.biasedAltitude(minAltitude, maxAltitude);
      const x = Math.random() * worldWidth;

      const tooClose = clouds.some(cloud => {
        const dy = cloud.altitude - altitude;
        const dx = cloud.x - x;
        return Math.sqrt(dx * dx + dy * dy) < minDistance;
      });

      if (tooClose) continue;

      const texture = textures[Math.floor(Math.random() * textures.length)];
      const sprite = new Sprite({ texture, label: `cloud${clouds.length}` });

      sprite.anchor.set(0.5);
      sprite.x = x;
      sprite.y = -altitude;

      const scale = 0.2 + Math.random() * 0.8;
      sprite.scale.set(scale);

      sprite.alpha = 0.55 + Math.random() * 0.35;

      const speed = (Math.random() - 0.5) * 2; // left or right, slow

      clouds.push({ altitude, x, sprite, speed });
    }

    return clouds.sort((a, b) => a.altitude - b.altitude);
  }

  protected biasedAltitude(min: number, max: number): number {
    const t = Math.random() ** 2.4; // higher = more clouds near minAltitude
    return min + (max - min) * t;
  }
}

type CloudConfig = {
  count: number;
  textures: Texture[];
  worldWidth?: number;
  minAltitude?: number;
  maxAltitude?: number;
  minDistance?: number;
};

export type CloudData = {
  altitude: number;
  x: number;
  speed: number;
  sprite: Sprite;
};