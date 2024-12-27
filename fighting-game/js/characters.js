samuraiMack = new Fighter({
  position: {
    x: 100,
    y: -200,
  },
  velocity: { x: 0, y: 0 },
  imageSrc: initImage("img/samuraiMack/Idle.png"),
  framesMax: 8,
  scale: 3,
  offset: {
    x: 215,
    y: 210,
  },
  sprites: {
    idle: {
      imageSrc: initImage("img/samuraiMack/Idle.png"),
      framesMax: 8,
    },
    run: {
      imageSrc: initImage("img/samuraiMack/Run.png"),
      framesMax: 8,
    },
    jump: {
      imageSrc: initImage("img/samuraiMack/Jump.png"),
      framesMax: 2,
    },
    fall: {
      imageSrc: initImage("img/samuraiMack/Fall.png"),
      framesMax: 2,
    },
    attack1: {
      imageSrc: initImage("img/samuraiMack/Attack1.png"),
      framesMax: 6,
    },
    attack2: {
      imageSrc: initImage("img/samuraiMack/Attack2.png"),
      framesMax: 6,
    },
    takeHit: {
      imageSrc: initImage("img/samuraiMack/Take hit.png"),
      framesMax: 4,
    },
    death: {
      imageSrc: initImage("img/samuraiMack/Death.png"),
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

yangLee = new Fighter({
  position: {
    x: 100,
    y: -200,
  },
  velocity: { x: 0, y: 0 },
  imageSrc: initImage("img/yangLee/Idle.png"),
  framesMax: 10,
  scale: 3.5,
  offset: {
    x: 140,
    y: 132,
  },
  sprites: {
    idle: {
      imageSrc: initImage("img/yangLee/Idle.png"),
      framesMax: 10,
    },
    run: {
      imageSrc: initImage("img/yangLee/Run.png"),
      framesMax: 8,
    },
    jump: {
      imageSrc: initImage("img/yangLee/Going up.png"),
      framesMax: 3,
    },
    fall: {
      imageSrc: initImage("img/yangLee/Going down.png"),
      framesMax: 3,
    },
    attack1: {
      imageSrc: initImage("img/yangLee/Attack1.png"),
      framesMax: 7,
    },
    attack2: {
      imageSrc: initImage("img/yangLee/Attack2.png"),
      framesMax: 6,
    },
    takeHit: {
      imageSrc: initImage("img/yangLee/Take hit.png"),
      framesMax: 3,
    },
    death: {
      imageSrc: initImage("img/yangLee/Death.png"),
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

robin = new Fighter({
  position: {
    x: 100,
    y: -200,
  },
  velocity: { x: 0, y: 0 },
  imageSrc: initImage("img/robin/Idle.png"),
  framesMax: 10,
  scale: 3.5,
  offset: {
    x: 190,
    y: 200,
  },
  sprites: {
    idle: {
      imageSrc: initImage("img/robin/Idle.png"),
      framesMax: 10,
    },
    run: {
      imageSrc: initImage("img/robin/Run.png"),
      framesMax: 8,
    },
    jump: {
      imageSrc: initImage("img/robin/Jump.png"),
      framesMax: 3,
    },
    fall: {
      imageSrc: initImage("img/robin/Fall.png"),
      framesMax: 3,
    },
    attack1: {
      imageSrc: initImage("img/robin/Attack2.png"),
      framesMax: 7,
    },
    attack2: {
      imageSrc: initImage("img/robin/Attack3.png"),
      framesMax: 8,
    },
    takeHit: {
      imageSrc: initImage("img/robin/Take hit.png"),
      framesMax: 3,
    },
    death: {
      imageSrc: initImage("img/robin/Death.png"),
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

kenji = new Fighter({
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
  imageSrc: initImage("img/kenji/Idle.png"),
  framesMax: 4,
  sprites: {
    idle: {
      imageSrc: initImage("img/kenji/Idle.png"),
      framesMax: 4,
    },
    run: {
      imageSrc: initImage("img/kenji/Run.png"),
      framesMax: 8,
    },
    jump: {
      imageSrc: initImage("img/kenji/Jump.png"),
      framesMax: 2,
    },
    fall: {
      imageSrc: initImage("img/kenji/Fall.png"),
      framesMax: 2,
    },
    attack1: {
      imageSrc: initImage("img/kenji/Attack1.png"),
      framesMax: 4,
    },
    attack2: {
      imageSrc: initImage("img/kenji/Attack2.png"),
      framesMax: 4,
    },
    takeHit: {
      imageSrc: initImage("img/kenji/Take hit.png"),
      framesMax: 3,
    },
    death: {
      imageSrc: initImage("img/kenji/Death.png"),
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

kingRichard = new Fighter({
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
  imageSrc: initImage("img/kingRichard/Idle.png"),
  framesMax: 8,
  sprites: {
    idle: {
      imageSrc: initImage("img/kingRichard/Idle.png"),
      framesMax: 8,
    },
    run: {
      imageSrc: initImage("img/kingRichard/Run.png"),
      framesMax: 8,
    },
    jump: {
      imageSrc: initImage("img/kingRichard/Jump.png"),
      framesMax: 2,
    },
    fall: {
      imageSrc: initImage("img/kingRichard/Fall.png"),
      framesMax: 2,
    },
    attack1: {
      imageSrc: initImage("img/kingRichard/Attack2.png"),
      framesMax: 4,
    },
    attack2: {
      imageSrc: initImage("img/kingRichard/Attack3.png"),
      framesMax: 4,
    },
    takeHit: {
      imageSrc: initImage("img/kingRichard/Take hit.png"),
      framesMax: 4,
    },
    death: {
      imageSrc: initImage("img/kingRichard/Death.png"),
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

poorGuy = new Fighter({
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
  imageSrc: initImage("img/poorGuy/Idle.png"),
  framesMax: 8,
  sprites: {
    idle: {
      imageSrc: initImage("img/poorGuy/Idle.png"),
      framesMax: 8,
    },
    run: {
      imageSrc: initImage("img/poorGuy/Run.png"),
      framesMax: 8,
    },
    jump: {
      imageSrc: initImage("img/poorGuy/Jump.png"),
      framesMax: 2,
    },
    fall: {
      imageSrc: initImage("img/poorGuy/Fall.png"),
      framesMax: 2,
    },
    attack1: {
      imageSrc: initImage("img/poorGuy/Attack2.png"),
      framesMax: 4,
    },
    attack2: {
      imageSrc: initImage("img/poorGuy/Attack3.png"),
      framesMax: 4,
    },
    takeHit: {
      imageSrc: initImage("img/poorGuy/Take hit.png"),
      framesMax: 4,
    },
    death: {
      imageSrc: initImage("img/poorGuy/Death.png"),
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
