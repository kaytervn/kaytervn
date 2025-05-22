import { initImage } from "../../fighting-game/utils";
import backgroundLv1 from "../../../assets/multiroom/backgroundLevel1(1).png";
import backgroundLv2 from "../../../assets/multiroom/backgroundLevel2(1).png";
import backgroundLv3 from "../../../assets/multiroom/backgroundLevel3(1).png";
import doorOpen1 from "../../../assets/multiroom/doorOpen/doorOpen(1).png";
import doorOpen2 from "../../../assets/multiroom/doorOpen/doorOpen(2).png";
import doorOpen3 from "../../../assets/multiroom/doorOpen/doorOpen(3).png";
import doorOpen4 from "../../../assets/multiroom/doorOpen/doorOpen(4).png";
import doorOpen5 from "../../../assets/multiroom/doorOpen/doorOpen(5).png";
import kingIdle1 from "../../../assets/multiroom/king/idle/idle(1).png";
import kingIdle2 from "../../../assets/multiroom/king/idle/idle(2).png";
import kingIdle3 from "../../../assets/multiroom/king/idle/idle(3).png";
import kingIdle4 from "../../../assets/multiroom/king/idle/idle(4).png";
import kingIdle5 from "../../../assets/multiroom/king/idle/idle(5).png";
import kingIdle6 from "../../../assets/multiroom/king/idle/idle(6).png";
import kingIdle7 from "../../../assets/multiroom/king/idle/idle(7).png";
import kingIdle8 from "../../../assets/multiroom/king/idle/idle(8).png";
import kingIdle9 from "../../../assets/multiroom/king/idle/idle(9).png";
import kingIdle10 from "../../../assets/multiroom/king/idle/idle(10).png";
import kingIdleLeft1 from "../../../assets/multiroom/king/idle/left/idle(1).png";
import kingIdleLeft2 from "../../../assets/multiroom/king/idle/left/idle(2).png";
import kingIdleLeft3 from "../../../assets/multiroom/king/idle/left/idle(3).png";
import kingIdleLeft4 from "../../../assets/multiroom/king/idle/left/idle(4).png";
import kingIdleLeft5 from "../../../assets/multiroom/king/idle/left/idle(5).png";
import kingIdleLeft6 from "../../../assets/multiroom/king/idle/left/idle(6).png";
import kingIdleLeft7 from "../../../assets/multiroom/king/idle/left/idle(7).png";
import kingIdleLeft8 from "../../../assets/multiroom/king/idle/left/idle(8).png";
import kingIdleLeft9 from "../../../assets/multiroom/king/idle/left/idle(9).png";
import kingIdleLeft10 from "../../../assets/multiroom/king/idle/left/idle(10).png";
import kingRun1 from "../../../assets/multiroom/king/run/run(1).png";
import kingRun2 from "../../../assets/multiroom/king/run/run(2).png";
import kingRun3 from "../../../assets/multiroom/king/run/run(3).png";
import kingRun4 from "../../../assets/multiroom/king/run/run(4).png";
import kingRun5 from "../../../assets/multiroom/king/run/run(5).png";
import kingRun6 from "../../../assets/multiroom/king/run/run(6).png";
import kingRun7 from "../../../assets/multiroom/king/run/run(7).png";
import kingRun8 from "../../../assets/multiroom/king/run/run(8).png";
import kingRunLeft1 from "../../../assets/multiroom/king/run/left/run(1).png";
import kingRunLeft2 from "../../../assets/multiroom/king/run/left/run(2).png";
import kingRunLeft3 from "../../../assets/multiroom/king/run/left/run(3).png";
import kingRunLeft4 from "../../../assets/multiroom/king/run/left/run(4).png";
import kingRunLeft5 from "../../../assets/multiroom/king/run/left/run(5).png";
import kingRunLeft6 from "../../../assets/multiroom/king/run/left/run(6).png";
import kingRunLeft7 from "../../../assets/multiroom/king/run/left/run(7).png";
import kingRunLeft8 from "../../../assets/multiroom/king/run/left/run(8).png";
import kingDoorIn1 from "../../../assets/multiroom/king/doorIn/doorIn(1).png";
import kingDoorIn2 from "../../../assets/multiroom/king/doorIn/doorIn(2).png";
import kingDoorIn3 from "../../../assets/multiroom/king/doorIn/doorIn(3).png";
import kingDoorIn4 from "../../../assets/multiroom/king/doorIn/doorIn(4).png";
import kingDoorIn5 from "../../../assets/multiroom/king/doorIn/doorIn(5).png";
import kingDoorIn6 from "../../../assets/multiroom/king/doorIn/doorIn(6).png";
import kingDoorIn7 from "../../../assets/multiroom/king/doorIn/doorIn(7).png";
import kingDoorIn8 from "../../../assets/multiroom/king/doorIn/doorIn(8).png";
import kingDoorInLeft1 from "../../../assets/multiroom/king/doorIn/left/doorIn(1).png";
import kingDoorInLeft2 from "../../../assets/multiroom/king/doorIn/left/doorIn(2).png";
import kingDoorInLeft3 from "../../../assets/multiroom/king/doorIn/left/doorIn(3).png";
import kingDoorInLeft4 from "../../../assets/multiroom/king/doorIn/left/doorIn(4).png";
import kingDoorInLeft5 from "../../../assets/multiroom/king/doorIn/left/doorIn(5).png";
import kingDoorInLeft6 from "../../../assets/multiroom/king/doorIn/left/doorIn(6).png";
import kingDoorInLeft7 from "../../../assets/multiroom/king/doorIn/left/doorIn(7).png";
import kingDoorInLeft8 from "../../../assets/multiroom/king/doorIn/left/doorIn(8).png";
import Sprite from "../classes/Sprite";
import Player from "../classes/Player";

const useGameElements = ({ context, onDoorComplete }: any) => {
  const backgrounds = {
    1: new Sprite({
      context,
      position: {
        x: 0,
        y: 0,
      },
      imageSrc: {
        default: [initImage(backgroundLv1)],
      },
    }),
    2: new Sprite({
      context,
      position: {
        x: 0,
        y: 0,
      },
      imageSrc: {
        default: [initImage(backgroundLv2)],
      },
    }),
    3: new Sprite({
      context,
      position: {
        x: 0,
        y: 0,
      },
      imageSrc: {
        default: [initImage(backgroundLv3)],
      },
    }),
  };

  const doors = {
    1: new Sprite({
      context,
      position: {
        x: 767,
        y: 273,
      },
      imageSrc: {
        default: [
          initImage(doorOpen1),
          initImage(doorOpen2),
          initImage(doorOpen3),
          initImage(doorOpen4),
          initImage(doorOpen5),
        ],
      },
      loop: false,
      scale: 2,
      autoPlay: false,
    }),
    2: new Sprite({
      context,
      position: {
        x: 773,
        y: 336,
      },
      imageSrc: {
        default: [
          initImage(doorOpen1),
          initImage(doorOpen2),
          initImage(doorOpen3),
          initImage(doorOpen4),
          initImage(doorOpen5),
        ],
      },
      loop: false,
      scale: 2,
      autoPlay: false,
    }),
    3: new Sprite({
      context,
      position: {
        x: 176,
        y: 335,
      },
      imageSrc: {
        default: [
          initImage(doorOpen1),
          initImage(doorOpen2),
          initImage(doorOpen3),
          initImage(doorOpen4),
          initImage(doorOpen5),
        ],
      },
      loop: false,
      scale: 2,
      autoPlay: false,
    }),
  };

  const player = new Player({
    context,
    position: {
      x: 200,
      y: 200,
    },
    imageSrc: {
      default: [
        initImage(kingIdle1),
        initImage(kingIdle2),
        initImage(kingIdle3),
        initImage(kingIdle4),
        initImage(kingIdle5),
        initImage(kingIdle6),
        initImage(kingIdle7),
        initImage(kingIdle8),
        initImage(kingIdle9),
        initImage(kingIdle10),
      ],
      flipped: [
        initImage(kingIdleLeft1),
        initImage(kingIdleLeft2),
        initImage(kingIdleLeft3),
        initImage(kingIdleLeft4),
        initImage(kingIdleLeft5),
        initImage(kingIdleLeft6),
        initImage(kingIdleLeft7),
        initImage(kingIdleLeft8),
        initImage(kingIdleLeft9),
        initImage(kingIdleLeft10),
      ],
    },
    scale: 2,
    offset: {
      x: -42,
      y: -29,
      flippedX: -75,
    },
    width: 40,
    height: 58,
    sprites: {
      idle: {
        default: [
          initImage(kingIdle1),
          initImage(kingIdle2),
          initImage(kingIdle3),
          initImage(kingIdle4),
          initImage(kingIdle5),
          initImage(kingIdle6),
          initImage(kingIdle7),
          initImage(kingIdle8),
          initImage(kingIdle9),
          initImage(kingIdle10),
        ],
        flipped: [
          initImage(kingIdleLeft1),
          initImage(kingIdleLeft2),
          initImage(kingIdleLeft3),
          initImage(kingIdleLeft4),
          initImage(kingIdleLeft5),
          initImage(kingIdleLeft6),
          initImage(kingIdleLeft7),
          initImage(kingIdleLeft8),
          initImage(kingIdleLeft9),
          initImage(kingIdleLeft10),
        ],
        loop: true,
      },
      doorIn: {
        default: [
          initImage(kingDoorIn1),
          initImage(kingDoorIn2),
          initImage(kingDoorIn3),
          initImage(kingDoorIn4),
          initImage(kingDoorIn5),
          initImage(kingDoorIn6),
          initImage(kingDoorIn7),
          initImage(kingDoorIn8),
        ],
        flipped: [
          initImage(kingDoorInLeft1),
          initImage(kingDoorInLeft2),
          initImage(kingDoorInLeft3),
          initImage(kingDoorInLeft4),
          initImage(kingDoorInLeft5),
          initImage(kingDoorInLeft6),
          initImage(kingDoorInLeft7),
          initImage(kingDoorInLeft8),
        ],
        loop: false,
        onComplete: onDoorComplete,
      },
      run: {
        default: [
          initImage(kingRun1),
          initImage(kingRun2),
          initImage(kingRun3),
          initImage(kingRun4),
          initImage(kingRun5),
          initImage(kingRun6),
          initImage(kingRun7),
          initImage(kingRun8),
        ],
        flipped: [
          initImage(kingRunLeft1),
          initImage(kingRunLeft2),
          initImage(kingRunLeft3),
          initImage(kingRunLeft4),
          initImage(kingRunLeft5),
          initImage(kingRunLeft6),
          initImage(kingRunLeft7),
          initImage(kingRunLeft8),
        ],
        loop: true,
      },
    },
  });

  return {
    player,
    doors,
    backgrounds,
  };
};

export default useGameElements;
