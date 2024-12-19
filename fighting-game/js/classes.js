class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    flip = false,
  }) {
    this.position = position;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
    this.flip = flip;
  }

  draw() {
    var x = (this.framesCurrent * this.image.width) / this.framesMax;
    if (this.flip == true) {
      x =
        this.image.width -
        ((this.framesCurrent + 1) * this.image.width) / this.framesMax;
    }
    c.drawImage(
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

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: { x: 0, y: 0 }, width: undefined, height: undefined },
    hitBox = { offset: { x: 0, y: 0 }, width: undefined, height: undefined },
    nameBox = { text: "Unknown", offset: { x: 0, y: 0 } },
    attackFrame = 0,
    flip = false,
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
      flip,
    });
    this.velocity = velocity;
    this.isOnGround = true;
    this.canDoubleJump = false;
    this.hitBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: hitBox.width,
      height: hitBox.height,
      offset: hitBox.offset,
    };
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: attackBox.width,
      height: attackBox.height,
      offset: attackBox.offset,
    };
    this.isAttacking = false;
    this.health = 100;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.sprites = sprites;
    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
    this.dead = false;
    this.nameBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: nameBox.offset,
      text: nameBox.text,
    };
    this.attackFrame = attackFrame;
  }

  displayBox() {
    if (!this.dead) {
      c.font = "15px 'Press Start 2P', cursive";
      c.fillStyle = "white";
      c.fillText(
        this.nameBox.text,
        this.nameBox.position.x,
        this.nameBox.position.y
      );
    }

    // c.fillStyle = "blue";
    // c.fillRect(
    //   this.hitBox.position.x,
    //   this.hitBox.position.y,
    //   this.hitBox.width,
    //   this.hitBox.height
    // );

    // c.fillStyle = "green";
    // c.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );
  }

  update() {
    this.displayBox();

    this.draw();
    if (!this.dead) {
      this.animateFrames();
    }

    this.hitBox.position.x = this.position.x + this.hitBox.offset.x;
    this.hitBox.position.y = this.position.y + this.hitBox.offset.y;

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    this.nameBox.position.x = this.position.x + this.nameBox.offset.x;
    this.nameBox.position.y = this.position.y + this.nameBox.offset.y;

    if (
      this.hitBox.position.x + this.velocity.x >= 0 &&
      this.hitBox.position.x + this.hitBox.width + this.velocity.x <=
        canvas.width
    ) {
      this.position.x += this.velocity.x;
    }
    this.position.y += this.velocity.y;

    if (
      this.hitBox.position.y + this.hitBox.height + this.velocity.y >=
      canvas.height - 125
    ) {
      this.velocity.y = 0;
      this.position.y = 488;
      this.isOnGround = true;
    } else {
      this.velocity.y += gravity;
    }
  }

  jump() {
    if (this.isOnGround) {
      this.isOnGround = false;
      this.canDoubleJump = true;
      this.velocity.y = -15;
    } else if (this.canDoubleJump) {
      this.canDoubleJump = false;
      this.velocity.y = -15;
    }
  }

  attack() {
    if (Math.random() >= 0.5 ? 1 : 0 == 1) {
      this.switchSprite("attack1");
    } else {
      this.switchSprite("attack2");
    }
    this.isAttacking = true;
  }

  takeHit(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      this.health = 0;
      this.switchSprite("death");
    } else {
      this.switchSprite("takeHit");
    }
  }

  switchSprite(sprite) {
    if (this.image == this.sprites.death.image) {
      this.velocity.x = 0;
      this.velocity.y = 0;
      if (this.framesCurrent == this.sprites.death.framesMax - 1) {
        this.dead = true;
      }
      return;
    }
    if (
      (this.image == this.sprites.attack1.image &&
        this.framesCurrent < this.sprites.attack1.framesMax - 1) ||
      (this.image == this.sprites.attack2.image &&
        this.framesCurrent < this.sprites.attack2.framesMax - 1) ||
      (this.image == this.sprites.takeHit.image &&
        this.framesCurrent < this.sprites.takeHit.framesMax - 1)
    )
      return;

    if (!this.dead) {
      switch (sprite) {
        case "idle":
          if (this.image != this.sprites.idle.image) {
            this.image = this.sprites.idle.image;
            this.framesMax = this.sprites.idle.framesMax;
            this.framesCurrent = 0;
          }
          break;
        case "run":
          if (this.image != this.sprites.run.image) {
            this.image = this.sprites.run.image;
            this.framesMax = this.sprites.run.framesMax;
            this.framesCurrent = 0;
          }
          break;
        case "jump":
          if (this.image != this.sprites.jump.image) {
            this.image = this.sprites.jump.image;
            this.framesMax = this.sprites.jump.framesMax;
            this.framesCurrent = 0;
          }
          break;
        case "fall":
          if (this.image != this.sprites.fall.image) {
            this.image = this.sprites.fall.image;
            this.framesMax = this.sprites.fall.framesMax;
            this.framesCurrent = 0;
          }
          break;
        case "attack1":
          if (this.image != this.sprites.attack1.image) {
            this.image = this.sprites.attack1.image;
            this.framesMax = this.sprites.attack1.framesMax;
            this.framesCurrent = 0;
          }
          break;
        case "attack2":
          if (this.image != this.sprites.attack2.image) {
            this.image = this.sprites.attack2.image;
            this.framesMax = this.sprites.attack2.framesMax;
            this.framesCurrent = 0;
          }
          break;
        case "takeHit":
          if (this.image != this.sprites.takeHit.image) {
            this.image = this.sprites.takeHit.image;
            this.framesMax = this.sprites.takeHit.framesMax;
            this.framesCurrent = 0;
          }
          break;
        case "death":
          if (this.image != this.sprites.death.image) {
            this.image = this.sprites.death.image;
            this.framesMax = this.sprites.death.framesMax;
            this.framesCurrent = 0;
          }
          break;
      }
    }
  }
}
