class CaroGame {
  constructor() {
    this.size = 20;
    this.resetGame();
  }

  resetGame() {
    this.gameState = Array(this.size * this.size).fill(null);
    this.currentPlayer = "X";
    this.gameActive = true;
    this.players = new Set();
  }

  makeMove(index, player) {
    if (
      !this.gameActive ||
      this.gameState[index] !== null ||
      player !== this.currentPlayer
    ) {
      return false;
    }

    this.gameState[index] = player;
    const winResult = this.checkWin(index, player);

    if (winResult.hasWon) {
      this.gameActive = false;
      return {
        success: true,
        gameOver: true,
        winningCells: winResult.winningCells,
      };
    }

    this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
    return { success: true, gameOver: false };
  }

  checkWin(index, player) {
    const directions = [
      [0, 1], // Horizontal
      [1, 0], // Vertical
      [1, 1], // Diagonal \
      [1, -1], // Diagonal /
    ];

    const row = Math.floor(index / this.size);
    const col = index % this.size;

    for (const [dx, dy] of directions) {
      const winningCells = [index];
      let count = 1;

      // Check both directions
      for (const dir of [-1, 1]) {
        let step = 1;
        while (true) {
          const r = row + dir * step * dx;
          const c = col + dir * step * dy;
          const idx = r * this.size + c;

          if (
            r >= 0 &&
            r < this.size &&
            c >= 0 &&
            c < this.size &&
            this.gameState[idx] === player
          ) {
            winningCells.push(idx);
            count++;
            step++;
          } else {
            break;
          }
        }
      }

      if (count >= 5) {
        return { hasWon: true, winningCells };
      }
    }

    return { hasWon: false, winningCells: [] };
  }
}

export default CaroGame;
