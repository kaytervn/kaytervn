let timer = 60;
let timerId;

function isColliding({ attackBox, hitBox }) {
  return !(
    attackBox.position.x + attackBox.width < hitBox.position.x ||
    hitBox.position.x + hitBox.width < attackBox.position.x ||
    attackBox.position.y + attackBox.height < hitBox.position.y ||
    hitBox.position.y + hitBox.height < attackBox.position.y
  );
}

function determineWinner() {
  clearTimeout(timerId);
  document.getElementById("displayText").style.display = "flex";
  if (player.health == enemy.health) {
    document.getElementById("displayText").innerHTML = "Tie";
    end = true;
  } else if (player.health > enemy.health) {
    document.getElementById("displayText").innerHTML =
      player.nameBox.text + " Wins";
    end = true;
  } else {
    document.getElementById("displayText").innerHTML =
      enemy.nameBox.text + " Wins";
    end = true;
  }
}

function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.getElementById("timer").innerHTML = timer;
  }

  if (timer == 0) {
    determineWinner();
  }
}

const initImage = (src) => {
  let image = new Image();
  image.src = src;
  return image;
};
