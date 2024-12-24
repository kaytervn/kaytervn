Array.prototype.parse2d = function () {
  const rows = [];
  for (let i = 0; i < this.length; i += 16) {
    rows.push(this.slice(i, i + 16));
  }
  return rows;
};

Array.prototype.createObjectsFrom2d = function () {
  const objects = [];
  this.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol == 292) {
        objects.push(
          new CollisonBlock({
            position: {
              x: x * 64,
              y: y * 64,
            },
          })
        );
      }
    });
  });
  return objects;
};

function createImageSrc({ path, fileName, count }) {
  const imageSrcs = [];
  for (let i = 1; i <= count; i++) {
    const image = new Image();
    image.src = path + "/" + fileName + "(" + i + ").png";
    imageSrcs.push(image);
  }
  return imageSrcs;
}
