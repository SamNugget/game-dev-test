import { Sprite, Texture } from "pixi.js";

type SkyStop = {
  altitude: number; // 0 = ground, higher = further into sky/space
  color: number;
};

const SKY_STOPS: SkyStop[] = [
  { altitude: 0, color: 0x87ceeb }, // blue sky
  { altitude: 8000, color: 0x4aa3ff },
  { altitude: 18000, color: 0x1b4f9c },
  { altitude: 32000, color: 0x10194a },
  { altitude: 50000, color: 0x050816 },
  { altitude: 80000, color: 0x000000 }, // space
];

export class SkyGradient {
  private readonly height: number;

  public readonly sprite: Sprite;

  private readonly canvas = document.createElement("canvas");
  private readonly ctx = this.canvas.getContext("2d")!;
  private readonly texture: Texture;

  public constructor(width = 1024, height = 1024) {
    this.canvas.width = 1;
    this.height = this.canvas.height = height;

    this.texture = Texture.from(this.canvas);

    this.sprite = new Sprite(this.texture);
    this.sprite.width = width;
    this.sprite.height = height;

    this.setAltitude(0);
  }

  public setAltitude(bottomAltitude: number): void {
    const topAltitude = bottomAltitude + this.height;

    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);

    gradient.addColorStop(0, toCss(colorAt(topAltitude)));
    gradient.addColorStop(1, toCss(colorAt(bottomAltitude)));

    for (const stop of SKY_STOPS) {
      if (stop.altitude < bottomAltitude || stop.altitude > topAltitude) {
        continue;
      }

      const offset = (topAltitude - stop.altitude) / this.height;
      gradient.addColorStop(offset, toCss(stop.color));
    }

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, 1, this.height);

    this.texture.source.update();
  }
}

function colorAt(altitude: number): number {
  if (altitude <= SKY_STOPS[0].altitude) return SKY_STOPS[0].color;

  for (let i = 1; i < SKY_STOPS.length; i++) {
    const previous = SKY_STOPS[i - 1];
    const next = SKY_STOPS[i];

    if (altitude <= next.altitude) {
      const t = (altitude - previous.altitude) / (next.altitude - previous.altitude);
      return lerpColor(previous.color, next.color, t);
    }
  }

  return SKY_STOPS[SKY_STOPS.length - 1].color;
}

function lerpColor(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 255;
  const ag = (a >> 8) & 255;
  const ab = a & 255;

  const br = (b >> 16) & 255;
  const bg = (b >> 8) & 255;
  const bb = b & 255;

  const r = ar + (br - ar) * t;
  const g = ag + (bg - ag) * t;
  const bl = ab + (bb - ab) * t;

  return (r << 16) | (g << 8) | bl;
}

function toCss(color: number): string {
  return `#${color.toString(16).padStart(6, "0")}`;
}