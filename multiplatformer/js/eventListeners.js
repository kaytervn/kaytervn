window.addEventListener("keydown", (event) => {
  if (player.preventInput) return;
  switch (event.key) {
    case "w":
      if (
        player.position.x <= door.position.x + door.image.width &&
        player.position.x + player.width >= door.position.x &&
        player.position.y <= door.position.y + door.image.height &&
        player.position.y + player.height >= door.position.y
      ) {
        player.velocity.x = 0;
        player.velocity.y = 0;
        player.preventInput = true;
        player.switchSprite("doorIn");
        door.play();
        return;
      }
      if (player.velocity.y == 0) {
        player.velocity.y -= 15;
      }
      break;
    case "a":
      key.a.pressed = true;
      break;
    case "d":
      key.d.pressed = true;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "a":
      key.a.pressed = false;
      break;
    case "d":
      key.d.pressed = false;
      break;
  }
});
