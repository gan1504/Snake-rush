const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
let snake = [{ x: 200, y: 200 }];
let direction = { x: 1, y: 0 };
let food = { x: 100, y: 100 };
let score = 0;

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Snake
  ctx.fillStyle = "lime";
  snake.forEach(part => {
    ctx.fillRect(part.x, part.y, gridSize, gridSize);
  });

  // Food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function move() {
  const head = {
    x: snake[0].x + direction.x * gridSize,
    y: snake[0].y + direction.y * gridSize
  };

  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * 20) * gridSize,
      y: Math.floor(Math.random() * 20) * gridSize
    };
  } else {
    snake.pop();
  }
}

function gameLoop() {
  move();
  draw();
}

setInterval(gameLoop, 150);


// 📱 Swipe mobile (FIABLE)
let startX = 0;
let startY = 0;

canvas.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

canvas.addEventListener("touchend", e => {
  let dx = e.changedTouches[0].clientX - startX;
  let dy = e.changedTouches[0].clientY - startY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && direction.x !== -1) direction = { x: 1, y: 0 };
    else if (dx < 0 && direction.x !== 1) direction = { x: -1, y: 0 };
  } else {
    if (dy > 0 && direction.y !== -1) direction = { x: 0, y: 1 };
    else if (dy < 0 && direction.y !== 1) direction = { x: 0, y: -1 };
  }
});
