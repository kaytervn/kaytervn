/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

const useKeyPress = ({ player, door, key }: any) => {
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
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
    };

    const keyUpHandler = (event: KeyboardEvent) => {
      switch (event.key) {
        case "a":
          key.a.pressed = false;
          break;
        case "d":
          key.d.pressed = false;
          break;
      }
    };

    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
    };
  }, [player]);
};

export default useKeyPress;
