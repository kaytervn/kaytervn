const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1366;
canvas.height = 768;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

let end = false;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "img/background.png",
  scale: 1.34,
});

const shop = new Sprite({
  position: {
    x: 850,
    y: 195,
  },
  imageSrc: "img/shop.png",
  scale: 3.5,
  framesMax: 6,
});

const key = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

const listPlayer = [samuraiMack, robin, yangLee];
const listEnemy = [kenji, kingRichard, poorGuy];

player = listPlayer[Math.floor(Math.random() * listPlayer.length)];
enemy = listEnemy[Math.floor(Math.random() * listEnemy.length)];

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);

  background.update();
  shop.update();

  c.save();
  c.fillStyle = "rgba(255, 255, 255, 0.15)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.restore();

  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  if (key.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (key.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  if (key.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (key.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  if (player.isAttacking && player.framesCurrent === player.attackFrame) {
    player.isAttacking = false;
    if (
      !end &&
      isColliding({ attackBox: player.attackBox, hitBox: enemy.hitBox })
    ) {
      enemy.takeHit(
        parseInt((1000 * player.attackFrame) / player.attackBox.width)
      );
      gsap.to("#enemyHealth", { width: enemy.health + "%" });
    }
  }

  if (enemy.isAttacking && enemy.framesCurrent === enemy.attackFrame) {
    enemy.isAttacking = false;
    if (
      !end &&
      isColliding({ attackBox: enemy.attackBox, hitBox: player.hitBox })
    ) {
      player.takeHit(
        parseInt((1000 * enemy.attackFrame) / enemy.attackBox.width)
      );
      gsap.to("#playerHealth", { width: player.health + "%" });
    }
  }

  if (player.health <= 0 || enemy.health <= 0) {
    determineWinner();
  }
}

animate();

window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      case "d":
        key.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        key.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        player.jump();
        break;
      case "s":
        if (player.isAttacking == false) {
          player.attack();
        }
        break;
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowLeft":
        key.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowRight":
        key.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowUp":
        enemy.jump();
        break;
      case "ArrowDown":
        if (enemy.isAttacking == false) {
          enemy.attack();
        }
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      key.d.pressed = false;
      break;
    case "a":
      key.a.pressed = false;
      break;
    case "ArrowLeft":
      key.ArrowLeft.pressed = false;
      break;
    case "ArrowRight":
      key.ArrowRight.pressed = false;
      break;
  }
});
