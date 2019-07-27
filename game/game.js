const body = document.getElementById('body');
let boxWidth = window.innerWidth / 12;
let boxHeight = boxWidth;
let gridWidth = (window.innerWidth / boxWidth) + 1;
let gridHeight = (window.innerHeight / boxHeight);

if(window.innerWidth < 500) {
  boxWidth = window.innerWidth / 5;
  boxHeight = boxWidth;
  gridWidth = (window.innerWidth / boxWidth) + 1;
  gridHeight = (window.innerHeight / boxHeight);
}
let score = 0;

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
const drawScore = () => {
  document.getElementById('score').innerHTML = `Score: ${score}`;
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
      row.style.cssText = `margin-top: -${boxHeight / 2}px`;
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
  drawScore();
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

  // Check adjacent fruit of clicked fruit
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

// Check adjacent fruit
const check = (id) => {
  lastFruit = id;

  const checkFruits = [
    [fruits[id], id],
    [fruits[id - 1], id - 1],
    [fruits[id + 1], id + 1],
    [fruits[id - gridWidth + 1], id - gridWidth + 1],
    [fruits[id - gridWidth + 2], id - gridWidth + 2],
    [fruits[id + gridWidth - 1], id + gridWidth - 1],
    [fruits[id + gridWidth - 2], id + gridWidth - 2]
  ];

  let box = document.getElementById(checkFruits[0][1]).parentElement;

  if (box.classList.contains('odd') && box.classList.contains('start')) {
    checkFruits.splice(1, 1);
  } else if (box.classList.contains('odd') && box.classList.contains('end')) {
    checkFruits.splice(2, 1);
  } else if (box.classList.contains('even') && box.classList.contains('start')) {
    checkFruits.splice(1, 1);
    checkFruits.splice(2, 1);
    checkFruits.splice(4, 1);
  } else if (box.classList.contains('even') && box.classList.contains('end')) {
    checkFruits.splice(5, 1);
    checkFruits.splice(2, 1);
    checkFruits.splice(3, 1);
  }

  const fruitsActiveChecker = (fruit, box) => {
    if(!box) return;
    const activeFruit = fruit[0];
    
    if(activeFruit.active) {
      box.classList.remove('active');
    } else {
      box.classList.add('active');

      checkedFruit.push(fruit[1]);
    }
    fruit[0].activeCheck();
  }

  for (let i = 0; i < checkFruits.length; i++) {
    let box = null;
    if(document.getElementById(checkFruits[i][1])) {
      box = document.getElementById(checkFruits[i][1]).parentElement;
    }

    fruitsActiveChecker(checkFruits[i], box);
  }
}

// Handle fruit change
const changeFruit = (id) => {
  const fruit = fruits[id];

  if (id !== lastFruit) {
    const fruitNew = document.getElementById(id).getElementsByClassName('fruit')[0];
    const fruitLast = document.getElementById(lastFruit).getElementsByClassName('fruit')[0];

    // animate opacity change on fruit change
    fruitNew.classList.add('hide');
    fruitLast.classList.add('hide');

    setTimeout(()=>{
      drawFruit();
      checkThrees(id);
      fruitNew.classList.remove('hide');
      fruitLast.classList.remove('hide');
    }, 250);
  }

  // Switch fruits
  fruits[id] = fruits[lastFruit];
  fruits[lastFruit] = fruit;
}

// Check if any fruits are in lines of threes
const checkThrees = (identifier) => {
  const boxes = document.getElementsByClassName('center')
  
  // Get all adjacent fruits of the changed fruit
  const getAdj = (adjIdentifier) => {
    let id = adjIdentifier;

    const box = document.getElementById(id).parentElement;

    // If checking the start of even row, check with id + 1
    // Else this checks from odd rows end
    // There was some bugs with implementing this in the main block so this fixes the bugs
    if (id && box && box.classList.contains('start') && box.classList.contains('even')) {
      const newId = id + 1;
      const fruit = fruits[newId];
      const leftFruit = fruits[newId - 1];
      const rightFruit = fruits[newId + 1];
      if (id !== 0 && id !== gridWidth - 1) {
        if (
          fruit.fruit == leftFruit.fruit &&
          fruit.fruit == rightFruit.fruit
        ) {
          // If horizontal
          leftFruit.reset();
          fruit.reset();
          rightFruit.reset();
          if(id) score++;
          drawFruit();
        }
      }
      return;
    }

    // Index 12 is somehow out of the cheks, but this fixes that
    if (id === 12) {
      const fruit = fruits[id];
      const topLeftFruit = fruits[id - gridWidth + 1];
      const topRightFruit = fruits[id - gridWidth + 2];
      const botRightFruit = fruits[id + gridWidth - 1];
      const botLeftFruit = fruits[id + gridWidth - 2];
      if (
        fruit.fruit == topLeftFruit.fruit &&
        fruit.fruit == botRightFruit.fruit
      ) {

        // If diagonal from left
        topLeftFruit.reset();
        fruit.reset();
        botRightFruit.reset();
        if(id) score++;
        drawFruit();

      } else if (
        fruit.fruit == topRightFruit.fruit &&
        fruit.fruit == botLeftFruit.fruit
      ) {

        // If diagonal from right
        topRightFruit.reset();
        fruit.reset();
        botLeftFruit.reset();
        if(id) score++;        
        drawFruit();

      }
      return;
    }

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

        // Skip checking start and end blocks of odd rows
        if (id && box && box.classList.contains('start') && box.classList.contains('odd')) return;
        if (id && box && box.classList.contains('end') && box.classList.contains('odd')) return;

        // If horizontal
        leftFruit.reset();
        fruit.reset();
        rightFruit.reset();
        if(id) score++;
        drawFruit();

      } else if (
        id - gridWidth + 2 > 0 && id + gridWidth - 1 > 0 &&
        fruit.fruit == topLeftFruit.fruit &&
        fruit.fruit == botRightFruit.fruit
      ) {

        // If end of even row, dont check diagonals
        // Else this checks it from the odd rows start
        if (id && box && box.classList.contains('end') && box.classList.contains('even')) return;

        // If diagonal from left
        topLeftFruit.reset();
        fruit.reset();
        botRightFruit.reset();
        if(id) score++;
        drawFruit();

      } else if (

        id - gridWidth + 1 > 0 && id + gridWidth - 2 > 0 &&
        fruit.fruit == topRightFruit.fruit &&
        fruit.fruit == botLeftFruit.fruit
      ) {

        // If end of even row, dont check diagonals
        // Else this checks it from the odd rows start
        if (id && box && box.classList.contains('end') && box.classList.contains('even')) return;

        // If diagonal from right
        topRightFruit.reset();
        fruit.reset();
        botLeftFruit.reset();
        if(id) score++;        
        drawFruit();

      }
    }
  }

  if(identifier) {
    return getAdj(identifier);
  }

  // For each fruit in center boxes
  for (let i = 0; i < boxes.length; i++) {
    getAdj(i);
  }
}

// Launch
init();
drawBoxes();
drawFruit();