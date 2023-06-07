import { useState } from "react";

function Game() {
  let boardSize = 10;
  let status = 0; // 0: running, 1: won, 2: lost, 3: tie
  let maxDepth = 4; // Search depth
  let finalScore = 100000;
  let round = 0;
  let winningArray: number[][] = []; //holds tuples of the coordinates of he winning squares
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
    //0- empty, 1- person, 2-pc, 3-winning
    if (number == 0) {
      return (
        <div className="cell empty" onClick={() => handleClick(col)}></div>
      );
    } else if (number == 1) {
      return (
        <div className="cell person" onClick={() => handleClick(col)}></div>
      );
    } else if (number == 3) {
      return <div className="cell winning"></div>;
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

  function score(board: number[][]) {
    var points = 0;

    var vertical_points = 0;
    var horizontal_points = 0;
    var diagonal_points1 = 0;
    var diagonal_points2 = 0;

    // Sum vertical points
    for (let row = 0; row < boardSize - 3; row++) {
      // Check each column
      for (let column = 0; column < boardSize; column++) {
        // Evaluate the current column
        let score = scorePosition(board, row, column, 1, 0);
        if (score == finalScore) return finalScore;
        if (score == -finalScore) return -finalScore;
        vertical_points += score;
      }
    }

    // Horizontal points
    for (var row = 0; row < boardSize; row++) {
      for (var column = 0; column < boardSize - 3; column++) {
        var score = scorePosition(board, row, column, 0, 1);
        if (score == finalScore) return finalScore;
        if (score == -finalScore) return -finalScore;
        horizontal_points += score;
      }
    }

    // Diagonal points 1 (left-bottom)

    for (let row = 0; row < boardSize - 3; row++) {
      for (let column = 0; column < boardSize - 3; column++) {
        let score = scorePosition(board, row, column, 1, 1);
        if (score == finalScore) return finalScore;
        if (score == -finalScore) return -finalScore;
        diagonal_points1 += score;
      }
    }

    // Diagonal points 2 (right-bottom)

    for (var row = 3; row < boardSize; row++) {
      for (var column = 0; column <= boardSize - 4; column++) {
        let score = scorePosition(board, row, column, -1, +1);
        if (score == finalScore) return finalScore;
        if (score == -finalScore) return -finalScore;
        diagonal_points2 += score;
      }
    }

    points =
      horizontal_points + vertical_points + diagonal_points1 + diagonal_points2;
    return points;
  }

  function copyBoard(board: number[][]) {
    let new_board: number[][] = [];
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        new_board[i]![j] = board[i]![j]!;
      }
    }
    return new_board;
  }

  function switchRound(round: number) {
    return (round + 1) % 2;
  }

  function updateStatus() {
    // Human won
    if (score(board) == -finalScore) {
      status = 1;
      markWin();
      alert("You have won!");
    }

    // Computer won
    if (score(board) == finalScore) {
      status = 2;
      markWin();
      alert("You have lost!");
    }

    // Tie
    if (isFull(board)) {
      status = 3;
      alert("Tie!");
    }

    //TODO: Update status somewhere on page
  }

  function markWin() {
    for (let i = 0; i < winningArray.length; i++) {
      board[winningArray[i]![0]!]![winningArray[i]![1]!] = 3;
    }

    setBoard([...board]);
  }

  return (
    <>
      <div className="wrapper">
        {board.map((row) => {
          return row.map((el, index) => renderCell(el, index));
        })}
      </div>

      <aside>
        <button className="active">Start</button>
        <button className="disabled">Restart</button>
      </aside>
    </>
  );
}

export default Game;
