/* eslint-disable no-var */
class Sprite {
  position: any;
  image: any;
  scale: number;
  framesMax: number;
  framesCurrent: number;
  framesElapsed: number;
  framesHold: number;
  offset: any;
  flip: boolean;
  context: any;

  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    flip = false,
    context,
  }: any) {
    this.position = position;
    this.image = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
    this.flip = flip;
    this.context = context;
  }

  draw() {
    var x = (this.framesCurrent * this.image.width) / this.framesMax;
    if (this.flip == true) {
      x =
        this.image.width -
        ((this.framesCurrent + 1) * this.image.width) / this.framesMax;
    }
    this.context.drawImage(
      this.image,
      x,
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width * this.scale) / this.framesMax,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold == 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
      this.framesElapsed = 0;
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

export default Sprite;
