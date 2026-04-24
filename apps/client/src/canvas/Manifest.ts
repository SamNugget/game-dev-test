import { AssetsManifest } from "pixi.js";

const swingFrames = Array.from({ length: 8 }, (_, i) => ({
  alias: `swing_${i + 1}`,
  src: `assets/swing_${i + 1}.png`,
}));

const clouds = Array.from({ length: 6 }, (_, i) => ({
  alias: `cloud_${i + 1}`,
  src: `assets/cloud_${i + 1}.png`,
}));

export const Manifest: AssetsManifest = {
  bundles: [
    {
      name: "loader",
      assets: [] // here's where i'd put loader assets
    },
    {
      name: "game",
      assets: [
        { alias: "ball", src: "assets/ball.png" },
        { alias: "stadium", src: "assets/stadium_clearbg_blur.png" },
        { alias: "moon", src: "assets/moon_base.png" },
        ...swingFrames,
        ...clouds
      ]
    }
  ]
};