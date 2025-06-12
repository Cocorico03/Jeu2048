import React, { useState, useEffect } from 'react'; // Import React and its hooks

const BOARD_SIZE = 4; // Define the size of the board (4x4)

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
  }, []);

  // useEffect to listen for keyboard input (arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          console.log('Move up'); // We'll implement this later
          break;
        case 'ArrowDown':
          console.log('Move down');
          break;
        case 'ArrowLeft':
          console.log('Move left');
          break;
        case 'ArrowRight':
          console.log('Move right');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown); // Add event listener

    return () => window.removeEventListener('keydown', handleKeyDown); // Clean up when component unmounts
  }, []);

  return (
    <div>
      <h1>2048 Logic View</h1>
      
      {/* Print the board in readable JSON format */}
      <pre>{JSON.stringify(board, null, 2)}</pre>
    </div>
  );
}

export default App; // Export the component
