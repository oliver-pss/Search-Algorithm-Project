// This code should be saved as a file named bfs-visualization.js
// Include this script in the index.html after maze-solver.js

// Function to highlight the BFS search process
function visualizeBFS() {
  if (!maze) return null;
  
  // Get the canvas and context
  const canvas = document.getElementById('mazeCanvas');
  const ctx = canvas.getContext('2d');
  
  const map = maze.map();
  const start = maze.startCoord();
  const end = maze.endCoord();
  
  // Calculate cell size
  const cellSize = canvas.width / map.length;
  
  // Create a queue for BFS with the starting position
  const queue = [{x: start.x, y: start.y, path: []}];
  
  // Create a set to track visited cells
  const visited = new Set();
  visited.add(`${start.x},${start.y}`);
  
  // Store all cells visited during BFS to visualize the search
  const visitedCells = [{x: start.x, y: start.y}];
  
  // BFS to find the shortest path
  while (queue.length > 0) {
    const current = queue.shift();
    
    // Check if we've reached the end
    if (current.x === end.x && current.y === end.y) {
      // Return the path and visited cells for visualization
      return {
        path: current.path,
        visitedCells: visitedCells
      };
    }
    
    // Check each direction (north, south, east, west)
    const cell = map[current.x][current.y];
    
    // North
    if (cell.n && !visited.has(`${current.x},${current.y-1}`)) {
      const newPath = [...current.path, {keyCode: 38, direction: 'n'}];
      queue.push({x: current.x, y: current.y-1, path: newPath});
      visited.add(`${current.x},${current.y-1}`);
      visitedCells.push({x: current.x, y: current.y-1});
    }
    
    // South
    if (cell.s && !visited.has(`${current.x},${current.y+1}`)) {
      const newPath = [...current.path, {keyCode: 40, direction: 's'}];
      queue.push({x: current.x, y: current.y+1, path: newPath});
      visited.add(`${current.x},${current.y+1}`);
      visitedCells.push({x: current.x, y: current.y+1});
    }
    
    // East
    if (cell.e && !visited.has(`${current.x+1},${current.y}`)) {
      const newPath = [...current.path, {keyCode: 39, direction: 'e'}];
      queue.push({x: current.x+1, y: current.y, path: newPath});
      visited.add(`${current.x+1},${current.y}`);
      visitedCells.push({x: current.x+1, y: current.y});
    }
    
    // West
    if (cell.w && !visited.has(`${current.x-1},${current.y}`)) {
      const newPath = [...current.path, {keyCode: 37, direction: 'w'}];
      queue.push({x: current.x-1, y: current.y, path: newPath});
      visited.add(`${current.x-1},${current.y}`);
      visitedCells.push({x: current.x-1, y: current.y});
    }
  }
  
  return null; // No path found
}

// Visualize the BFS process and then animate the solution
function visualizeAndSolve() {
  // Get the BFS result with path and visited cells
  const bfsResult = visualizeBFS();
  
  if (!bfsResult) {
    alert('No solution found or maze not initialized!');
    return;
  }
  
  const canvas = document.getElementById('mazeCanvas');
  const ctx = canvas.getContext('2d');
  const cellSize = canvas.width / maze.map().length;
  
  // Disable controls during animation
  const originalKeyDown = window.onkeydown;
  window.onkeydown = function(e) {
    e.preventDefault();
    return false;
  };
  
  // Visualize the BFS search process first
  let visitedIndex = 0;
  
  function showVisitedCell() {
    if (visitedIndex >= bfsResult.visitedCells.length) {
      // After showing all visited cells, show the path
      animateFinalPath();
      return;
    }
    
    const cell = bfsResult.visitedCells[visitedIndex];
    visitedIndex++;
    
    // Draw visited cell with light blue color
    ctx.fillStyle = 'rgba(135, 206, 250, 0.5)'; // Light blue
    ctx.fillRect(
      cell.x * cellSize + 2,
      cell.y * cellSize + 2,
      cellSize - 4,
      cellSize - 4
    );
    
    // Schedule next cell after a short delay
    setTimeout(showVisitedCell, 30);
  }
  
  // After showing the BFS process, animate the solution path
  function animateFinalPath() {
    // Redraw the maze to clear visited cells
    draw.redrawMaze(cellSize);
    
    // Now draw the final path with a different color
    const path = bfsResult.path;
    let currentX = maze.startCoord().x;
    let currentY = maze.startCoord().y;
    
    // Draw start position
    ctx.fillStyle = 'rgba(50, 205, 50, 0.7)'; // Green for start
    ctx.fillRect(
      currentX * cellSize + 5,
      currentY * cellSize + 5,
      cellSize - 10,
      cellSize - 10
    );
    
    // Animate the solution path
    let pathIndex = 0;
    
    function drawPathStep() {
      if (pathIndex >= path.length) {
        // Path animation complete, restore controls and actually move the player
        window.onkeydown = originalKeyDown;
        
        // Now move the player along the path
        animateSolution(bfsResult.path);
        return;
      }
      
      const step = path[pathIndex];
      pathIndex++;
      
      // Update position based on direction
      switch (step.direction) {
        case 'n': currentY--; break;
        case 's': currentY++; break;
        case 'e': currentX++; break;
        case 'w': currentX--; break;
      }
      
      // Draw path cell with green
      ctx.fillStyle = 'rgba(50, 205, 50, 0.7)'; // Green for path
      ctx.fillRect(
        currentX * cellSize + 5,
        currentY * cellSize + 5,
        cellSize - 10,
        cellSize - 10
      );
      
      // Schedule next step
      setTimeout(drawPathStep, 100);
    }
    
    // Start path animation after a delay
    setTimeout(drawPathStep, 500);
  }
  
  // Start the visualization process
  setTimeout(showVisitedCell, 500);
}

// Replace the solve button click handler with the visualization function
function addVisualSolveButton() {
  if (document.getElementById('solveMazeBtn')) {
    // Update existing button
    document.getElementById('solveMazeBtn').onclick = visualizeAndSolve;
    return;
  }
  
  const menu = document.getElementById('menu');
  const solveButton = document.createElement('input');
  solveButton.id = 'solveMazeBtn';
  solveButton.type = 'button';
  solveButton.value = 'Visualize & Solve';
  solveButton.style.marginLeft = '10px';
  solveButton.style.backgroundColor = 'rgba(0, 100, 255, 0.4)';
  solveButton.onclick = visualizeAndSolve;
  
  menu.appendChild(solveButton);
}

// Replace the original addSolveButton function with our enhanced version
document.addEventListener('DOMContentLoaded', function() {
  // Override the addSolveButton function from maze-solver.js
  window.addSolveButton = addVisualSolveButton;
  
  // Call it after a delay to ensure maze is initialized
  setTimeout(addVisualSolveButton, 1500);
});

// Also add the button after maze creation
document.getElementById('startMazeBtn').addEventListener('click', function() {
  setTimeout(addVisualSolveButton, 1000);
});