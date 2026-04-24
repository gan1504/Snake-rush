const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const bestScoreEl = document.getElementById("bestScore");
const gameOverEl = document.getElementById("gameOver");
const finalScoreEl = document.getElementById("finalScore");

const grid = 20;
const tileCount = 20;

canvas.width = grid * tileCount;
canvas.height = grid * tileCount;

let snake;
let direction;
let nextDirection;
let food;
let score;
let bestScore = Number(localStorage.getItem("bestScore")) || 0;
let speed;
let loop;

bestScoreEl.textContent = bestScore;

function startGame() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];

  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  speed = 150;
  food = randomFood();

  scoreEl.textContent = score;
  gameOverEl.classList.add("hidden");

  clearInterval(loop);
  draw();
  loop = setInterval(gameLoop, speed);
}

function gameLoop() {
  direction = nextDirection;

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  const hitWall =
    head.x < 0 ||
    head.y < 0 ||
    head.x >= tileCount ||
    head.y >= tileCount;

  const hitSelf = snake.some(part => part.x === head.x && part.y === head.y);

  if (hitWall || hitSelf) {
    endGame();
    return;
  }

  snake.unshift(head);

  const ateFood = head.x === food.x && head.y === food.y;

  if (ateFood) {
    score += 1;
    scoreEl.textContent = score;
    food = randomFood();

    if (score % 5 === 0 && speed > 70) {
      speed -= 10;
      clearInterval(loop);
      loop = setInterval(gameLoop, speed);
    }
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ef4444";
  ctx.fillRect(food.x * grid, food.y * grid, grid - 2, grid - 2);

  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? "#84cc16" : "#22c55e";
    ctx.fillRect(part.x * grid, part.y * grid, grid - 2, grid - 2);
  });
}

function randomFood() {
  let newFood;

  do {
    newFood = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  } while (
    snake &&
    snake.some(part => part.x === newFood.x && part.y === newFood.y)
  );

  return newFood;
}

function endGame() {
  clearInterval(loop);

  finalScoreEl.textContent = score;

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
    bestScoreEl.textContent = bestScore;
  }

  gameOverEl.classList.remove("hidden");
}

function restartGame() {
  startGame();
}

let startX = 0;
let startY = 0;

canvas.addEventListener("touchstart", e => {
  e.preventDefault();
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
}, { passive: false });

canvas.addEventListener("touchend", e => {
  e.preventDefault();

  const dx = e.changedTouches[0].clientX - startX;
  const dy = e.changedTouches[0].clientY - startY;

  if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && direction.x !== -1) nextDirection = { x: 1, y: 0 };
    if (dx < 0 && direction.x !== 1) nextDirection = { x: -1, y: 0 };
  } else {
    if (dy > 0 && direction.y !== -1) nextDirection = { x: 0, y: 1 };
    if (dy < 0 && direction.y !== 1) nextDirection = { x: 0, y: -1 };
  }
}, { passive: false });

startGame();
