/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Car } from "../../services/3d-racing-game/Car";
import { Box } from "../../services/3d-racing-game/Box";
import { boxCollision } from "../../services/3d-racing-game/utils";
import { Truck } from "../../services/3d-racing-game/Truck.js";
import Sidebar from "../../components/main/Sidebar.js";
import { GAMES, THREE_D_RACING_GAME } from "../../types/pageConfig.js";
import { RotateCcwIcon } from "lucide-react";

const ThreeDRacingGame = () => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameText, setGameText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const colorPairs = [
    { main: "#A93226", sub: "#F1948A" },
    { main: "#884EA0", sub: "#BB8FCE" },
    { main: "#2471A3", sub: "#85C1E9" },
    { main: "#229954", sub: "#82E0AA" },
    { main: "#D68910", sub: "#F7DC6F" },
    { main: "#BA4A00", sub: "#F0B27A" },
    { main: "#273746", sub: "#85929E" },
  ];

  const sceneRef = useRef<THREE.Scene>(new THREE.Scene());
  const cameraRef = useRef(
    new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
  );

  const rendererRef = useRef<THREE.WebGLRenderer>();
  const controlsRef = useRef<OrbitControls>();
  const carRef = useRef<any>(null);
  const enemiesRef = useRef<any[]>([]);
  const dashLinesRef = useRef<any[]>([]);
  const framesRef = useRef(0);
  const spawnRateRef = useRef(300);
  const speedMultiplierRef = useRef(1);

  const keys = useRef({
    a: { pressed: false },
    d: { pressed: false },
    s: { pressed: false },
    w: { pressed: false },
  });

  useEffect(() => {
    if (!containerRef.current) return;

    cameraRef.current.position.set(4.61, 2.74, 8);
    rendererRef.current = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    rendererRef.current.shadowMap.enabled = true;
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(rendererRef.current.domElement);

    controlsRef.current = new OrbitControls(
      cameraRef.current,
      rendererRef.current.domElement
    );

    if (!carRef.current) {
      carRef.current = new Car({
        velocity: { x: 0, y: -0.01, z: 0 },
      });
      sceneRef.current.add(carRef.current);
    }

    const ground = new Box({
      width: 10,
      height: 0.5,
      depth: 50,
      color: "#000000",
      position: { x: 0, y: -2, z: 0 },
    });
    ground.receiveShadow = true;
    sceneRef.current.add(ground);

    const line = new Box({
      width: 0.15,
      height: 0.5,
      depth: 50,
      color: "yellow",
      position: {
        x: 0,
        y: -1.99,
        z: 0,
      },
    });
    line.receiveShadow = true;
    sceneRef.current.add(line);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.y = 3;
    light.position.z = 1;
    light.castShadow = true;
    sceneRef.current.add(light);
    sceneRef.current.add(new THREE.AmbientLight(0xffffff, 0.5));

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyA":
          keys.current.a.pressed = true;
          break;
        case "KeyD":
          keys.current.d.pressed = true;
          break;
        case "KeyS":
          keys.current.s.pressed = true;
          break;
        case "KeyW":
          keys.current.w.pressed = true;
          break;
        case "KeyJ":
          if (carRef.current.hitBox.bottom <= -1.745) {
            carRef.current.velocity.y = 0.08;
          }
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyA":
          keys.current.a.pressed = false;
          break;
        case "KeyD":
          keys.current.d.pressed = false;
          break;
        case "KeyS":
          keys.current.s.pressed = false;
          break;
        case "KeyW":
          keys.current.w.pressed = false;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    for (let i = -20; i <= 20; i += 5) {
      const dashLine1 = new Box({
        width: 0.15,
        height: 0.5,
        depth: 1.5,
        color: "yellow",
        position: {
          x: 2.5,
          y: -1.99,
          z: i,
        },
        velocity: {
          x: 0,
          y: 0,
          z: 0.1,
        },
      });
      dashLine1.receiveShadow = true;
      sceneRef.current.add(dashLine1);

      const dashLine2 = new Box({
        width: 0.15,
        height: 0.5,
        depth: 1.5,
        color: "yellow",
        position: {
          x: -2.5,
          y: -1.99,
          z: i,
        },
        velocity: {
          x: 0,
          y: 0,
          z: 0.1,
        },
      });
      dashLine2.receiveShadow = true;
      sceneRef.current.add(dashLine2);

      dashLinesRef.current.push(dashLine1);
      dashLinesRef.current.push(dashLine2);
    }

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      rendererRef.current?.render(sceneRef.current, cameraRef.current);

      setScore(Math.floor(framesRef.current * speedMultiplierRef.current));

      carRef.current.update(ground);

      if (carRef.current.position.y < -10) {
        handleGameOver({ text: "You are falling into hell", animationId });
      }

      if (speedMultiplierRef.current < 3) {
        speedMultiplierRef.current = 1 + framesRef.current / 30000;
      }

      carRef.current.velocity.x = 0;
      carRef.current.velocity.z = 0;

      if (keys.current.a.pressed)
        carRef.current.velocity.x = -0.05 * speedMultiplierRef.current;
      else if (keys.current.d.pressed)
        carRef.current.velocity.x = 0.05 * speedMultiplierRef.current;

      if (keys.current.s.pressed)
        carRef.current.velocity.z = 0.05 * speedMultiplierRef.current;
      else if (keys.current.w.pressed)
        carRef.current.velocity.z = -0.05 * speedMultiplierRef.current;

      enemiesRef.current.forEach((enemy) => {
        enemy.update(ground);
        if (
          boxCollision({
            box1: carRef.current.hitBox,
            box2: enemy.hitBox,
            velocityY: carRef.current.velocity.y,
          })
        ) {
          handleGameOver({
            text: "You hit another car",
            animationId,
          });
        }
      });

      dashLinesRef.current.forEach((dashLine) => {
        dashLine.update();
      });

      if (framesRef.current % spawnRateRef.current === 0) {
        if (spawnRateRef.current > 40) spawnRateRef.current -= 20;

        const enemy =
          Math.random() < 0.25
            ? new Truck({
                velocity: {
                  x: 0,
                  y: -0.05 * speedMultiplierRef.current,
                  z: 0.005,
                },
                position: { x: (Math.random() - 0.5) * 10, y: 0, z: -20 },
                zAcceleration: true,
                flipped: -1,
                color:
                  colorPairs[Math.floor(Math.random() * colorPairs.length)],
              })
            : new Car({
                velocity: {
                  x: 0,
                  y: -0.05 * speedMultiplierRef.current,
                  z: 0.005,
                },
                position: { x: (Math.random() - 0.5) * 10, y: 0, z: -20 },
                zAcceleration: true,
                flipped: -1,
                color:
                  colorPairs[Math.floor(Math.random() * colorPairs.length)],
              });

        sceneRef.current.add(enemy);
        enemiesRef.current.push(enemy);
      }

      framesRef.current++;
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (containerRef.current) {
        containerRef.current.removeChild(rendererRef.current!.domElement);
      }
    };
  }, [gameOver]);

  const handleGameOver = ({ text, animationId }: any) => {
    setGameOver(true);
    setGameText(text);
    cancelAnimationFrame(animationId);
  };

  return (
    <Sidebar
      activeItem={GAMES.name}
      breadcrumbs={[
        { label: GAMES.label, path: GAMES.path },
        { label: THREE_D_RACING_GAME.label },
      ]}
      renderContent={
        <>
          <div className="relative p-4 flex justify-center mx-auto">
            <div className="absolute top-10 left-4 z-10">
              <div className="bg-black/80 px-6 py-4 rounded-lg border-2 border-yellow-400 flex flex-col gap-4">
                <h2 className="font-['Press_Start_2P'] text-white text-xl">
                  SCORE: {score}
                </h2>
                <div className="flex flex-col gap-2 font-['Press_Start_2P'] text-white text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="border border-yellow-500 rounded text-yellow-400 px-2 py-1">
                        A
                      </span>
                      <span className="border border-yellow-500 rounded text-yellow-400 px-2 py-1">
                        S
                      </span>
                      <span className="border border-yellow-500 rounded text-yellow-400 px-2 py-1">
                        D
                      </span>
                      <span className="border border-yellow-500 rounded text-yellow-400 px-2 py-1">
                        W
                      </span>
                    </div>
                    <span className="text-xs">Move</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="border border-yellow-500 rounded text-yellow-400 px-2 py-1">
                      J
                    </span>
                    <span className="text-xs">Jump</span>
                  </div>
                </div>
              </div>
            </div>

            <div ref={containerRef} className="absolute inset-0 z-20" />

            {gameOver && (
              <div className="absolute inset-0 top-20 flex items-center justify-center z-30">
                <div className="mt-20 p-8 rounded-lg border-2 border-yellow-400 text-center max-w-md bg-black/80">
                  <h1 className="font-['Press_Start_2P'] text-yellow-400 text-xl mb-4">
                    GAME OVER
                  </h1>
                  <p className="font-['Press_Start_2P'] text-white text-sm mb-6">
                    {gameText}
                  </p>
                  <p className="font-['Press_Start_2P'] text-white text-sm mb-8">
                    Final Score: {score}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-['Press_Start_2P'] px-6 py-3 rounded-lg flex items-center justify-center gap-2 mx-auto transition-colors"
                  >
                    <RotateCcwIcon size={20} />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      }
    />
  );
};

export default ThreeDRacingGame;
