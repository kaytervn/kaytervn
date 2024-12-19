import * as THREE from "three";
import { Box } from "./Box.js";

export class Gun extends THREE.Group {
  constructor({
    position = {
      x: 0,
      y: 0,
      z: 0,
    },
    flipped = 1,
    color = "#138D75",
  }) {
    super();
    this.position.set(position.x, position.y, position.z);
    this.color = color;
    this.flipped = flipped;
    this.init();
  }

  init() {
    this.add(
      new Box({
        width: 0.1,
        height: 0.35,
        depth: 0.1,
        color: "#5a5055",
        position: {
          x: 0,
          y: 0,
          z: 0 * this.flipped,
        },
        rotation: {
          x: 0.25 * this.flipped,
          y: 0,
          z: 0,
        },
      })
    );
    this.add(
      new Box({
        width: 0.12,
        height: 0.1,
        depth: 0.75,
        color: "#212121",
        position: {
          x: 0,
          y: 0.25,
          z: 0.25 * this.flipped,
        },
      })
    );
    this.add(
      new Box({
        width: 0.12,
        height: 0.05,
        depth: 0.75,
        color: "#5a5055",
        position: {
          x: 0,
          y: 0.175,
          z: 0.25 * this.flipped,
        },
      })
    );
    this.add(
      new Box({
        width: 0.025,
        height: 0.03,
        depth: 0.05,
        color: "#212121",
        position: {
          x: 0,
          y: 0.31,
          z: 0.6 * this.flipped,
        },
      })
    );
    this.add(
      new Box({
        width: 0.2,
        height: 0.2,
        depth: 0.2,
        color: "#eeab99",
        position: {
          x: 0,
          y: 0,
          z: 0.025 * this.flipped,
        },
      })
    );
    this.add(
      new Box({
        width: 0.2,
        height: 0.2,
        depth: 0.25,
        color: "#021526",
        position: {
          x: 0,
          y: 0,
          z: -0.2 * this.flipped,
        },
      })
    );
    this.add(
      new Box({
        width: 0.21,
        height: 0.21,
        depth: 0.1,
        color: "#03346E",
        position: {
          x: 0,
          y: 0,
          z: -0.12 * this.flipped,
        },
      })
    );
  }
}
