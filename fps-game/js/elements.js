import * as THREE from "three";
import { Box } from "./Box.js";

const ground = new Box({
  width: 50,
  height: 0.5,
  depth: 50,
  color: "#2f322a",
  position: {
    x: 0,
    y: -2,
    z: 0,
  },
});
ground.receiveShadow = true;

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.y = 3;
light.position.z = 1;
light.castShadow = true;

export { ground, light };
