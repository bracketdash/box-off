function getMoves(board) {
  const moves = [];
  const rows = board.length;
  const cols = board[0].length;
  for (let r1 = 0; r1 < rows; r1++) {
    for (let c1 = 0; c1 < cols; c1++) {
      const color = board[r1][c1];
      if (color === "e") {
        continue;
      }
      for (let r2 = r1; r2 < rows; r2++) {
        for (let c2 = r2 === r1 ? c1 + 1 : 0; c2 < cols; c2++) {
          if (board[r2][c2] !== color) {
            continue;
          }
          let blocked = false;
          for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r++) {
            for (let c = Math.min(c1, c2); c <= Math.max(c1, c2); c++) {
              if ((r === r1 && c === c1) || (r === r2 && c === c2)) {
                continue;
              }
              if (board[r][c] !== "e") {
                blocked = true;
                break;
              }
            }
            if (blocked) {
              break;
            }
          }
          if (!blocked) {
            moves.push([
              [r1, c1],
              [r2, c2],
            ]);
          }
        }
      }
    }
  }
  return moves;
}

function init() {
  const colors = ["r", "g", "b", "y"];
  const board = new Array(8)
    .fill(null)
    .map(() =>
      new Array(8)
        .fill(null)
        .map(() => colors[Math.floor(Math.random() * colors.length)])
    );
  loop(board, { board, score: 0 }, []);
}

function loop(board, best, history) {
  updateDOM(board);
  const empties = board.flat().filter((cell) => cell === "e").length;
  if (empties === 64) {
    console.log("I won!");
    return;
  }
  if (best.score < empties) {
    best = { board, score: empties };
  }
  const moves = getMoves(board);
  if (!moves.length) {
    // TODO
    return;
  }
  history.push({ board, moves, i: 0 });
  // TODO: remove the two pegs from the board (turn them to "e")
  // const newBoard = TODO (remove the two pegs in moves[i])
  setTimeout();
}

function updateDOM(state) {
  let html = "";
  state.forEach((row) => {
    html += '<div class="row">';
    row.forEach((cell) => {
      html += `<div class="cell ${cell}"></div>`;
    });
    html += "</div>";
  });
  document.querySelector(".board").innerHTML = html;
}

init();
