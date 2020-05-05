//Render(draw) all images on screen
import { debounce } from 'throttle-debounce';
import { getAsset } from './assets';
import { getCurrentState } from './state';

const Constants = require('../shared/constants');

const { PLAYER_RADIUS, PLAYER_MAX_HP, MAP_SIZE, GOLD_RADIUS, HUT_RADIUS, HUT_MAX_HP} = Constants;

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
setCanvasDimensions();

function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
  // 800 in-game units of width.
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
}

window.addEventListener('resize', debounce(40, setCanvasDimensions));

//Primary function for the render class, list objects HERE:
//TODO Fort
//TODO Player
//TODO etc.
//TODO
//TODO
function render() {
  //Refer to the state for game update info
  const { me, others, golds, huts } = getCurrentState();
  if (!me) {
    return;
  }

  // Draw background
  renderBackground(me.x, me.y);

  // Draw boundaries
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_SIZE, MAP_SIZE);

  // Draw all players
  renderPlayer(me, me);
  others.forEach(renderPlayer.bind(null, me));

  // Draw all gold
  golds.forEach(renderGold.bind(null, me));

  // Draw all huts
  huts.forEach(renderHut.bind(null,me));

}

//Sample background
function renderBackground(x, y) {
  const backgroundX = MAP_SIZE / 2 - x + canvas.width / 2;
  const backgroundY = MAP_SIZE / 2 - y + canvas.height / 2;
  const backgroundGradient = context.createRadialGradient(
    backgroundX,
    backgroundY,
    MAP_SIZE / 10,
    backgroundX,
    backgroundY,
    MAP_SIZE / 2,
  );
  backgroundGradient.addColorStop(1, 'blue');
  backgroundGradient.addColorStop(0, 'cyan');
  context.fillStyle = backgroundGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

// (Sample) a ship at the given coordinates
function renderPlayer(me, player) {
  const { x, y, direction } = player;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;

  // Draw ship
  context.save();
  context.translate(canvasX, canvasY);
  context.rotate(direction);
  context.drawImage(
    getAsset('ship.svg'),
    -PLAYER_RADIUS,
    -PLAYER_RADIUS,
    PLAYER_RADIUS * 2,
    PLAYER_RADIUS * 2,
  );
  context.restore();

  // Draw health bar
  context.fillStyle = 'white';
  context.fillRect(
    canvasX - PLAYER_RADIUS,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2,
    2,
  );
  context.fillStyle = 'red';
  context.fillRect(
    canvasX - PLAYER_RADIUS + PLAYER_RADIUS * 2 * player.hp / PLAYER_MAX_HP,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2 * (1 - player.hp / PLAYER_MAX_HP),
    2,
  );
}

//Draw gold
function renderGold(me, gold) {
  const { x, y } = gold;
  context.drawImage(
    getAsset('bullet.svg'),
    canvas.width / 2 + x - me.x - GOLD_RADIUS,
    canvas.height / 2 + y - me.y - GOLD_RADIUS,
    GOLD_RADIUS * 2,
    GOLD_RADIUS * 2,
  );
}

//Draw hut (using player model)
function renderHut(me, hut) {
  const { x, y } = hut;
  context.drawImage(
    getAsset('ship.svg'),
    canvas.width / 2 + x - me.x - HUT_RADIUS,
    canvas.height / 2 + y - me.y - HUT_RADIUS,
    HUT_RADIUS * 2,
    HUT_RADIUS * 2,
  );
  // Draw hut health bar
  context.fillStyle = 'white';
  context.fillRect(
    canvas.width / 2 + x - me.x - HUT_RADIUS,
    canvas.height / 2 + y - me.y + HUT_RADIUS + 8,
    HUT_RADIUS * 2,
    2,
  );
  context.fillStyle = 'red';
  context.fillRect(
    canvas.width / 2 + x - me.x - HUT_RADIUS + HUT_RADIUS * 2 * hut.hp / HUT_MAX_HP,
    canvas.height / 2 + y - me.y + HUT_RADIUS + 8,
    HUT_RADIUS * 2 * (1 - hut.hp / HUT_MAX_HP),
    2,
  );
}

//(Sample) main menu
function renderMainMenu() {
  const t = Date.now() / 7500;
  const x = MAP_SIZE / 2 + 800 * Math.cos(t);
  const y = MAP_SIZE / 2 + 800 * Math.sin(t);
  renderBackground(x, y);
}

let renderInterval = setInterval(renderMainMenu, 1000 / 60);

// Replaces main menu rendering with game rendering.
export function startRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(render, 1000 / 60);
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(renderMainMenu, 1000 / 60);
}
