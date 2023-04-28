import { useState } from "react";

function Game() {
  const boardSize = 10;
  let status = 0; // 0: running, 1: won, 2: lost, 3: tie
  let maxDepth = 4; // Search depth
  let finalScore = 100000;
  let round = 0;
  let winningArray = [];
  let iterations = 0;
  let currentTurn = 1; //1 is player 2 is AI

  const startBoard = [];

  for (let i = 0; i < boardSize; i++) {
    let row = [];
    for (let j = 0; j < boardSize; j++) {
      row[j] = 0;
    }
    startBoard[i] = row;
  }

  const [board, setBoard] = useState(startBoard);

  function renderCell(number: number, col: number) {
    if (number == 0) {
      return (
        <div className="cell empty" onClick={() => handleClick(col)}></div>
      );
    } else if (number == 1) {
      return (
        <div className="cell person" onClick={() => handleClick(col)}></div>
      );
    } else {
      return <div className="cell pc" onClick={() => handleClick(col)}></div>;
    }
  }

  function place(board: number[][], col: number) {
    for (let i = 9; i >= 0; i--) {
      if (board?.[i]?.[col] === 0) {
        board![i]![col] = currentTurn;
        return true;
      }
    }

    return false;
  }

  function handleClick(col: number) {
    console.log(col);
    if (!place(board, col)) {
      return;
    }
    setBoard([...board]);
  }

  function isFull(board: number[][]) {
    if (board.some((row) => row.some((element) => element != 0))) {
      return false;
    }

    return true;
  }

  function isFinisehd(board: number[][], depth: number, score: number) {
    return (
      score == -finalScore || score == finalScore || depth == 0 || isFull(board)
    );
  }

  return (
    <>
      <div className="wrapper">
        {board.map((row) => {
          return row.map((el, index) => renderCell(el, index));
        })}
      </div>
    </>
  );
}

export default Game;
