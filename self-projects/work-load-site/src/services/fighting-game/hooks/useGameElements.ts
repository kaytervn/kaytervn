import Fighter from "../models/Fighter";
import { initImage } from "../utils";
import samuraiMackIdle from "../../../assets/fighting-game/samuraiMack/Idle.png";
import samuraiMackRun from "../../../assets/fighting-game/samuraiMack/Run.png";
import samuraiMackJump from "../../../assets/fighting-game/samuraiMack/Jump.png";
import samuraiMackFall from "../../../assets/fighting-game/samuraiMack/Fall.png";
import samuraiMackAttack1 from "../../../assets/fighting-game/samuraiMack/Attack1.png";
import samuraiMackAttack2 from "../../../assets/fighting-game/samuraiMack/Attack2.png";
import samuraiMackTakeHit from "../../../assets/fighting-game/samuraiMack/Take Hit.png";
import samuraiMackDeath from "../../../assets/fighting-game/samuraiMack/Death.png";
import kenjiIdle from "../../../assets/fighting-game/kenji/Idle.png";
import kenjiRun from "../../../assets/fighting-game/kenji/Run.png";
import kenjiJump from "../../../assets/fighting-game/kenji/Jump.png";
import kenjiFall from "../../../assets/fighting-game/kenji/Fall.png";
import kenjiAttack1 from "../../../assets/fighting-game/kenji/Attack1.png";
import kenjiAttack2 from "../../../assets/fighting-game/kenji/Attack2.png";
import kenjiTakeHit from "../../../assets/fighting-game/kenji/Take hit.png";
import kenjiDeath from "../../../assets/fighting-game/kenji/Death.png";
import yangLeeIdle from "../../../assets/fighting-game/yangLee/Idle.png";
import yangLeeRun from "../../../assets/fighting-game/yangLee/Run.png";
import yangLeeJump from "../../../assets/fighting-game/yangLee/Going Up.png";
import yangLeeFall from "../../../assets/fighting-game/yangLee/Going Down.png";
import yangLeeAttack1 from "../../../assets/fighting-game/yangLee/Attack1.png";
import yangLeeAttack2 from "../../../assets/fighting-game/yangLee/Attack2.png";
import yangLeeTakeHit from "../../../assets/fighting-game/yangLee/Take Hit.png";
import yangLeeDeath from "../../../assets/fighting-game/yangLee/Death.png";
import robinIdle from "../../../assets/fighting-game/robin/Idle.png";
import robinRun from "../../../assets/fighting-game/robin/Run.png";
import robinJump from "../../../assets/fighting-game/robin/Jump.png";
import robinFall from "../../../assets/fighting-game/robin/Fall.png";
import robinAttack1 from "../../../assets/fighting-game/robin/Attack2.png";
import robinAttack2 from "../../../assets/fighting-game/robin/Attack3.png";
import robinTakeHit from "../../../assets/fighting-game/robin/Take hit.png";
import robinDeath from "../../../assets/fighting-game/robin/Death.png";
import kingRichardIdle from "../../../assets/fighting-game/kingRichard/Idle.png";
import kingRichardRun from "../../../assets/fighting-game/kingRichard/Run.png";
import kingRichardJump from "../../../assets/fighting-game/kingRichard/Jump.png";
import kingRichardFall from "../../../assets/fighting-game/kingRichard/Fall.png";
import kingRichardAttack1 from "../../../assets/fighting-game/kingRichard/Attack2.png";
import kingRichardAttack2 from "../../../assets/fighting-game/kingRichard/Attack3.png";
import kingRichardTakeHit from "../../../assets/fighting-game/kingRichard/Take Hit.png";
import kingRichardDeath from "../../../assets/fighting-game/kingRichard/Death.png";
import poorGuyIdle from "../../../assets/fighting-game/poorGuy/Idle.png";
import poorGuyRun from "../../../assets/fighting-game/poorGuy/Run.png";
import poorGuyJump from "../../../assets/fighting-game/poorGuy/Jump.png";
import poorGuyFall from "../../../assets/fighting-game/poorGuy/Fall.png";
import poorGuyAttack1 from "../../../assets/fighting-game/poorGuy/Attack2.png";
import poorGuyAttack2 from "../../../assets/fighting-game/poorGuy/Attack3.png";
import poorGuyTakeHit from "../../../assets/fighting-game/poorGuy/Take Hit.png";
import poorGuyDeath from "../../../assets/fighting-game/poorGuy/Death.png";
import backgroundImg from "../../../assets/fighting-game/background.png";
import shopImg from "../../../assets/fighting-game/shop.png";
import Sprite from "../models/Sprite";

const useGameElements = ({ context }: any) => {
  const samuraiMack = new Fighter({
    position: {
      x: 100,
      y: -200,
    },
    context,
    velocity: { x: 0, y: 0 },
    imageSrc: initImage(samuraiMackIdle),
    framesMax: 8,
    scale: 3,
    offset: {
      x: 215,
      y: 210,
    },
    sprites: {
      idle: {
        imageSrc: initImage(samuraiMackIdle),
        framesMax: 8,
      },
      run: {
        imageSrc: initImage(samuraiMackRun),
        framesMax: 8,
      },
      jump: {
        imageSrc: initImage(samuraiMackJump),
        framesMax: 2,
      },
      fall: {
        imageSrc: initImage(samuraiMackFall),
        framesMax: 2,
      },
      attack1: {
        imageSrc: initImage(samuraiMackAttack1),
        framesMax: 6,
      },
      attack2: {
        imageSrc: initImage(samuraiMackAttack2),
        framesMax: 6,
      },
      takeHit: {
        imageSrc: initImage(samuraiMackTakeHit),
        framesMax: 4,
      },
      death: {
        imageSrc: initImage(samuraiMackDeath),
        framesMax: 6,
      },
    },
    attackBox: {
      offset: { x: 50, y: 20 },
      width: 310,
      height: 50,
    },
    hitBox: {
      offset: { x: 50, y: 20 },
      width: 70,
      height: 135,
    },
    nameBox: {
      offset: { x: -7, y: -20 },
      text: "Samurai Mack",
    },
    attackFrame: 4,
  });

  const yangLee = new Fighter({
    context,
    position: {
      x: 100,
      y: -200,
    },
    velocity: { x: 0, y: 0 },
    imageSrc: initImage(yangLeeIdle),
    framesMax: 10,
    scale: 3.5,
    offset: {
      x: 140,
      y: 132,
    },
    sprites: {
      idle: {
        imageSrc: initImage(yangLeeIdle),
        framesMax: 10,
      },
      run: {
        imageSrc: initImage(yangLeeRun),
        framesMax: 8,
      },
      jump: {
        imageSrc: initImage(yangLeeJump),
        framesMax: 3,
      },
      fall: {
        imageSrc: initImage(yangLeeFall),
        framesMax: 3,
      },
      attack1: {
        imageSrc: initImage(yangLeeAttack1),
        framesMax: 7,
      },
      attack2: {
        imageSrc: initImage(yangLeeAttack2),
        framesMax: 6,
      },
      takeHit: {
        imageSrc: initImage(yangLeeTakeHit),
        framesMax: 3,
      },
      death: {
        imageSrc: initImage(yangLeeDeath),
        framesMax: 11,
      },
    },
    attackBox: {
      offset: { x: 50, y: 0 },
      width: 245,
      height: 50,
    },
    hitBox: {
      offset: { x: 50, y: 0 },
      width: 70,
      height: 155,
    },
    nameBox: {
      offset: { x: 25, y: -15 },
      text: "Yang Lee",
    },
    attackFrame: 4,
  });

  const robin = new Fighter({
    context,
    position: {
      x: 100,
      y: -200,
    },
    velocity: { x: 0, y: 0 },
    imageSrc: initImage(robinIdle),
    framesMax: 10,
    scale: 3.5,
    offset: {
      x: 190,
      y: 200,
    },
    sprites: {
      idle: {
        imageSrc: initImage(robinIdle),
        framesMax: 10,
      },
      run: {
        imageSrc: initImage(robinRun),
        framesMax: 8,
      },
      jump: {
        imageSrc: initImage(robinJump),
        framesMax: 3,
      },
      fall: {
        imageSrc: initImage(robinFall),
        framesMax: 3,
      },
      attack1: {
        imageSrc: initImage(robinAttack1),
        framesMax: 7,
      },
      attack2: {
        imageSrc: initImage(robinAttack2),
        framesMax: 8,
      },
      takeHit: {
        imageSrc: initImage(robinTakeHit),
        framesMax: 3,
      },
      death: {
        imageSrc: initImage(robinDeath),
        framesMax: 7,
      },
    },
    attackBox: {
      offset: { x: 55, y: 10 },
      width: 210,
      height: 50,
    },
    hitBox: {
      offset: { x: 55, y: -5 },
      width: 80,
      height: 160,
    },
    nameBox: {
      offset: { x: 57, y: -20 },
      text: "Robin",
    },
    attackFrame: 3,
  });

  // Enemy

  const kenji = new Fighter({
    context,
    position: {
      x: 1100,
      y: -200,
    },
    velocity: { x: 0, y: 0 },
    scale: 3,
    offset: {
      x: 215,
      y: 229,
    },
    imageSrc: initImage(kenjiIdle),
    framesMax: 4,
    sprites: {
      idle: {
        imageSrc: initImage(kenjiIdle),
        framesMax: 4,
      },
      run: {
        imageSrc: initImage(kenjiRun),
        framesMax: 8,
      },
      jump: {
        imageSrc: initImage(kenjiJump),
        framesMax: 2,
      },
      fall: {
        imageSrc: initImage(kenjiFall),
        framesMax: 2,
      },
      attack1: {
        imageSrc: initImage(kenjiAttack1),
        framesMax: 4,
      },
      attack2: {
        imageSrc: initImage(kenjiAttack2),
        framesMax: 4,
      },
      takeHit: {
        imageSrc: initImage(kenjiTakeHit),
        framesMax: 3,
      },
      death: {
        imageSrc: initImage(kenjiDeath),
        framesMax: 7,
      },
    },
    attackBox: {
      offset: { x: -155, y: 30 },
      width: 260,
      height: 50,
    },
    hitBox: {
      offset: { x: 50, y: 0 },
      width: 55,
      height: 155,
    },
    nameBox: {
      offset: { x: 35, y: -30 },
      text: "Kenji",
    },
    attackFrame: 2,
  });

  const kingRichard = new Fighter({
    context,
    position: {
      x: 1100,
      y: -200,
    },
    velocity: { x: 0, y: 0 },
    scale: 3,
    offset: {
      x: 150,
      y: 160,
    },
    imageSrc: initImage(kingRichardIdle),
    framesMax: 8,
    sprites: {
      idle: {
        imageSrc: initImage(kingRichardIdle),
        framesMax: 8,
      },
      run: {
        imageSrc: initImage(kingRichardRun),
        framesMax: 8,
      },
      jump: {
        imageSrc: initImage(kingRichardJump),
        framesMax: 2,
      },
      fall: {
        imageSrc: initImage(kingRichardFall),
        framesMax: 2,
      },
      attack1: {
        imageSrc: initImage(kingRichardAttack1),
        framesMax: 4,
      },
      attack2: {
        imageSrc: initImage(kingRichardAttack2),
        framesMax: 4,
      },
      takeHit: {
        imageSrc: initImage(kingRichardTakeHit),
        framesMax: 4,
      },
      death: {
        imageSrc: initImage(kingRichardDeath),
        framesMax: 6,
      },
    },
    attackBox: {
      offset: { x: -132, y: 30 },
      width: 240,
      height: 50,
    },
    hitBox: {
      offset: { x: 43, y: -10 },
      width: 65,
      height: 165,
    },
    nameBox: {
      offset: { x: -15, y: -20 },
      text: "King Richard",
    },
    attackFrame: 2,
    flip: true,
  });

  const poorGuy = new Fighter({
    context,
    position: {
      x: 1100,
      y: -200,
    },
    velocity: { x: 0, y: 0 },
    scale: 3.5,
    offset: {
      x: 190,
      y: 178,
    },
    imageSrc: initImage(poorGuyIdle),
    framesMax: 8,
    sprites: {
      idle: {
        imageSrc: initImage(poorGuyIdle),
        framesMax: 8,
      },
      run: {
        imageSrc: initImage(poorGuyRun),
        framesMax: 8,
      },
      jump: {
        imageSrc: initImage(poorGuyJump),
        framesMax: 2,
      },
      fall: {
        imageSrc: initImage(poorGuyFall),
        framesMax: 2,
      },
      attack1: {
        imageSrc: initImage(poorGuyAttack1),
        framesMax: 4,
      },
      attack2: {
        imageSrc: initImage(poorGuyAttack2),
        framesMax: 4,
      },
      takeHit: {
        imageSrc: initImage(poorGuyTakeHit),
        framesMax: 4,
      },
      death: {
        imageSrc: initImage(poorGuyDeath),
        framesMax: 6,
      },
    },
    attackBox: {
      offset: { x: -160, y: 50 },
      width: 265,
      height: 50,
    },
    hitBox: {
      offset: { x: 40, y: 5 },
      width: 65,
      height: 150,
    },
    nameBox: {
      offset: { x: 7, y: -5 },
      text: "Poor Guy",
    },
    attackFrame: 2,
    flip: true,
  });

  const background = new Sprite({
    position: {
      x: 0,
      y: 0,
    },
    imageSrc: initImage(backgroundImg),
    scale: 1.34,
    context,
  });

  const shop = new Sprite({
    position: {
      x: 850,
      y: 195,
    },
    imageSrc: initImage(shopImg),
    scale: 3.5,
    framesMax: 6,
    context,
  });

  const listPlayer = [samuraiMack, robin, yangLee];
  const listEnemy = [kenji, kingRichard, poorGuy];

  const player = listPlayer[Math.floor(Math.random() * listPlayer.length)];
  const enemy = listEnemy[Math.floor(Math.random() * listEnemy.length)];

  return {
    player,
    enemy,
    shop,
    background,
  };
};

export default useGameElements;
