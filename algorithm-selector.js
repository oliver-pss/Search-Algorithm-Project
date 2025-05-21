// algorithm-selector.js - Simple standalone file to add algorithm selection
// This is a separate file to ensure it loads independently from other scripts

// Store the currently selected algorithm
let currentAlgorithm = "bfs";

// Function to create and add the algorithm selector dropdown
function createAlgorithmSelector() {
  console.log("Creating algorithm selector");
  
  // Wait until DOM is ready
  if (!document.getElementById('menu')) {
    console.log("Menu not ready yet, trying again in 500ms");
    setTimeout(createAlgorithmSelector, 500);
    return;
  }
  
  // Check if the selector already exists
  if (document.getElementById('algorithmSelect')) {
    console.log("Algorithm selector already exists");
    return;
  }
  
  // Get the menu element
  const menu = document.getElementById('menu');
  
  // Create a new div for the algorithm selector
  const algoDiv = document.createElement('div');
  algoDiv.className = 'custom-select';
  algoDiv.style.marginLeft = '10px';
  
  // Create the select element
  const algoSelect = document.createElement('select');
  algoSelect.id = 'algorithmSelect';
  
  // Create the options
  const algorithms = [
    { value: 'bfs', text: 'BFS Search' },
    { value: 'dfs', text: 'DFS Search' },
    { value: 'astar', text: 'A* Search' }
  ];
  
  // Add options to the select element
  algorithms.forEach(algo => {
    const option = document.createElement('option');
    option.value = algo.value;
    option.textContent = algo.text;
    algoSelect.appendChild(option);
  });
  
  // Add change event listener
  algoSelect.addEventListener('change', function() {
    currentAlgorithm = this.value;
    console.log("Algorithm changed to:", currentAlgorithm);
    
    // Update solve button text if it exists
    const solveBtn = document.getElementById('solveMazeBtn');
    if (solveBtn) {
      solveBtn.value = `Solve (${this.options[this.selectedIndex].text})`;
    }
  });
  
  // Add the select to the div and the div to the menu
  algoDiv.appendChild(algoSelect);
  menu.appendChild(algoDiv);
  
  console.log("Algorithm selector successfully added");
}

// Try to create the selector as soon as possible
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded, creating algorithm selector");
  createAlgorithmSelector();
  
  // Try again after a delay to ensure it gets added
  setTimeout(createAlgorithmSelector, 1000);
});

// Also try when the window is fully loaded
window.addEventListener('load', function() {
  console.log("Window loaded, creating algorithm selector");
  createAlgorithmSelector();
});

// Add event listener to the Start button to ensure selector exists after maze creation
document.addEventListener('click', function(e) {
  if (e.target && e.target.id === 'startMazeBtn') {
    console.log("Start button clicked, ensuring algorithm selector exists");
    setTimeout(createAlgorithmSelector, 500);
  }
});

// Export the current algorithm for other scripts to use
window.getCurrentAlgorithm = function() {
  return currentAlgorithm;
};