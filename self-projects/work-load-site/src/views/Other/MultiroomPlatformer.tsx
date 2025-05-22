/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { GAMES, MULTIROOM_PLATFORMER } from "../../types/pageConfig";
import Sidebar from "../../components/main/Sidebar";
import {
  collisionLevel1,
  collisionLevel2,
  collisionLevel3,
} from "../../services/multiroom/data/collisions";
import { canvasConfig, fps } from "../../services/multiroom/data/constant";
import useGameElements from "../../services/multiroom/hooks/useGameElements";
import useKeyPress from "../../services/multiroom/hooks/useKeyPress";
import "../../services/multiroom/utils";

const MultiroomPlatformer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<any>(null);
  const [background, setBackground] = useState<any>(null);
  const [level, setLevel] = useState<any>(1);
  const [gameElements, setGameElements] = useState<any>(null);
  const [key, setKey] = useState({
    a: {
      pressed: false,
    },
    d: {
      pressed: false,
    },
  });

  const initLevel1 = (player: any) => {
    player.collisionBlocks = collisionLevel1.parse2d().createObjectsFrom2d();
    player.position = {
      x: 200,
      y: 200,
    };
    if (player.currentSprite) {
      player.currentSprite.isActive = false;
    }
    setBackground(gameElements?.backgrounds[level]);
    player.switchSprite("idle");
    player.preventInput = false;
  };

  const initLevel2 = (player: any) => {
    player.collisionBlocks = collisionLevel2.parse2d().createObjectsFrom2d();
    player.position = {
      x: 100,
      y: 70,
    };
    if (player.currentSprite) {
      player.currentSprite.isActive = false;
    }
    setBackground(gameElements?.backgrounds[level]);
    player.switchSprite("idle");
    player.preventInput = false;
  };

  const initLevel3 = (player: any) => {
    player.collisionBlocks = collisionLevel3.parse2d().createObjectsFrom2d();
    if (player.currentSprite) {
      player.currentSprite.isActive = false;
    }
    player.position = {
      x: 800,
      y: 150,
    };
    setBackground(gameElements?.backgrounds[level]);
    player.switchSprite("idle");
    player.preventInput = false;
  };

  const onComplete = () => {
    setTimeout(() => {
      setLevel((prevLevel: number) => {
        const newLevel = prevLevel + 1 > 3 ? 1 : prevLevel + 1;
        if (gameElements?.doors[newLevel]) {
          gameElements.doors[newLevel].reset();
        }
        return newLevel;
      });

      const c = canvasRef.current?.getContext("2d");
      if (!c) return;

      const { player, doors, backgrounds } = useGameElements({
        context: c,
        onDoorComplete: onComplete,
      });
      setGameElements({ doors, backgrounds, player });
    }, 100);
  };

  useEffect(() => {
    document.title = MULTIROOM_PLATFORMER.label;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const c = canvas.getContext("2d");
    if (!c) return;

    canvas.width = canvasConfig.width;
    canvas.height = canvasConfig.height;

    c.fillRect(0, 0, canvas.width, canvas.height);

    setContext(c);

    const { player, doors, backgrounds } = useGameElements({
      context: c,
      onDoorComplete: onComplete,
    });
    setGameElements({ player, doors, backgrounds });
  }, []);

  useEffect(() => {
    if (gameElements?.player && level === 1) {
      initLevel1(gameElements.player);
    } else if (gameElements?.player && level === 2) {
      initLevel2(gameElements.player);
    } else if (gameElements?.player && level === 3) {
      initLevel3(gameElements.player);
    }
  }, [gameElements, level]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (gameElements && background) {
        background.update();
        gameElements?.doors[level].update();

        gameElements.player.update();
        gameElements.player.handleInput(key);
      }
    }, fps);

    return () => clearInterval(intervalId);
  }, [gameElements, background]);

  useKeyPress({
    player: gameElements?.player,
    door: gameElements?.doors[level],
    key,
  });

  return (
    <Sidebar
      activeItem={GAMES.name}
      breadcrumbs={[
        { label: GAMES.label, path: GAMES.path },
        { label: MULTIROOM_PLATFORMER.label },
      ]}
      renderContent={
        <>
          <div className="p-4 max-w-7xl flex justify-center mx-auto">
            <canvas ref={canvasRef} className="rounded-[15px] h-full w-full" />
          </div>
        </>
      }
    />
  );
};

export default MultiroomPlatformer;
