import { useState, useCallback } from 'react';

function Square({ value, onClick }) {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onClick }) {
  const renderSquare = useCallback(
    (i) => <Square value={squares[i]} onClick={() => onClick(i)} />,
    [squares, onClick]
  );

  return (
    <>
      <div className="status">
        {calculateStatus(xIsNext, calculateWinner(squares))}
      </div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </>
  );
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const handlePlay = useCallback(
    (i) => {
      if (calculateWinner(currentSquares) || currentSquares[i]) {
        return;
      }
      const nextSquares = [...currentSquares];
      nextSquares[i] = xIsNext ? 'X' : 'O';
      const nextHistory = history.slice(0, currentMove + 1).concat([nextSquares]);
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);
    },
    [currentMove, currentSquares, history, xIsNext]
  );

  const jumpTo = useCallback(
    (move) => {
      setCurrentMove(move);
    },
    []
  );

  const moves = history.map((squares, move) => {
    const description = move ? `Go to move #${move}` : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onClick={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateStatus(xIsNext, winner) {
  if (winner) {
    return `Winner: ${winner}`;
  }
  return `Next player: ${xIsNext ? 'X' : 'O'}`;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export { Square, Board, Game, calculateWinner };
