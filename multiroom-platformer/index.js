const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const overlay = {
  opacity: 0,
};

const key = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

let parsedCollisons;
let collisionBlocks;
let background;
let door;

let level = 1;
const levels = {
  1: {
    init: () => {
      parsedCollisons = collisionLevel1.parse2d();
      collisionBlocks = parsedCollisons.createObjectsFrom2d();
      player.collisionBlocks = collisionBlocks;
      player.position = {
        x: 200,
        y: 200,
      };
      if (player.currentSprite) {
        player.currentSprite.isActive = false;
      }
      background = backgrounds[level];
      door = doors[level];
    },
  },
  2: {
    init: () => {
      parsedCollisons = collisionLevel2.parse2d();
      collisionBlocks = parsedCollisons.createObjectsFrom2d();
      player.collisionBlocks = collisionBlocks;
      player.position = {
        x: 100,
        y: 70,
      };
      if (player.currentSprite) {
        player.currentSprite.isActive = false;
      }
      background = backgrounds[level];
      door = doors[level];
    },
  },
  3: {
    init: () => {
      parsedCollisons = collisionLevel3.parse2d();
      collisionBlocks = parsedCollisons.createObjectsFrom2d();
      player.collisionBlocks = collisionBlocks;
      if (player.currentSprite) {
        player.currentSprite.isActive = false;
      }
      player.position = {
        x: 800,
        y: 150,
      };
      background = backgrounds[level];
      door = doors[level];
    },
  },
};

function animate() {
  window.requestAnimationFrame(animate);

  background.update();
  door.update();

  // collisionBlocks.forEach((collisionBlock) => {
  //   collisionBlock.draw();
  // });
  // player.drawHitbox();

  player.update();
  player.handleInput(key);

  c.save();
  c.globalAlpha = overlay.opacity;
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.restore();
}

levels[level].init();
animate();
