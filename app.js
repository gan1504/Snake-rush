const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";
let food = { x: 100, y: 100 };
let score = 0;

function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "lime";
  snake.forEach(part => ctx.fillRect(part.x, part.y, 20, 20));

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, 20, 20);
}

function move() {
  const head = { ...snake[0] };

  if (direction === "RIGHT") head.x += 20;
  if (direction === "LEFT") head.x -= 20;
  if (direction === "UP") head.y -= 20;
  if (direction === "DOWN") head.y += 20;

  snake.unshift(head);
  snake.pop();
}

function gameLoop() {
  move();
  draw();
}

setInterval(gameLoop, 150);

// Swipe controls
let startX, startY;

document.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

document.addEventListener("touchend", e => {
  let dx = e.changedTouches[0].clientX - startX;
  let dy = e.changedTouches[0].clientY - startY;

  if (Math.abs(dx) > Math.abs(dy)) {
    direction = dx > 0 ? "RIGHT" : "LEFT";
  } else {
    direction = dy > 0 ? "DOWN" : "UP";
  }
});
