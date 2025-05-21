// search-algorithms.js - Implements different maze-solving algorithms
// Include this script in index.html after the other scripts

// Store the currently selected algorithm
let currentAlgorithm = "bfs";

// Add a search algorithm dropdown to the menu
function addAlgorithmSelector() {
  if (document.getElementById('algorithmSelect')) return;
  
  const menu = document.getElementById('menu');
  
  // Create container for algorithm selector
  const algorithmContainer = document.createElement('div');
  algorithmContainer.className = 'custom-select';
  algorithmContainer.style.marginLeft = '10px';
  
  // Create the algorithm selector dropdown
  const algorithmSelect = document.createElement('select');
  algorithmSelect.id = 'algorithmSelect';
  
  // Add options for different algorithms
  const algorithms = [
    { value: 'bfs', text: 'BFS Search' },
    { value: 'dfs', text: 'DFS Search' },
    { value: 'astar', text: 'A* Search' }
  ];
  
  algorithms.forEach(algo => {
    const option = document.createElement('option');
    option.value = algo.value;
    option.textContent = algo.text;
    algorithmSelect.appendChild(option);
  });
  
  // Set change event listener
  algorithmSelect.addEventListener('change', function() {
    currentAlgorithm = this.value;
    console.log(`Algorithm changed to: ${currentAlgorithm}`);
    
    // Update button text to reflect the selected algorithm
    const solveButton = document.getElementById('solveMazeBtn');
    if (solveButton) {
      solveButton.value = `Visualize & Solve (${this.options[this.selectedIndex].text})`;
    }
  });
  
  // Add the selector to the container and the container to the menu
  algorithmContainer.appendChild(algorithmSelect);
  menu.appendChild(algorithmContainer);
  
  // Force the algorithm selector to be displayed
  algorithmContainer.style.display = 'inline-block';
}

// Create a direct initialization function to ensure everything is loaded
function initializeAlgorithmSelector() {
  console.log("Initializing algorithm selector");
  
  // First ensure we have the menu
  const menu = document.getElementById('menu');
  if (!menu) {
    console.error("Menu not found");
    setTimeout(initializeAlgorithmSelector, 1000); // Try again later
    return;
  }
  
  // Check if we already have the selector
  if (document.getElementById('algorithmSelect')) {
    console.log("Selector already exists");
    return;
  }
  
  // Create the dropdown directly without helper function
  const algorithmContainer = document.createElement('div');
  algorithmContainer.className = 'custom-select';
  algorithmContainer.style.marginLeft = '10px';
  algorithmContainer.style.display = 'inline-block';
  
  const algorithmSelect = document.createElement('select');
  algorithmSelect.id = 'algorithmSelect';
  
  // Add algorithm options
  const algorithms = [
    { value: 'bfs', text: 'BFS Search' },
    { value: 'dfs', text: 'DFS Search' },
    { value: 'astar', text: 'A* Search' }
  ];
  
  algorithms.forEach(algo => {
    const option = document.createElement('option');
    option.value = algo.value;
    option.textContent = algo.text;
    algorithmSelect.appendChild(option);
  });
  
  // Set up change event
  algorithmSelect.addEventListener('change', function() {
    currentAlgorithm = this.value;
    console.log(`Algorithm changed to: ${currentAlgorithm}`);
    
    // Update button text
    const solveButton = document.getElementById('solveMazeBtn');
    if (solveButton) {
      solveButton.value = `Visualize & Solve (${this.options[this.selectedIndex].text})`;
    }
  });
  
  // Add the selector to the menu
  algorithmContainer.appendChild(algorithmSelect);
  menu.appendChild(algorithmContainer);
  
  console.log("Algorithm selector added to menu");
}

// Run the initialization as soon as possible and after maze is created
window.addEventListener('load', function() {
  console.log("Window loaded");
  initializeAlgorithmSelector();
  setTimeout(initializeAlgorithmSelector, 1000);
});

// Also add the selector after maze creation
document.getElementById('startMazeBtn').addEventListener('click', function() {
  setTimeout(addAlgorithmSelector, 1000);
});

// DFS implementation to find a path through the maze
function solveMazeWithDFS() {
  if (!maze) return null;
  
  const map = maze.map();
  const start = maze.startCoord();
  const end = maze.endCoord();
  
  // Create a stack for DFS with the starting position
  const stack = [{x: start.x, y: start.y, path: []}];
  
  // Create a set to track visited cells
  const visited = new Set();
  visited.add(`${start.x},${start.y}`);
  
  // Store all cells visited during DFS to visualize the search process
  const visitedCells = [{x: start.x, y: start.y}];
  
  // DFS to find a path
  while (stack.length > 0) {
    const current = stack.pop(); // Take from the end (stack behavior)
    
    // Check if we've reached the end
    if (current.x === end.x && current.y === end.y) {
      return {
        path: current.path,
        visitedCells: visitedCells
      };
    }
    
    // Check each direction (north, south, east, west)
    const cell = map[current.x][current.y];
    
    // West
    if (cell.w && !visited.has(`${current.x-1},${current.y}`)) {
      const newPath = [...current.path, {keyCode: 37, direction: 'w'}];
      stack.push({x: current.x-1, y: current.y, path: newPath});
      visited.add(`${current.x-1},${current.y}`);
      visitedCells.push({x: current.x-1, y: current.y});
    }
    
    // South
    if (cell.s && !visited.has(`${current.x},${current.y+1}`)) {
      const newPath = [...current.path, {keyCode: 40, direction: 's'}];
      stack.push({x: current.x, y: current.y+1, path: newPath});
      visited.add(`${current.x},${current.y+1}`);
      visitedCells.push({x: current.x, y: current.y+1});
    }
    
    // East
    if (cell.e && !visited.has(`${current.x+1},${current.y}`)) {
      const newPath = [...current.path, {keyCode: 39, direction: 'e'}];
      stack.push({x: current.x+1, y: current.y, path: newPath});
      visited.add(`${current.x+1},${current.y}`);
      visitedCells.push({x: current.x+1, y: current.y});
    }
    
    // North
    if (cell.n && !visited.has(`${current.x},${current.y-1}`)) {
      const newPath = [...current.path, {keyCode: 38, direction: 'n'}];
      stack.push({x: current.x, y: current.y-1, path: newPath});
      visited.add(`${current.x},${current.y-1}`);
      visitedCells.push({x: current.x, y: current.y-1});
    }
  }
  
  return null; // No path found
}

// Calculate heuristic (Manhattan distance) for A* algorithm
function heuristic(cellA, cellB) {
  return Math.abs(cellA.x - cellB.x) + Math.abs(cellA.y - cellB.y);
}

// A* implementation to find the optimal path
function solveMazeWithAStar() {
  if (!maze) return null;
  
  const map = maze.map();
  const start = maze.startCoord();
  const end = maze.endCoord();
  
  // Create a priority queue (sorted array) for A*
  // Elements will be sorted by fScore (gScore + heuristic)
  const openSet = [{
    x: start.x, 
    y: start.y, 
    path: [], 
    gScore: 0, 
    fScore: heuristic(start, end)
  }];
  
  // Create a set to track visited cells
  const visited = new Set();
  visited.add(`${start.x},${start.y}`);
  
  // Store all cells visited during A* to visualize the search process
  const visitedCells = [{x: start.x, y: start.y}];
  
  // A* to find the optimal path
  while (openSet.length > 0) {
    // Sort by fScore and get the lowest element
    openSet.sort((a, b) => a.fScore - b.fScore);
    const current = openSet.shift();
    
    // Check if we've reached the end
    if (current.x === end.x && current.y === end.y) {
      return {
        path: current.path,
        visitedCells: visitedCells
      };
    }
    
    // Check each direction (north, south, east, west)
    const cell = map[current.x][current.y];
    
    // Helper function to process each neighbor
    function processNeighbor(dx, dy, keyCode, direction) {
      const newX = current.x + dx;
      const newY = current.y + dy;
      const key = `${newX},${newY}`;
      
      // If not visited yet, add to open set
      if (!visited.has(key)) {
        const newGScore = current.gScore + 1;
        const newFScore = newGScore + heuristic({x: newX, y: newY}, end);
        const newPath = [...current.path, {keyCode, direction}];
        
        openSet.push({
          x: newX,
          y: newY,
          path: newPath,
          gScore: newGScore,
          fScore: newFScore
        });
        
        visited.add(key);
        visitedCells.push({x: newX, y: newY});
      }
    }
    
    // North
    if (cell.n && !visited.has(`${current.x},${current.y-1}`)) {
      processNeighbor(0, -1, 38, 'n');
    }
    
    // South
    if (cell.s && !visited.has(`${current.x},${current.y+1}`)) {
      processNeighbor(0, 1, 40, 's');
    }
    
    // East
    if (cell.e && !visited.has(`${current.x+1},${current.y}`)) {
      processNeighbor(1, 0, 39, 'e');
    }
    
    // West
    if (cell.w && !visited.has(`${current.x-1},${current.y}`)) {
      processNeighbor(-1, 0, 37, 'w');
    }
  }
  
  return null; // No path found
}

// Function to solve the maze with the currently selected algorithm
function solveWithSelectedAlgorithm() {
  let result;
  
  switch(currentAlgorithm) {
    case 'dfs':
      result = solveMazeWithDFS();
      break;
    case 'astar':
      result = solveMazeWithAStar();
      break;
    case 'bfs':
    default:
      result = visualizeBFS(); // Using the existing BFS implementation
      break;
  }
  
  return result;
}

// Override the visualizeAndSolve function to use the selected algorithm
const originalVisualize = window.visualizeAndSolve;
window.visualizeAndSolve = function() {
  // Get the BFS result with path and visited cells
  const result = solveWithSelectedAlgorithm();
  
  if (!result) {
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
  
  // Visualize the search process first
  let visitedIndex = 0;
  
  function showVisitedCell() {
    if (visitedIndex >= result.visitedCells.length) {
      // After showing all visited cells, show the path
      animateFinalPath();
      return;
    }
    
    const cell = result.visitedCells[visitedIndex];
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
  
  // After showing the search process, animate the solution path
  function animateFinalPath() {
    // Redraw the maze to clear visited cells
    draw.redrawMaze(cellSize);
    
    // Now draw the final path with a different color
    const path = result.path;
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
        animateSolution(result.path);
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
};

// Update the "Auto Solve" button to use the selected algorithm
function updateSolveButton() {
  const solveButton = document.getElementById('solveMazeBtn');
  if (solveButton) {
    solveButton.onclick = function() {
      const result = solveWithSelectedAlgorithm();
      
      if (result && result.path.length > 0) {
        // Animate the solution
        animateSolution(result.path);
      } else {
        alert('No solution found or maze not initialized!');
      }
    };
  }
}

// Override the addSolveButton function to update the button
const originalAddSolveButton = window.addSolveButton;
window.addSolveButton = function() {
  originalAddSolveButton();
  updateSolveButton();
};

// Replace the addVisualSolveButton function to update with our algorithm selector
const originalAddVisualSolveButton = window.addVisualSolveButton;
window.addVisualSolveButton = function() {
  originalAddVisualSolveButton();
  
  // Change the button text to reflect it uses the selected algorithm
  const solveButton = document.getElementById('solveMazeBtn');
  if (solveButton) {
    solveButton.value = 'Visualize & Solve';
  }
  
  // Also make sure the algorithm selector is present
  addAlgorithmSelector();
};