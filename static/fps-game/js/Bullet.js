import * as THREE from "three";

export class Bullet extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.BoxGeometry(0.015, 0.015, 0.15);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    super(geometry, material);

    this.velocity = new THREE.Vector3();
  }

  update() {
    this.position.add(this.velocity);
  }
}
