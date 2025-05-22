import * as THREE from "three";

export class Box extends THREE.Mesh {
  width: number;
  height: number;
  depth: number;
  velocity: any;
  right: number;
  left: number;
  bottom: number;
  top: number;
  front: number;
  back: number;

  constructor({
    width,
    height,
    depth,
    color = "#00ff00",
    position = {
      x: 0,
      y: 0,
      z: 0,
    },
    velocity = {
      x: 0,
      y: 0,
      z: 0,
    },
  }: any) {
    super(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshStandardMaterial({ color })
    );
    this.position.set(position.x, position.y, position.z);
    this.castShadow = true;
    this.velocity = velocity;

    this.width = width;
    this.height = height;
    this.depth = depth;

    this.right = this.position.x + this.width / 2;
    this.left = this.position.x - this.width / 2;

    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;

    this.front = this.position.z + this.depth / 2;
    this.back = this.position.z - this.depth / 2;
  }

  update() {
    if (this.velocity.z < 1) this.velocity.z += 0.00001;
    this.position.z += this.velocity.z;
    if (this.position.z >= 20) {
      this.position.z = -20;
    }
  }
}
