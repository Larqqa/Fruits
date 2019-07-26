const fruitsList = [
  '🍋','🍉','🍓','🍒','🍐','🥑','🍇'
];

class Fruit {
  constructor(x, y, val) {
    this.fruit = fruitsList[Math.floor(Math.random() * fruitsList.length)],
    //this.fruit = val
    this.x = x,
    this.y = y,
    this.active = false  
  }

  activeCheck = () => {
    if (this.active) {
      this.active = false;
    } else {
      this.active = true;
    }
  }

  reset = () => {
    this.fruit = fruitsList[Math.floor(Math.random() * fruitsList.length)];
  }
}