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
      if (board[i]![col] === 0) {
        board[i]![col] = currentTurn;
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

  function scorePosition(
    board: number[][],
    row: number,
    column: number,
    delta_y: number,
    delta_x: number
  ) {
    //recieves a board array and positon to score
    let human_points = 0;
    let computer_points = 0;

    // Save winning positions to arrays for later usage
    let winning_array_human = [];
    let winning_array_cpu = [];

    // Determine score through amount of available chips
    for (var i = 0; i < 4; i++) {
      if (board[row]![column] == 0) {
        winning_array_human.push([row, column]);
        human_points++; // Add for each human chip
      } else if (board[row]![column] == 1) {
        winning_array_cpu.push([row, column]);
        computer_points++; // Add for each computer chip
      }

      // Moving through our board
      row += delta_y;
      column += delta_x;
    }

    // Marking winning/returning score
    if (human_points == 4) {
      winningArray = winning_array_human;
      // Computer won (100000)
      return -finalScore;
    } else if (computer_points == 4) {
      winningArray = winning_array_cpu;
      // Human won (-100000)
      return finalScore;
    } else {
      // Return normal points
      return computer_points;
    }
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
