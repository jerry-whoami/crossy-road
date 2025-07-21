import * as THREE from "three";
import {
  position,
  movesQueue,
  stepCompleted,
} from "../components/player";
import { TILE_SIZE } from "../constants";

const moveClock = new THREE.Clock(false);

export function animatePlayer(player) {
  if (!movesQueue.length) return;

  if (!moveClock.running) moveClock.start();

  const stepTime = 0.2; // Seconds it takes to take a step
  const progress = Math.min(1, moveClock.getElapsedTime() / stepTime);

  setPosition(progress, player);
  setRotation(progress, player);

  // Once a step has ended
  if (progress >= 1) {
    stepCompleted();
    moveClock.stop();
  }
}

function setPosition(progress, player) {
  const startX = position.currentTile;
  const startY = position.currentRow;
  let endX = startX;
  let endY = startY;

  if (movesQueue[0] === "left") endX -= TILE_SIZE;
  if (movesQueue[0] === "right") endX += TILE_SIZE;
  if (movesQueue[0] === "forward") endY += TILE_SIZE;
  if (movesQueue[0] === "backward") endY -= TILE_SIZE;

  player.position.x = THREE.MathUtils.lerp(startX, endX, progress);
  player.position.y = THREE.MathUtils.lerp(startY, endY, progress);
  player.children[0].position.z = (Math.sin(progress * Math.PI) * 8) + 25;
}

function setRotation(progress, player) {
  let endRotation = 0;
  if (movesQueue[0] == "forward") endRotation = -Math.PI / 2;
  if (movesQueue[0] == "left") endRotation = Math.PI * 2;
  if (movesQueue[0] == "right") endRotation = -Math.PI;
  if (movesQueue[0] == "backward") endRotation = Math.PI / 2;

  player.children[0].rotation.y = THREE.MathUtils.lerp(
    player.children[0].rotation.y,
    endRotation,
    progress
  );
}
