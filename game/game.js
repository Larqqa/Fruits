const body = document.getElementById('body');
let boxWidth = window.innerWidth / 12;
if(window.innerWidth < 1000) boxWidth = window.innerWidth / 5;
const boxHeight = boxWidth;
const gridWidth = (window.innerWidth / boxWidth) + 1;
const gridHeight = (window.innerHeight / boxHeight);
const fruits = [];
let lastFruit = 0;
const checkedFruit = [];

// Make a fruit for each grid
const init = () => {
  let i = 0;
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      fruits.push(new Fruit(x, y, i));
      i++;
    }
  }
}

// Init game board
const drawBoxes = () => {

  // Empty body
  body.innerHTML = '';

  for (let y = 0; y < gridHeight; y++) {

    // Make a row for each grid y
    const row = document.createElement('div');
    row.classList.add('row');

    if (y === 0) {
      row.classList.add('zero');
      row.style.cssText = `margin-top: -${boxHeight / 3}px`;
    } else if (y % 2 !== 0) {
      row.classList.add('odd');
      row.style.cssText = `margin-left: -${boxWidth / 2}px`;
    } else {
      row.classList.add('even');
    }
    
    // Check id row is odd or even and change x accordingly
    const xWidth = y % 2 === 0 ? gridWidth - 1 : gridWidth;

    for (let x = 0; x < xWidth; x++) {

      // Make a box for each grid x and add to row
      const box = document.createElement('div');
      box.classList.add('box');

      box.style.cssText = `min-height: ${boxHeight}px;min-width: ${boxWidth}px;max-width: ${boxWidth}px;`
      if (y % 2 !== 0) {
        box.classList.add('odd');

        if (x === 1) {
          box.classList.add('start');
        } else if (x === xWidth - 2) {
          box.classList.add('end');
        }

      } else {
        box.classList.add('even');

        if (x === 0) {
          box.classList.add('start');
        } else if (x === xWidth - 1) {
          box.classList.add('end');
        }

      }
      

      // Make top of box
      const top = document.createElement('a');
      top.classList.add('top');
      top.href = "#";

      top.onclick = (e) => {
        e.preventDefault();
        handleActive(parseInt(e.target.id));
      }

      // Make left panel of box
      const left = document.createElement('span');
      left.classList.add('left');

      // Make right panel of box
      const right = document.createElement('span');
      right.classList.add('right');

      // Check which boxes are in game board
      if (y !== 0 && x < gridWidth - 1) {
        if (y % 2 === 0 || x !== 0) {
          box.classList.add('center')
        }
      }

      // Add elements to the body
      box.appendChild(top);
      box.appendChild(left);
      box.appendChild(right);
      row.appendChild(box);
    }
    body.appendChild(row);
  }
}

const drawFruit = () => {
  const boxes = document.getElementsByClassName('center')

  // For each box in the center draw fruit
  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i];
    const fruit = fruits[i];

    // Init fruits
    if (box.getElementsByClassName('fruit').length === 0) {
      const fruitContainer = document.createElement('p');
      fruitContainer.classList.add('fruit');
      fruitContainer.style.cssText = `font-size: ${boxWidth * .3}px;`;
      fruitContainer.innerHTML = fruit.fruit;
  
      const top = box.getElementsByClassName('top')[0]
      top.id = i;
      top.appendChild(fruitContainer);
    } else {
      // If fruits are set
      const fruitP = box.getElementsByClassName('fruit')[0]
      fruitP.innerHTML = fruit.fruit;
    }
  }
  // Check if any fruits are in lines of threes
  checkThrees();
}

// handle click on fruit
const handleActive = (id) => {
  // Check adjacent fruit
  if (checkedFruit.length === 0) {  
    check(id);
  } else {

    // Empty active classes and checkedFruits
    const boxes = document.getElementsByClassName('active');
    const boxLen = boxes.length;
    let i = 0;
    
    while (i < boxLen) {
      const box = boxes[0];
      box.classList.remove('active');
      i++;
    }

    // Change fruits if adjacent
    if (checkedFruit.includes(id)) {
      changeFruit(id);
    }

    // Empty checked fruit array
    while(checkedFruit.length) {
      const index = checkedFruit[checkedFruit.length - 1]
      const fruit = fruits[index]
      fruit.activeCheck();
      checkedFruit.pop();
    }
  }
}

// Handle fruit change
const changeFruit = (id) => {
  const fruit = fruits[id];

  // Switch fruits
  fruits[id] = fruits[lastFruit];
  fruits[lastFruit] = fruit;

  // Re-draw fruits
  drawFruit();
  checkThrees(id);
}

// Check if any fruits are in lines of threes
const checkThrees = (id) => {
  const boxes = document.getElementsByClassName('center')
  
  // Get all adjacent fruits of the changed fruit
  if (id) {
    const fruit = fruits[id];
    const leftFruit = fruits[id - 1];
    const rightFruit = fruits[id + 1];
    const topLeftFruit = fruits[id - gridWidth + 1];
    const topRightFruit = fruits[id - gridWidth + 2];
    const botRightFruit = fruits[id + gridWidth - 1];
    const botLeftFruit = fruits[id + gridWidth - 2];
    
    if (id !== 0 && id !== gridWidth - 1) {
      if (
        fruit.fruit == leftFruit.fruit &&
        fruit.fruit == rightFruit.fruit
      ) {
  
        // If horizontal
        leftFruit.reset();
        fruit.reset();
        rightFruit.reset();
        drawFruit();

      } else if (
        id - gridWidth + 2 > 0 && id + gridWidth - 1 > 0 &&
        fruit.fruit == topLeftFruit.fruit &&
        fruit.fruit == botRightFruit.fruit
      ) {

        // If diagonal from left
        topLeftFruit.reset();
        fruit.reset();
        botRightFruit.reset();
        drawFruit();

      } else if (
        id - gridWidth + 1 > 0 && id + gridWidth - 2 > 0 &&
        fruit.fruit == topRightFruit.fruit &&
        fruit.fruit == botLeftFruit.fruit
      ) {

        // If diagonal from right
        topRightFruit.reset();
        fruit.reset();
        botLeftFruit.reset();
        drawFruit();
      }
    }

    return;
  }

  // For each fruit in center boxes
  for (let i = 0; i < boxes.length; i++) {
    // Get all adjacent fruits
    const fruit = fruits[i];
    const leftFruit = fruits[i - 1];
    const rightFruit = fruits[i + 1];
    const topLeftFruit = fruits[i - gridWidth + 1];
    const topRightFruit = fruits[i - gridWidth + 2];
    const botRightFruit = fruits[i + gridWidth - 1];
    const botLeftFruit = fruits[i + gridWidth - 2];

    if (i !== 0 && i !== gridWidth - 1) {
      if (
        fruit.fruit == leftFruit.fruit &&
        fruit.fruit == rightFruit.fruit
      ) {
  
        // If horizontal
        leftFruit.reset();
        fruit.reset();
        rightFruit.reset();
        drawFruit();

      } else if (
        i - gridWidth + 2 > 0 && i + gridWidth - 1 > 0 &&
        fruit.fruit == topLeftFruit.fruit &&
        fruit.fruit == botRightFruit.fruit
      ) {

        // If diagonal from left
        topLeftFruit.reset();
        fruit.reset();
        botRightFruit.reset();
        drawFruit();

      } else if (
        i - gridWidth + 1 > 0 && i + gridWidth - 2 > 0 &&
        fruit.fruit == topRightFruit.fruit &&
        fruit.fruit == botLeftFruit.fruit
      ) {

        // If diagonal from right
        topRightFruit.reset();
        fruit.reset();
        botLeftFruit.reset();
        drawFruit();
      }
    }
  }
}

// Check adjacent fruit
const check = (id) => {
  const boxes = document.getElementsByClassName('center')

  // For each box in game board, check the fruits adjacent block
  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i];
    const fruit = fruits[i];

    // Change classes and active state
    const fruitsActiveChecker = () => {
      if(fruit.active) {
        box.classList.remove('active');
      } else {
        box.classList.add('active');
        if (id !== i) {
          checkedFruit.push(i);
        } else {
          checkedFruit.push(i);
          lastFruit = id;
        }
      }
      fruits[i].activeCheck();
    }

    // If fruit is the one clicked
    if (id === i){
      fruitsActiveChecker();
    }

    // Check all others than the end and start boxes
    if(
      !boxes[id].classList.contains('start') &&
      !boxes[id].classList.contains('end')
    ) {
      if (
        id === i + 1 ||
        id === i - 1 ||
        id === i + gridWidth - 1 ||
        id === i + gridWidth - 2 ||
        id === i - gridWidth + 1 ||
        id === i - gridWidth + 2
      ) {
        fruitsActiveChecker();
      }
    } else {
      // Check on the left side
      if (
        !boxes[id].classList.contains('odd') &&
        !boxes[id].classList.contains('start')
      ) {
        if (
          id === i + 1 ||
          id === i + gridWidth - 1 ||
          id === i - gridWidth + 2
        ) {
          fruitsActiveChecker();
        }
      } else {
        if (!boxes[id].classList.contains('start')) {
  
          // Even rows need to check top left and bottom left boxes too          
          if (
            id === i + 1 ||
            id === i + gridWidth - 1 ||
            id === i - gridWidth + 2 ||
            id === i + gridWidth - 2 ||
            id === i - gridWidth + 1
          ) {
            fruitsActiveChecker();
          }
        }
      
      }
      // Check on the right side
      if (
        !boxes[id].classList.contains('odd') &&
        !boxes[id].classList.contains('end')
      ) {
        if (
          id === i - 1 ||
          id === i + gridWidth - 2 ||
          id === i - gridWidth + 1
        ) {
          fruitsActiveChecker();
        }

      } else {

        // Even rows need to check top left and bottom left boxes too
        if (!boxes[id].classList.contains('end')) {
          if (
            id === i - 1 ||
            id === i + gridWidth - 2 ||
            id === i - gridWidth + 1 ||
            id === i + gridWidth - 1 ||
            id === i - gridWidth + 2
          ) {
            fruitsActiveChecker();
          }
        }
      }
    }
  }
}

init();
drawBoxes();
drawFruit();