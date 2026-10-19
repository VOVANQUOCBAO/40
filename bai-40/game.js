const gameContainer = document.querySelector('#game-container');
const basket = document.querySelector('#basket');
const apple = document.querySelector('#apple');
const scoreDisplay = document.querySelector('#score');
const livesDisplay = document.querySelector('#lives');
const startButton = document.querySelector('#start-button');
const gameOverlay = document.querySelector('#game-overlay');
const gameMessage = document.querySelector('#game-message');
const leftButton = document.querySelector('#left-button');
const rightButton = document.querySelector('#right-button');

const GAME = {
  status: 'idle',
  score: 0,
  lives: 3,
  speed: 155,
  basketX: 0,
  appleX: 0,
  appleY: -48,
  frameId: null,
  previousTime: null,
  stepSize: 40,
};

const appleSize = () => apple.offsetWidth;
const basketWidth = () => basket.offsetWidth;
const frameWidth = () => gameContainer.clientWidth;
const frameHeight = () => gameContainer.clientHeight;
const basketTop = () => frameHeight() - 18 - basket.offsetHeight;

function drawPositions() {
  basket.style.left = `${GAME.basketX}px`;
  apple.style.left = `${GAME.appleX}px`;
  apple.style.top = `${GAME.appleY}px`;
}

function randomizeApple() {
  const maxX = Math.max(0, frameWidth() - appleSize());
  GAME.appleX = Math.random() * maxX;
  GAME.appleY = -appleSize();
  drawPositions();
}

function moveBasket(direction) {
  if (GAME.status === 'over') return;
  const maxX = Math.max(0, frameWidth() - basketWidth());
  GAME.basketX = Math.min(maxX, Math.max(0, GAME.basketX + direction * GAME.stepSize));
  basket.style.left = `${GAME.basketX}px`;
}

function resetGame() {
  if (GAME.frameId !== null) cancelAnimationFrame(GAME.frameId);
  GAME.status = 'running';
  GAME.score = 0;
  GAME.lives = 3;
  GAME.speed = 155;
  GAME.previousTime = null;
  GAME.basketX = Math.max(0, (frameWidth() - basketWidth()) / 2);
  scoreDisplay.textContent = String(GAME.score);
  livesDisplay.textContent = String(GAME.lives);
  gameMessage.textContent = 'Sẵn sàng chưa?';
  gameOverlay.hidden = true;
  apple.hidden = false;
  startButton.textContent = 'Chơi lại';
  randomizeApple();
  GAME.frameId = requestAnimationFrame(updateGame);
}

function finishGame() {
  GAME.status = 'over';
  GAME.frameId = null;
  GAME.previousTime = null;
  gameMessage.textContent = 'Game Over';
  gameOverlay.hidden = false;
  startButton.textContent = 'Chơi lại';
}

function overlapsBasket() {
  const appleRight = GAME.appleX + appleSize();
  const basketRight = GAME.basketX + basketWidth();
  const appleBottom = GAME.appleY + appleSize();
  const basketBottom = basketTop() + basket.offsetHeight;
  return appleRight > GAME.basketX && GAME.appleX < basketRight && appleBottom > basketTop() && GAME.appleY < basketBottom;
}

function updateGame(time) {
  if (GAME.status !== 'running') return;
  if (GAME.previousTime === null) GAME.previousTime = time;
  const seconds = Math.min((time - GAME.previousTime) / 1000, 0.04);
  GAME.previousTime = time;
  GAME.appleY += GAME.speed * seconds;

  if (overlapsBasket()) {
    GAME.score += 1;
    GAME.speed = Math.min(GAME.speed + 8, 520);
    scoreDisplay.textContent = String(GAME.score);
    randomizeApple();
  } else if (GAME.appleY + appleSize() >= frameHeight()) {
    GAME.lives -= 1;
    livesDisplay.textContent = String(GAME.lives);
    if (GAME.lives <= 0) {
      finishGame();
      return;
    }
    randomizeApple();
  } else {
    apple.style.top = `${GAME.appleY}px`;
  }

  GAME.frameId = requestAnimationFrame(updateGame);
}

startButton.addEventListener('click', resetGame);
leftButton.addEventListener('click', () => moveBasket(-1));
rightButton.addEventListener('click', () => moveBasket(1));

document.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  if (GAME.status !== 'running') return;
  event.preventDefault();
  moveBasket(event.key === 'ArrowLeft' ? -1 : 1);
});

window.addEventListener('resize', () => {
  const maxX = Math.max(0, frameWidth() - basketWidth());
  GAME.basketX = Math.min(maxX, GAME.basketX);
  if (GAME.appleX > frameWidth() - appleSize()) GAME.appleX = Math.max(0, frameWidth() - appleSize());
  drawPositions();
});

basket.style.left = `${Math.max(0, (frameWidth() - basketWidth()) / 2)}px`;
