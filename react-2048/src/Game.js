// Game.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

// Check if any moves are possible
function hasAvailableMoves(board) {
  const size = board.length;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j] === 0) return true;
      if (j < size - 1 && board[i][j] === board[i][j + 1]) return true;
      if (i < size - 1 && board[i][j] === board[i + 1][j]) return true;
    }
  }
  return false;
}

// Check if a specific value is on the board
function hasReachedTile(board, value) {
  return board.some(row => row.includes(value));
}

// Matrix utilities
const transpose = matrix => matrix[0].map((_, i) => matrix.map(row => row[i]));
const reverse = matrix => matrix.map(row => [...row].reverse());

// Movement logic
function moveLeft(board) {
  return board.map(row => {
    let filtered = row.filter(num => num !== 0);
    let newRow = [];
    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        newRow.push(filtered[i] * 2);
        i++;
      } else {
        newRow.push(filtered[i]);
      }
    }
    while (newRow.length < row.length) newRow.push(0);
    return newRow;
  });
}
const moveRight = board => reverse(moveLeft(reverse(board)));
const moveUp = board => transpose(moveLeft(transpose(board)));
const moveDown = board => transpose(moveRight(transpose(board)));

// Create a blank board
const generateEmptyBoard = size => Array(size).fill().map(() => Array(size).fill(0));

// Add a 2 or 4 to a random empty tile
function addRandomTile(board) {
  const emptyCells = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === 0) emptyCells.push([i, j]);
    }
  }
  if (emptyCells.length === 0) return board;
  const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[i][j] = Math.random() < 0.9 ? 2 : 4;
  return board;
}

// Score calculation
function calculatePoints(oldBoard, newBoard) {
  let sum = 0;
  for (let i = 0; i < oldBoard.length; i++) {
    for (let j = 0; j < oldBoard[i].length; j++) {
      if (newBoard[i][j] > oldBoard[i][j]) {
        sum += newBoard[i][j] - oldBoard[i][j];
      }
    }
  }
  return sum;
}

function App() {
  const [board, setBoard] = useState([]);
  const [level, setLevel] = useState(1);
  const [boardSize, setBoardSize] = useState(3);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showLevelUpMsg, setShowLevelUpMsg] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('highScore')) || 0);

  useEffect(() => {
    const size = level === 1 ? 3 : 4;
    const newBoard = addRandomTile(addRandomTile(generateEmptyBoard(size)));
    setBoard(newBoard);
    setBoardSize(size);
    setScore(0);
    window.focus();
  }, [level]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;

      e.preventDefault();
      let moved;
      switch (e.key) {
        case 'ArrowLeft': moved = moveLeft(board); break;
        case 'ArrowRight': moved = moveRight(board); break;
        case 'ArrowUp': moved = moveUp(board); break;
        case 'ArrowDown': moved = moveDown(board); break;
        default: return;
      }

      if (JSON.stringify(board) !== JSON.stringify(moved)) {
        const updated = addRandomTile(moved);
        setBoard(updated);

        const points = calculatePoints(board, moved);
        const newScore = score + points;
        setScore(newScore);

        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('highScore', newScore);
        }

        if (hasReachedTile(updated, 64) && level === 1) {
          setShowLevelUpMsg(true);
          setTimeout(() => {
            setShowLevelUpMsg(false);
            setLevel(2);
          }, 2000);
        }

        if (hasReachedTile(updated, 2048) && !hasWon) {
          setHasWon(true);
        }

        if (!hasAvailableMoves(updated)) {
          setIsGameOver(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board, score, highScore, level, hasWon]);

  return (
    <div className="game-container">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> <span>&gt;</span> <span>Game</span>
      </div>

      <h1 style={{ textAlign: 'center' }}>2048 Game</h1>
      <p style={{ textAlign: 'center' }}>Use arrow keys to move the tiles.</p>
      <p style={{ textAlign: 'center' }}>Level: {level} — Grid: {boardSize} × {boardSize}</p>

      <div className="top-bar" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
        <div className="button-group">
          <button onClick={() => window.location.reload()}>New Game</button>
          {level === 1 && !hasWon && !showLevelUpMsg && (
            <button onClick={() => setLevel(prev => prev + 1)}>Next Level</button>
          )}
        </div>
        <div className="score-boxes">
          <div className="score">Score<br />{score}</div>
          <div className="high-score">High Score<br />{highScore}</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-start', maxWidth: '1000px', margin: '0 auto', gap: '40px' }}>
        <div className="instructions-panel" style={{ width: '320px', background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 3px 8px rgba(0,0,0,0.1)', fontSize: '16px', lineHeight: '1.6' }}>
          <h2 style={{ fontSize: '20px' }}>🎮 How to Play 2048</h2>
          <p><strong>Goal:</strong><br />Combine tiles with the same number to reach the 2048 tile.</p>
          <p><strong>🕹️ Controls</strong><br />Use your arrow keys to move tiles:</p>
          <ul style={{ paddingLeft: '20px', fontSize: '16px' }}>
            <li>⬅️ Left</li>
            <li>➡️ Right</li>
            <li>⬆️ Up</li>
            <li>⬇️ Down</li>
          </ul>
          <p>Each move slides all tiles in the chosen direction. When two tiles with the same number collide, they merge and their values are added.</p>
          <p><strong>🌟 Levels</strong><br />Start at 3×3. Reach 64 to unlock 4×4.<br />Keep merging to 2048!</p>
          <p><strong>❌ Game Over</strong><br />No moves left or board is full.</p>
          <p><strong>🏆 Scoring</strong><br />Each merge adds to your score. High score is saved in browser.</p>
          <p><strong>🔁 Reset</strong><br />Click New Game to restart.</p>
        </div>

        <div className="board-wrapper" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {showLevelUpMsg && <div className="popup-message">🎉 Good Job! Let's move to Level 2!</div>}
          {hasWon && <div className="popup-message win">🏆 You Win!</div>}

          <div className="board">
            {board.map((row, i) => (
              <div key={i} className="row">
                {row.map((cell, j) => (
                  <div key={j} className={`tile tile-${cell}`}>{cell !== 0 ? cell : ''}</div>
                ))}
              </div>
            ))}
          </div>

          {isGameOver && (
            <div className="game-over">
              <div className="game-over-message">
                <h2>Game Over!</h2>
                <button onClick={() => window.location.reload()}>Try Again</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
