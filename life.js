'use strict';

function LifeGame(width, height) {
  this.width = width;
  this.height = height;
  this.tickTime = 100;
  this.symbols = [' ', '.', '+', 'o', 'O', '*'];
  this.reset();
}

LifeGame.prototype.reset = function() {
  this.grid = [];
  for (let i=0; i<this.height; i++) {
    let row = [];
    for (let j=0; j<this.width; j++) {
      row.push(Math.floor(Math.random()*2));
    }
    this.grid.push(row);
  }
}

LifeGame.prototype.draw = function() {
  console.log('\u001b[2J\u001b[0;0H');   // clear the screen
  let self = this;
  for (let i=0; i<this.height; i++) {
    console.log(this.grid[i].map(function(cell) {
      return self.symbols[Math.min(cell, self.symbols.length-1)];
    }).join(' '));
  }
}

LifeGame.prototype.tick = function() {
  let newArr = [];
  for (let i=0; i<this.height; i++) {
    newArr[i] = [];
    for (let j=0; j<this.width; j++) {
      let num = this.numNeighbors(j, i);
      if (num < 2 || num > 3) {
        newArr[i].push(0);
      }
      else if (num === 3) {
        newArr[i].push(this.grid[i][j]+1);
      }
      else {
        newArr[i].push((this.grid[i][j] === 0)?0:this.grid[i][j]+1);
      }
    }
  }
  this.grid = newArr;
}

LifeGame.prototype.numNeighbors = function(x, y) {
  let count = 0;
  for (let i=-1; i<=1; i++) {
    for (let j=-1; j<=1; j++) {
      if (i === 0 && j === 0) {
        continue;
      }

      let newX = x+i;
      let newY = y+j;
      if (newX < 0) {
        newX = this.width-1;
      }
      if (newY < 0) {
        newY = this.height-1;
      }
      if (newX >= this.width) {
        newX = 0;
      }
      if (newY >= this.height) {
        newY = 0;
      }
      if (this.grid[newY][newX] > 0) {
        count++;
      }
    }
  }
  return count;
}

LifeGame.prototype.run = function() {
  let self = this;
  setInterval(function() {
    self.tick();
    self.draw();
  }, this.tickTime)
}

var game = new LifeGame(process.argv[2] || 60, process.argv[3] || 40);
game.run();

var stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');
stdin.on('data', function(key) {
  if (key === ' ') {
    game.reset();
  }
  else {
    process.exit();
  }
});
