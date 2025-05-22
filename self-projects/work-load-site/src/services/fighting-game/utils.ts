function isColliding({ attackBox, hitBox }: any) {
  return !(
    attackBox.position.x + attackBox.width < hitBox.position.x ||
    hitBox.position.x + hitBox.width < attackBox.position.x ||
    attackBox.position.y + attackBox.height < hitBox.position.y ||
    hitBox.position.y + hitBox.height < attackBox.position.y
  );
}
const initImage = (src: any) => {
  let image = new Image();
  image.src = src;
  return image;
};

export { isColliding, initImage };
