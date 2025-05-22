import CollisionBlock from "./classes/CollisionBlock";

declare global {
  interface Array<T> {
    parse2d(): T[][];
    createObjectsFrom2d(): CollisionBlock[];
  }
}

Array.prototype.parse2d = function <T>(): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < this.length; i += 16) {
    rows.push(this.slice(i, i + 16));
  }
  return rows;
};

Array.prototype.createObjectsFrom2d = function (): CollisionBlock[] {
  const objects: CollisionBlock[] = [];
  this.forEach((row: any[], y: number) => {
    row.forEach((symbol: number, x: number) => {
      if (symbol === 292) {
        objects.push(
          new CollisionBlock({
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
