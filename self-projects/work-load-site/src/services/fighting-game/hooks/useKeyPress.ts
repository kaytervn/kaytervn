/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

const useKeyPress = ({ player, enemy, key }: any) => {
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
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
    };

    const keyUpHandler = (event: KeyboardEvent) => {
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
    };

    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
    };
  }, [player, enemy]);
};

export default useKeyPress;
