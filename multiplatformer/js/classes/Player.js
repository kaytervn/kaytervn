class Player extends Sprite {
  constructor({
    collisionBlocks = [],
    imageSrc,
    scale,
    offset,
    width,
    height,
    sprites,
    position,
    loop,
  }) {
    super({ imageSrc, scale, offset, position, loop });
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = width;
    this.height = height;
    this.gravity = 1;
    this.collisionBlocks = collisionBlocks;
    this.sprites = sprites;
    this.currentSprite;
  }

  drawHitbox() {
    c.fillStyle = "rgba(0, 0, 0, 0.5)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.animateFrames();

    this.position.x += this.velocity.x;
    this.checkForHorizontalCollision();
    this.applyGravity();
    this.checkForVerticalCollision();
  }

  checkForHorizontalCollision() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
      if (
        this.position.x <= collisionBlock.position.x + collisionBlock.width &&
        this.position.x + this.width >= collisionBlock.position.x &&
        this.position.y <= collisionBlock.position.y + collisionBlock.height &&
        this.position.y + this.height >= collisionBlock.position.y
      ) {
        if (this.velocity.x < 0) {
          this.position.x =
            collisionBlock.position.x + collisionBlock.width + 0.01;
          break;
        }
        if (this.velocity.x > 0) {
          this.position.x = collisionBlock.position.x - this.width - 0.01;
          break;
        }
      }
    }
  }

  handleInput(key) {
    if (this.preventInput) return;
    this.velocity.x = 0;
    if (key.d.pressed) {
      this.switchSprite("run");
      this.flipped = false;
      this.velocity.x += 3;
    } else if (key.a.pressed) {
      this.switchSprite("run");
      this.flipped = true;
      this.velocity.x -= 3;
    } else {
      this.switchSprite("idle");
    }
  }

  switchSprite(name) {
    if (this.currentSprite == this.sprites[name]) return;
    this.imageSrc = this.sprites[name];
    this.loop = this.sprites[name].loop;
    if (this.framesCurrent >= this.imageSrc.default.length - 1) {
      this.framesCurrent = 0;
    }
    this.currentSprite = this.sprites[name];
  }

  applyGravity() {
    this.velocity.y += this.gravity;
    this.position.y += this.velocity.y;
  }

  checkForVerticalCollision() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
      if (
        this.position.x <= collisionBlock.position.x + collisionBlock.width &&
        this.position.x + this.width >= collisionBlock.position.x &&
        this.position.y <= collisionBlock.position.y + collisionBlock.height &&
        this.position.y + this.height >= collisionBlock.position.y
      ) {
        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          this.position.y =
            collisionBlock.position.y + collisionBlock.height + 0.01;
          break;
        }
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          this.position.y = collisionBlock.position.y - this.height - 0.01;
          break;
        }
      }
    }
  }
}
