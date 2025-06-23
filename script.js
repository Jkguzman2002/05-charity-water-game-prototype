// Water Journey Maze Game
// This code lets you play a simple maze game using the keyboard or arrow buttons.
// All code is beginner-friendly and uses only basic JavaScript and the DOM.

// These variables keep track of the game state
let mazeData; // The maze layout
let playerPosition; // The player's current position
let collected; // How many water drops collected
let timer; // Time left
let interval; // For the countdown timer

// This function sets up the maze and resets everything
function initializeGame() {
  // This maze is a bit more complex, but all water droplets and the exit are accessible.
  // 'player' is the starting position, 'water' are the droplets, 'end' is the goal, and 'wall' are obstacles.
  mazeData = [
    ['player','empty','wall','empty','water','empty','empty'],
    ['wall','empty','wall','empty','wall','wall','empty'],
    ['water','empty','empty','empty','empty','water','wall'],
    ['empty','wall','wall','wall','empty','empty','empty'],
    ['empty','empty','water','wall','empty','wall','empty'],
    ['wall','empty','empty','empty','empty','wall','water'],
    ['empty','wall','water','wall','empty','empty','end']
  ];
  playerPosition = { x: 0, y: 0 };
  collected = 0;
  timer = 60;
  document.getElementById('timer').textContent = timer;
  document.getElementById('collected').textContent = collected;
  document.getElementById('endScreen').style.display = 'none';
}

// This function draws the maze on the page
function renderMaze() {
  const maze = document.getElementById('maze');
  maze.innerHTML = '';
  mazeData.forEach((row, y) => {
    row.forEach((cell, x) => {
      const div = document.createElement('div');
      div.classList.add('cell');
      if (cell === 'wall') div.classList.add('wall');
      if (cell === 'water') {
        div.classList.add('water');
        div.textContent = '💧';
      }
      if (cell === 'end') div.classList.add('end');
      // Show the player
      if (playerPosition.x === x && playerPosition.y === y) div.classList.add('player');
      maze.appendChild(div);
    });
  });
}

// This function tries to move the player by dx, dy
function move(dx, dy) {
  const newX = playerPosition.x + dx;
  const newY = playerPosition.y + dy;
  // Check if new position is inside the maze
  if (newX < 0 || newY < 0 || newY >= mazeData.length || newX >= mazeData[0].length) return;
  const target = mazeData[newY][newX];
  // Don't move into walls
  if (target === 'wall') return;

  // If it's water, collect it
  if (target === 'water') {
    collected++;
    document.getElementById('splashSound').play();
    mazeData[newY][newX] = 'empty';
    document.getElementById('collected').textContent = collected;
  }

  // If it's the end, check if all water is collected
  if (target === 'end') {
    clearInterval(interval);
    if (collected === 6) {
      showEndScreen('🎉 Congratulations! You collected all the water!');
    } else {
      showEndScreen('💧 Oops! You missed some water. Try again!');
    }
    return;
  }

  // Move the player
  playerPosition = { x: newX, y: newY };
  renderMaze();
}

// Show the end screen with a message
function showEndScreen(message) {
  document.getElementById('endMessage').textContent = message;
  document.getElementById('endScreen').style.display = 'flex';
}

// This function is called by the arrow buttons
function manualMove(dx, dy) {
  move(dx, dy);
}

// Start the game: reset everything and start the timer
function startGame() {
  initializeGame();
  document.getElementById('startScreen').style.display = 'none';
  renderMaze();
  interval = setInterval(() => {
    timer--;
    document.getElementById('timer').textContent = timer;
    if (timer === 0) {
      clearInterval(interval);
      showEndScreen("⏰ Time's up! Try again!");
    }
  }, 1000);
}

// Set up event listeners when the page loads
// This lets you use the keyboard and buttons

document.addEventListener('DOMContentLoaded', () => {
  // Start button
  document.getElementById('startButton').addEventListener('click', startGame);
  // Restart button
  document.getElementById('restartButton').addEventListener('click', startGame);
  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    switch(e.key) {
      case 'ArrowUp': move(0, -1); break;
      case 'ArrowDown': move(0, 1); break;
      case 'ArrowLeft': move(-1, 0); break;
      case 'ArrowRight': move(1, 0); break;
    }
  });
});

// Make manualMove available to the HTML buttons
document.manualMove = manualMove;

// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');
