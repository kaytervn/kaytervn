/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useRef, useState } from "react";
import { FIGHTING_GAME, GAMES } from "../../types/pageConfig";
import Sidebar from "../../components/main/Sidebar";
import useKeyPress from "../../services/fighting-game/hooks/useKeyPress";
import { canvasConfig, fps } from "../../services/fighting-game/constant";
import useGameElements from "../../services/fighting-game/hooks/useGameElements";
import { isColliding } from "../../services/fighting-game/utils";
import GameOverlay from "../../services/fighting-game/components/GameOverlay";

const FightingGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timer, setTimer] = useState(60);
  const [gameText, setGameText] = useState("");
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [context, setContext] = useState<any>(null);
  const [end, setEnd] = useState(false);
  const [gameElements, setGameElements] = useState<any>(null);
  const [key, setKey] = useState({
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
  });

  useEffect(() => {
    document.title = FIGHTING_GAME.label;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const c = canvas.getContext("2d");
    if (!c) return;

    canvas.width = canvasConfig.width;
    canvas.height = canvasConfig.height;

    c.fillRect(0, 0, canvas.width, canvas.height);

    setContext(c);

    const { player, enemy, background, shop } = useGameElements({ context: c });
    setGameElements({ player, enemy, background, shop });
  }, []);

  useKeyPress({
    player: gameElements?.player,
    enemy: gameElements?.enemy,
    key,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (gameElements) {
        gameElements.background.update();
        gameElements.shop.update();

        context.save();
        context.fillStyle = "rgba(255, 255, 255, 0.15)";
        context.fillRect(0, 0, canvasConfig.width, canvasConfig.height);
        context.restore();

        gameElements.player.update();
        gameElements.enemy.update();

        gameElements.player.velocity.x = 0;
        gameElements.enemy.velocity.x = 0;

        if (key.a.pressed && gameElements.player.lastKey === "a") {
          gameElements.player.velocity.x = -5;
          gameElements.player.switchSprite("run");
        } else if (key.d.pressed && gameElements.player.lastKey === "d") {
          gameElements.player.velocity.x = 5;
          gameElements.player.switchSprite("run");
        } else {
          gameElements.player.switchSprite("idle");
        }

        if (gameElements.player.velocity.y < 0) {
          gameElements.player.switchSprite("jump");
        } else if (gameElements.player.velocity.y > 0) {
          gameElements.player.switchSprite("fall");
        }

        if (
          key.ArrowLeft.pressed &&
          gameElements.enemy.lastKey === "ArrowLeft"
        ) {
          gameElements.enemy.velocity.x = -5;
          gameElements.enemy.switchSprite("run");
        } else if (
          key.ArrowRight.pressed &&
          gameElements.enemy.lastKey === "ArrowRight"
        ) {
          gameElements.enemy.velocity.x = 5;
          gameElements.enemy.switchSprite("run");
        } else {
          gameElements.enemy.switchSprite("idle");
        }

        if (gameElements.enemy.velocity.y < 0) {
          gameElements.enemy.switchSprite("jump");
        } else if (gameElements.enemy.velocity.y > 0) {
          gameElements.enemy.switchSprite("fall");
        }

        if (
          gameElements.player.isAttacking &&
          gameElements.player.framesCurrent === gameElements.player.attackFrame
        ) {
          gameElements.player.isAttacking = false;
          if (
            !end &&
            isColliding({
              attackBox: gameElements.player.attackBox,
              hitBox: gameElements.enemy.hitBox,
            })
          ) {
            const dmg =
              (1000 * gameElements.player.attackFrame) /
              gameElements.player.attackBox.width;
            gameElements.enemy.takeHit(dmg);
            handleEnemyDamage(dmg);
          }
        }

        if (
          gameElements.enemy.isAttacking &&
          gameElements.enemy.framesCurrent === gameElements.enemy.attackFrame
        ) {
          gameElements.enemy.isAttacking = false;
          if (
            !end &&
            isColliding({
              attackBox: gameElements.enemy.attackBox,
              hitBox: gameElements.player.hitBox,
            })
          ) {
            const dmg =
              (1000 * gameElements.enemy.attackFrame) /
              gameElements.enemy.attackBox.width;
            gameElements.player.takeHit(dmg);
            handlePlayerDamage(dmg);
          }
        }

        if (gameElements.player.health <= 0 || gameElements.enemy.health <= 0) {
          determineWinner({
            player: gameElements.player,
            enemy: gameElements.enemy,
          });
        }
      }
    }, fps);

    return () => clearInterval(intervalId);
  }, [gameElements]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (!end) {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }
      if (timer == 0) {
        determineWinner({
          player: gameElements?.player,
          enemy: gameElements?.enemy,
        });
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [end, timer]);

  const determineWinner = ({ player, enemy }: any) => {
    if (player.health == enemy.health) {
      setGameText("Tie");
    } else if (player.health > enemy.health) {
      setGameText(player.nameBox.text + " Wins");
    } else {
      setGameText(enemy.nameBox.text + " Wins");
    }
    setEnd(true);
  };

  const handlePlayerDamage = (damage: number) => {
    setPlayerHealth((prev) => Math.max(0, prev - damage));
  };

  const handleEnemyDamage = (damage: number) => {
    setEnemyHealth((prev) => Math.max(0, prev - damage));
  };

  const resetGame = () => {
    setTimer(60);
    setGameText("");
    setPlayerHealth(100);
    setEnemyHealth(100);
    setEnd(false);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const c = canvas.getContext("2d");
    if (!c) return;

    canvas.width = canvasConfig.width;
    canvas.height = canvasConfig.height;

    c.fillRect(0, 0, canvas.width, canvas.height);

    const { player, enemy, background, shop } = useGameElements({
      context: c,
    });
    setGameElements({ player, enemy, background, shop });
    setContext(c);
  };

  return (
    <Sidebar
      activeItem={GAMES.name}
      breadcrumbs={[
        { label: GAMES.label, path: GAMES.path },
        { label: FIGHTING_GAME.label },
      ]}
      renderContent={
        <>
          <div className="relative p-4 max-w-7xl flex justify-center mx-auto">
            <canvas
              ref={canvasRef}
              className="rounded-[15px] z-0 w-full h-full"
            />
            <GameOverlay
              timer={timer}
              playerHealth={playerHealth}
              enemyHealth={enemyHealth}
              gameText={gameText}
              end={end}
              onReset={resetGame}
            />
          </div>
        </>
      }
    />
  );
};

export default FightingGame;
