import * as THREE from "three";
import { Box } from "./Box";
import { boxCollision } from "./utils";

export class Truck extends THREE.Group {
  velocity: any;
  gravity: number;
  friction: number;
  zAcceleration: boolean;
  flipped: number;
  color: any;
  hitBox: any;

  constructor({
    velocity = {
      x: 0,
      y: 0,
      z: 0,
    },
    gravity = -0.002,
    friction = 0.5,
    zAcceleration = false,
    flipped = 1,
    position = {
      x: 0,
      y: 0,
      z: 0,
    },
    color = {
      main: "#00ff00",
      sub: "#90EE90",
    },
  }: any) {
    super();
    this.position.set(position.x, position.y, position.z);
    this.velocity = velocity;
    this.gravity = gravity;
    this.friction = friction;
    this.zAcceleration = zAcceleration;
    this.flipped = flipped;
    this.color = color;
    this.init();
  }

  init() {
    this.hitBox = new Box({
      width: 1.15,
      height: 1.45,
      depth: 3.425,
      color: "#ff0000",
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
    });
    // this.add(this.hitBox);

    this.add(
      new Box({
        width: 1,
        height: 0.1,
        depth: 1,
        color: "#808080",
        position: {
          x: 0,
          y: -0.2 - 0.375,
          z: (-0.875 - 0.35) * this.flipped,
        },
      })
    );

    this.add(
      new Box({
        width: 1,
        height: 0.75,
        depth: 0.85,
        color: this.color.main,
        position: {
          x: 0,
          y: 0.225 - 0.375,
          z: (-0.95 - 0.35) * this.flipped,
        },
      })
    );

    this.add(
      new Box({
        width: 1.01,
        height: 0.3,
        depth: 0.65,
        color: "black",
        position: {
          x: 0,
          y: 0.35 - 0.375,
          z: (-1.065 - 0.35) * this.flipped,
        },
      })
    );

    this.add(
      new Box({
        width: 1.15,
        height: 0.1,
        depth: 2.5,
        color: "#808080",
        position: {
          x: 0,
          y: -0.2 - 0.375,
          z: (0.8 - 0.35) * this.flipped,
        },
      })
    );

    this.add(
      new Box({
        width: 1.15,
        height: 1.25,
        depth: 2.5,
        color: "white",
        position: {
          x: 0,
          y: 0.475 - 0.375,
          z: (0.8 - 0.35) * this.flipped,
        },
      })
    );

    this.add(
      new Box({
        width: 1.155,
        height: 0.75,
        depth: 2.55,
        color: this.color.sub,
        position: {
          x: 0,
          y: 0.5 - 0.375,
          z: (0.8 - 0.35) * this.flipped,
        },
      })
    );

    this.add(
      new Box({
        width: 1.05,
        height: 0.3,
        depth: 0.3,
        color: "#000000",
        position: {
          x: 0,
          y: -0.2 - 0.375,
          z: (-1 - 0.35) * this.flipped,
        },
      })
    );

    this.add(
      new Box({
        width: 1.055,
        height: 0.1,
        depth: 0.1,
        color: "#FFFFFF",
        position: {
          x: 0,
          y: -0.2 - 0.375,
          z: (-1 - 0.35) * this.flipped,
        },
      })
    );

    this.add(
      new Box({
        width: 1.165,
        height: 0.3,
        depth: 0.3,
        color: "#000000",
        position: {
          x: 0,
          y: -0.2 - 0.375,
          z: (1.5 - 0.35) * this.flipped,
        },
      })
    );

    this.add(
      new Box({
        width: 1.1655,
        height: 0.1,
        depth: 0.1,
        color: "#FFFFFF",
        position: {
          x: 0,
          y: -0.2 - 0.375,
          z: (1.5 - 0.35) * this.flipped,
        },
      })
    );

    this.add(
      new Box({
        width: 1.165,
        height: 0.3,
        depth: 0.3,
        color: "#000000",
        position: {
          x: 0,
          y: -0.2 - 0.375,
          z: (0.1 - 0.35) * this.flipped,
        },
      })
    );

    this.add(
      new Box({
        width: 1.1655,
        height: 0.1,
        depth: 0.1,
        color: "#FFFFFF",
        position: {
          x: 0,
          y: -0.2 - 0.375,
          z: (0.1 - 0.35) * this.flipped,
        },
      })
    );

    this.add(
      new Box({
        width: 0.2,
        height: 0.1,
        depth: 0.1,
        color: "#cfe1ff",
        position: {
          x: 0.35,
          y: 0 - 0.375,
          z: (-1.35 - 0.35) * this.flipped,
        },
      })
    );

    this.add(
      new Box({
        width: 0.2,
        height: 0.1,
        depth: 0.1,
        color: "#cfe1ff",
        position: {
          x: -0.35,
          y: 0 - 0.375,
          z: (-1.35 - 0.35) * this.flipped,
        },
      })
    );

    this.add(
      new Box({
        width: 0.15,
        height: 0.08,
        depth: 0.1,
        color: "#ff4747",
        position: {
          x: 0.45,
          y: -0.15 - 0.375,
          z: (2.015 - 0.35) * this.flipped,
        },
      })
    );

    this.add(
      new Box({
        width: 0.15,
        height: 0.08,
        depth: 0.1,
        color: "#ff4747",
        position: {
          x: -0.45,
          y: -0.15 - 0.375,
          z: (2.015 - 0.35) * this.flipped,
        },
      })
    );

    this.add(
      new Box({
        width: 1.05,
        height: 0.2,
        depth: 0.1,
        color: "gray",
        position: {
          x: 0,
          y: 0.15 - 0.375,
          z: (-0.9 - 0.35) * this.flipped,
        },
      })
    );
  }

  updateSides() {
    this.hitBox.bottom = this.position.y - this.hitBox.height / 2;
    this.hitBox.top = this.position.y + this.hitBox.height / 2;

    this.hitBox.right = this.position.x + this.hitBox.width / 2;
    this.hitBox.left = this.position.x - this.hitBox.width / 2;

    this.hitBox.front = this.position.z + this.hitBox.depth / 2;
    this.hitBox.back = this.position.z - this.hitBox.depth / 2;
  }

  update(ground: any) {
    this.updateSides();

    if (this.zAcceleration) this.velocity.z += 0.0003;

    if (this.hitBox.bottom >= ground.top) {
      this.position.x += this.velocity.x;
      this.position.z += this.velocity.z;
    }

    this.applyGravity(ground);
  }

  applyGravity(ground: any) {
    this.velocity.y += this.gravity;
    if (
      boxCollision({
        box1: this.hitBox,
        box2: ground,
        velocityY: this.velocity.y,
      })
    ) {
      this.velocity.y *= this.friction;
      this.velocity.y = -this.velocity.y;
    } else this.position.y += this.velocity.y;
  }
}
