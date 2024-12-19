import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { Box } from "./Box.js";
import { Gun } from "./Gun.js";
import { Bullet } from "./Bullet.js";
import { crosshair } from "./Crosshair.js";
import { ground, light } from "./elements.js";

document.body.appendChild(crosshair);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const cameraGunContainer = new THREE.Object3D();
scene.add(cameraGunContainer);
const gun = new Gun({
  position: {
    x: 0.75,
    y: -0.45,
    z: -0.75,
  },
  flipped: -1,
  color: "#138D75",
});
cameraGunContainer.add(gun);
camera.position.set(0, 0, 0);
cameraGunContainer.add(camera);
cameraGunContainer.position.set(0, 1.6, 0);
const controls = new PointerLockControls(cameraGunContainer, document.body);
controls.pointerSpeed = 0.5;
scene.add(controls.getObject());

document.addEventListener("click", function () {
  controls.lock();
});
scene.add(ground);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const moveState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};

document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyW":
      moveState.forward = true;
      break;
    case "KeyS":
      moveState.backward = true;
      break;
    case "KeyA":
      moveState.left = true;
      break;
    case "KeyD":
      moveState.right = true;
      break;
  }
});

document.addEventListener("keyup", (event) => {
  switch (event.code) {
    case "KeyW":
      moveState.forward = false;
      break;
    case "KeyS":
      moveState.backward = false;
      break;
    case "KeyA":
      moveState.left = false;
      break;
    case "KeyD":
      moveState.right = false;
      break;
  }
});

const bullets = [];

function shootBullet() {
  const bullet = new Bullet();
  bullet.position.copy(gun.getWorldPosition(new THREE.Vector3()));
  bullet.position.add(new THREE.Vector3(0, 0.25, 0));

  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  bullet.velocity.copy(direction).multiplyScalar(0.5);
  bullet.lookAt(bullet.position.clone().add(direction));

  scene.add(bullet);
  bullets.push(bullet);

  gun.position.add(new THREE.Vector3(-0.1, 0, 0.05));
  setTimeout(() => {
    gun.position.sub(new THREE.Vector3(-0.1, 0, 0.05));
  }, 100);
}

document.addEventListener("mousedown", (event) => {
  if (event.button === 0) {
    shootBullet();
  }
});

let bobTime = 0;
const bobFrequency = 3;
const bobAmplitude = 0.015;
const moveSpeed = 0.1;
const playerHeight = 1.6;

function moveCamera() {
  const direction = new THREE.Vector3();
  const sideDirection = new THREE.Vector3();
  const cameraDirection = controls.getDirection(new THREE.Vector3());

  if (moveState.forward) direction.add(cameraDirection);
  if (moveState.backward) direction.sub(cameraDirection);

  if (moveState.left)
    sideDirection.crossVectors(camera.up, cameraDirection).normalize();
  if (moveState.right)
    sideDirection.crossVectors(cameraDirection, camera.up).normalize();

  direction.add(sideDirection);

  let isMoving = false;
  if (direction.lengthSq() > 0) {
    isMoving = true;
    direction.y = 0;
    direction.normalize().multiplyScalar(moveSpeed);
  }

  cameraGunContainer.position.add(direction);
  cameraGunContainer.position.y = playerHeight;

  if (isMoving) {
    bobTime += 0.1;
    const bobOffset = Math.sin(bobTime * bobFrequency) * bobAmplitude;
    gun.position.y = -0.45 + bobOffset;
  } else {
    bobTime = 0;
    gun.position.y = -0.45;
  }
}

function animate() {
  requestAnimationFrame(animate);
  moveCamera();
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    if (bullets[i].position.length() > 100) {
      scene.remove(bullets[i]);
      bullets.splice(i, 1);
    }
  }
  renderer.render(scene, camera);
}
animate();
