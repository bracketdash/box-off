let moveDelay = 300;

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
  document
    .querySelector(".speed select")
    .addEventListener("change", (event) => {
      moveDelay = event.target.value;
    });
}

function loop(board, best, history) {
  updateDOM(board);
  const empties = board.flat().filter((cell) => cell === "e").length;
  if (empties === 64) {
    document.querySelector(".so-far").innerHTML = "WINNING!";
    return;
  }
  if (empties > best.score) {
    best = { board, score: empties };
    document.querySelector(".so-far").innerHTML = empties;
  }
  let newBoard = board.map((row) => row.slice());
  let moves = getMoves(board);
  let i = 0;
  if (!moves.length) {
    while (history.length) {
      const prev = history.pop();
      if (prev.i + 1 < prev.moves.length) {
        i = prev.i + 1;
        board = prev.board.map((row) => row.slice());
        moves = prev.moves;
        history.push({ board, moves, i });
        newBoard = board.map((row) => row.slice());
        break;
      }
    }
    if (!moves.length || !moves[i]) {
      updateDOM(best.board);
      console.log("All options exhausted. Best scoring board shown.");
      return;
    }
  } else {
    history.push({ board, moves, i });
  }
  newBoard[moves[i][0][0]][moves[i][0][1]] = "e";
  newBoard[moves[i][1][0]][moves[i][1][1]] = "e";
  setTimeout(() => {
    loop(newBoard, best, history);
  }, moveDelay);
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
