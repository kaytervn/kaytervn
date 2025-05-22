import * as THREE from "three";
import { Box } from "./Box";
import { boxCollision } from "./utils";

export class Car extends THREE.Group {
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
      main: "#138D75",
      sub: "#76D7C4",
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
      width: 1,
      height: 0.7,
      depth: 2.1,
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
        height: 0.3,
        depth: 2,
        color: this.color.sub,
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
      })
    );

    this.add(
      new Box({
        width: 0.85,
        height: 0.45,
        depth: 1.1,
        color: "#ffffff",
        position: {
          x: 0,
          y: 0.3,
          z: 0.1 * this.flipped,
        },
      })
    );

    this.add(
      new Box({
        width: 0.7,
        height: 0.3,
        depth: 1.115,
        color: "#000000",
        position: {
          x: 0,
          y: 0.3,
          z: 0.1 * this.flipped,
        },
      })
    );

    this.add(
      new Box({
        width: 0.855,
        height: 0.3,
        depth: 0.7,
        color: "#000000",
        position: {
          x: 0,
          y: 0.3,
          z: -0.03 * this.flipped,
        },
      })
    );

    this.add(
      new Box({
        width: 0.855,
        height: 0.3,
        depth: 0.2,
        color: "#000000",
        position: {
          x: 0,
          y: 0.3,
          z: 0.475 * this.flipped,
        },
      })
    );

    this.add(
      new Box({
        width: 1.15,
        height: 0.1,
        depth: 0.25,
        color: this.color.main,
        position: {
          x: 0,
          y: 0.075,
          z: -0.2 * this.flipped,
        },
      })
    );

    this.add(
      new Box({
        width: 0.845,
        height: 0.35,
        depth: 2.1,
        color: this.color.main,
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
      })
    );

    this.add(
      new Box({
        width: 1,
        height: 0.1,
        depth: 2,
        color: "#808080",
        position: {
          x: 0,
          y: -0.2,
          z: 0,
        },
      })
    );

    // Backwheels
    this.add(
      new Box({
        width: 1.05,
        height: 0.3,
        depth: 0.3,
        color: "#000000",
        position: {
          x: 0,
          y: -0.2,
          z: 0.6 * this.flipped,
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
          y: -0.2,
          z: 0.6 * this.flipped,
        },
      })
    );

    // Frontwheels
    this.add(
      new Box({
        width: 1.05,
        height: 0.3,
        depth: 0.3,
        color: "#000000",
        position: {
          x: 0,
          y: -0.2,
          z: -0.6 * this.flipped,
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
          y: -0.2,
          z: -0.6 * this.flipped,
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
          x: 0.25,
          y: 0,
          z: -1.01 * this.flipped,
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
          x: -0.25,
          y: 0,
          z: -1.01 * this.flipped,
        },
      })
    );

    this.add(
      new Box({
        width: 0.35,
        height: 0.12,
        depth: 0.1,
        color: "white",
        position: {
          x: 0,
          y: 0,
          z: 1.01 * this.flipped,
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
          x: 0.3,
          y: 0.1,
          z: 1.01 * this.flipped,
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
          x: -0.3,
          y: 0.1,
          z: 1.01 * this.flipped,
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
