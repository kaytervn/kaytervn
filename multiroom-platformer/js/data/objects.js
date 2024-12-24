const backgrounds = {
  1: new Sprite({
    position: {
      x: 0,
      y: 0,
    },
    imageSrc: {
      default: createImageSrc({
        path: "img",
        fileName: "backgroundLevel1",
        count: 1,
      }),
    },
  }),
  2: new Sprite({
    position: {
      x: 0,
      y: 0,
    },
    imageSrc: {
      default: createImageSrc({
        path: "img",
        fileName: "backgroundLevel2",
        count: 1,
      }),
    },
  }),
  3: new Sprite({
    position: {
      x: 0,
      y: 0,
    },
    imageSrc: {
      default: createImageSrc({
        path: "img",
        fileName: "backgroundLevel3",
        count: 1,
      }),
    },
  }),
};

const doors = {
  1: new Sprite({
    position: {
      x: 767,
      y: 273,
    },
    imageSrc: {
      default: createImageSrc({
        path: "img/doorOpen",
        fileName: "doorOpen",
        count: 5,
      }),
    },
    loop: false,
    scale: 2,
    autoPlay: false,
  }),
  2: new Sprite({
    position: {
      x: 773,
      y: 336,
    },
    imageSrc: {
      default: createImageSrc({
        path: "img/doorOpen",
        fileName: "doorOpen",
        count: 5,
      }),
    },
    loop: false,
    scale: 2,
    autoPlay: false,
  }),
  3: new Sprite({
    position: {
      x: 176,
      y: 335,
    },
    imageSrc: {
      default: createImageSrc({
        path: "img/doorOpen",
        fileName: "doorOpen",
        count: 5,
      }),
    },
    loop: false,
    scale: 2,
    autoPlay: false,
  }),
};

const player = new Player({
  position: {
    x: 200,
    y: 200,
  },
  imageSrc: {
    default: createImageSrc({
      path: "img/king/idle",
      fileName: "idle",
      count: 11,
    }),
    flipped: createImageSrc({
      path: "img/king/idle/left",
      fileName: "idle",
      count: 11,
    }),
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
      default: createImageSrc({
        path: "img/king/idle",
        fileName: "idle",
        count: 11,
      }),
      flipped: createImageSrc({
        path: "img/king/idle/left",
        fileName: "idle",
        count: 11,
      }),
      loop: true,
    },
    doorIn: {
      default: createImageSrc({
        path: "img/king/doorIn",
        fileName: "doorIn",
        count: 8,
      }),
      flipped: createImageSrc({
        path: "img/king/doorIn/left",
        fileName: "doorIn",
        count: 8,
      }),
      loop: false,
      onComplete: () => {
        gsap.to(overlay, {
          opacity: 1,
          onComplete: () => {
            level++;
            if (level == 4) {
              level = 1;
            }
            levels[level].init();
            doors[level].reset();
            player.switchSprite("idle");
            player.preventInput = false;
            gsap.to(overlay, {
              opacity: 0,
            });
          },
        });
      },
    },
    run: {
      default: createImageSrc({
        path: "img/king/run",
        fileName: "run",
        count: 8,
      }),
      flipped: createImageSrc({
        path: "img/king/run/left",
        fileName: "run",
        count: 8,
      }),
      loop: true,
    },
  },
});
