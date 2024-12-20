samuraiMack = new Fighter({
  position: {
    x: 100,
    y: 100,
  },
  velocity: { x: 0, y: 0 },
  imageSrc: "img/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 3,
  offset: {
    x: 215,
    y: 210,
  },
  sprites: {
    idle: {
      imageSrc: "img/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "img/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "img/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "img/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "img/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    attack2: {
      imageSrc: "img/samuraiMack/Attack2.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "img/samuraiMack/Take hit.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "img/samuraiMack/Death.png",
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
    y: 100,
  },
  velocity: { x: 0, y: 0 },
  imageSrc: "img/yangLee/Idle.png",
  framesMax: 10,
  scale: 3.5,
  offset: {
    x: 140,
    y: 132,
  },
  sprites: {
    idle: {
      imageSrc: "img/yangLee/Idle.png",
      framesMax: 10,
    },
    run: {
      imageSrc: "img/yangLee/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "img/yangLee/Going up.png",
      framesMax: 3,
    },
    fall: {
      imageSrc: "img/yangLee/Going down.png",
      framesMax: 3,
    },
    attack1: {
      imageSrc: "img/yangLee/Attack1.png",
      framesMax: 7,
    },
    attack2: {
      imageSrc: "img/yangLee/Attack2.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "img/yangLee/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "img/yangLee/Death.png",
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
    y: 100,
  },
  velocity: { x: 0, y: 0 },
  imageSrc: "img/robin/Idle.png",
  framesMax: 10,
  scale: 3.5,
  offset: {
    x: 190,
    y: 200,
  },
  sprites: {
    idle: {
      imageSrc: "img/robin/Idle.png",
      framesMax: 10,
    },
    run: {
      imageSrc: "img/robin/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "img/robin/Jump.png",
      framesMax: 3,
    },
    fall: {
      imageSrc: "img/robin/Fall.png",
      framesMax: 3,
    },
    attack1: {
      imageSrc: "img/robin/Attack2.png",
      framesMax: 7,
    },
    attack2: {
      imageSrc: "img/robin/Attack3.png",
      framesMax: 8,
    },
    takeHit: {
      imageSrc: "img/robin/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "img/robin/Death.png",
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
    y: 100,
  },
  velocity: { x: 0, y: 0 },
  scale: 3,
  offset: {
    x: 215,
    y: 229,
  },
  imageSrc: "img/kenji/Idle.png",
  framesMax: 4,
  sprites: {
    idle: {
      imageSrc: "img/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "img/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "img/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "img/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "img/kenji/Attack1.png",
      framesMax: 4,
    },
    attack2: {
      imageSrc: "img/kenji/Attack2.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "img/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "img/kenji/Death.png",
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
    y: 100,
  },
  velocity: { x: 0, y: 0 },
  scale: 3,
  offset: {
    x: 150,
    y: 160,
  },
  imageSrc: "img/kingRichard/Idle.png",
  framesMax: 8,
  sprites: {
    idle: {
      imageSrc: "img/kingRichard/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "img/kingRichard/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "img/kingRichard/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "img/kingRichard/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "img/kingRichard/Attack2.png",
      framesMax: 4,
    },
    attack2: {
      imageSrc: "img/kingRichard/Attack3.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "img/kingRichard/Take hit.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "img/kingRichard/Death.png",
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
    y: 100,
  },
  velocity: { x: 0, y: 0 },
  scale: 3.5,
  offset: {
    x: 190,
    y: 178,
  },
  imageSrc: "img/poorGuy/Idle.png",
  framesMax: 8,
  sprites: {
    idle: {
      imageSrc: "img/poorGuy/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "img/poorGuy/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "img/poorGuy/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "img/poorGuy/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "img/poorGuy/Attack2.png",
      framesMax: 4,
    },
    attack2: {
      imageSrc: "img/poorGuy/Attack3.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "img/poorGuy/Take hit.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "img/poorGuy/Death.png",
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
