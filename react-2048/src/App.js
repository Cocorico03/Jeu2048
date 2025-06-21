import React, { useState, useEffect } from 'react'; // Import React and its hooks
import './App.css'

const BOARD_SIZE = 4; // Define the size of the board (4x4)
// Transpose the grid (rows become columns)
function transpose(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

// Reverse each row in the grid
function reverse(matrix) {
  return matrix.map(row => [...row].reverse());
}

function moveLeft(board) {
  return board.map(row => {
    let filteredRow = row.filter(num => num !== 0);
    let newRow = [];

    for (let i = 0; i < filteredRow.length; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        newRow.push(filteredRow[i] * 2);
        i++;
      } else {
        newRow.push(filteredRow[i]);
      }
    }

    while (newRow.length < BOARD_SIZE) {
      newRow.push(0);
    }

    return newRow;
  });
}

function moveRight(board) {
  return reverse(moveLeft(reverse(board)));
}

function moveUp(board) {
  return transpose(moveLeft(transpose(board)));
}

function moveDown(board) {
  return transpose(moveRight(transpose(board)));
}


// Function to generate a blank 4x4 board filled with 0s
function generateEmptyBoard() {
  return Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
}

// Function to find a random empty cell on the board
function getRandomEmptyCell(board) {
  const emptyCells = []; // Store all empty (0) cells

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j] === 0) {
        emptyCells.push([i, j]); // Add coordinates of empty cells to the array
      }
    }
  }

  // If no empty cells, return null
  if (emptyCells.length === 0) return null;

  // Pick a random empty cell
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Function to place a random tile (2 or 4) on an empty cell
function addRandomTile(board) {
  const cell = getRandomEmptyCell(board); // Find a random empty spot
  if (!cell) return board; // If no space, return the board as-is

  const [i, j] = cell; // Destructure the row and column indices
  board[i][j] = Math.random() < 0.9 ? 2 : 4; // 90% chance for 2, 10% for 4
  return board;
}

// Main App component
function App() {
  // State to store the board
  const [board, setBoard] = useState(generateEmptyBoard());

  // useEffect runs once after the component mounts
  useEffect(() => {
    let newBoard = generateEmptyBoard();     // Start with a blank board
    newBoard = addRandomTile(newBoard);      // Add the first random tile
    newBoard = addRandomTile(newBoard);      // Add the second random tile
    setBoard([...newBoard]);                 // Update the state with the new board
    window.focus();                          // This forces the app to capture keyboard input

  }, []);

  // useEffect to listen for keyboard input (arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault(); // 🛑 Stop the browser from scrolling
        console.log('Key pressed:', e.key); // <-- for debugging
        switch (e.key) {
          case 'ArrowLeft': {
            const moved = moveLeft(board);
            if (JSON.stringify(board) !== JSON.stringify(moved)) {
              const updated = addRandomTile(moved);
              setBoard(updated);
            }
            break;
          }
          case 'ArrowRight': {
            const moved = moveRight(board);
            if (JSON.stringify(board) !== JSON.stringify(moved)) {
              const updated = addRandomTile(moved);
              setBoard(updated);
            }
            break;
          }
          case 'ArrowUp': {
            const moved = moveUp(board);
            if (JSON.stringify(board) !== JSON.stringify(moved)) {
              const updated = addRandomTile(moved);
              setBoard(updated);
            }
            break;
          }
          case 'ArrowDown': {
            const moved = moveDown(board);
            if (JSON.stringify(board) !== JSON.stringify(moved)) {
              const updated = addRandomTile(moved);
              setBoard(updated);
            }
            break;
          }
          default:
            console.log(`Ignored key: ${e.key}`);
            break;
      }

      }
    };

    window.addEventListener('keydown', handleKeyDown); // Add event listener

    return () => window.removeEventListener('keydown', handleKeyDown); // Clean up when component unmounts
  }, [board]);

  /*
  What this JSX does:

  - Wraps your app in a styled container (game-container)
  - Adds a title, instructions, and a "New Game" button
  - Creates a visual grid from the board array using nested .map()
  - Uses a <div> for each tile with classes like tile-2, tile-4, etc.,
    so you can color them with CSS
*/


  return (
    <div className="game-container">
      <h1>2048 Game</h1>
      <p>Use arrow keys to move the tiles.</p>
      <button onClick={() => window.location.reload()}>New Game</button>
      <div className="board">
        {board.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => (
              <div key={j} className={`tile tile-${cell}`}>{cell !== 0 ? cell : ''}</div>
            ))}
          </div>
        ))}
      </div>
    </div>

  );
}

export default App; // Export the component
