class CollisionBlock {
  position: any;
  width: any;
  height: any;
  context: any;
  constructor({ position, context }: any) {
    this.position = position;
    this.width = 64;
    this.height = 64;
    this.context = context;
  }

  draw() {
    this.context.fillStyle = "rgba(255, 0, 0, 0.5)";
    this.context.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}

export default CollisionBlock;
