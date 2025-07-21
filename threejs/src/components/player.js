import * as THREE from "three";
import { endsUpInValidPosition } from "../utilities";
import { model } from "./model";
import { TILE_SIZE } from "../constants";

export const position = {
  currentRow: 110,
  currentTile: 0,
};

export function Player(model) {
  const player = model.getObjectByName('Body');

  player.position.z = 25;
  player.scale.set(25, 25, 25);
  player.rotation.x = Math.PI / 2
  player.rotation.y = -Math.PI / 2

  const playerContainer = new THREE.Group();
  playerContainer.add(player);
  playerContainer.position.x = 0;
  playerContainer.position.y = 110;

  return playerContainer;
}

export const movesQueue = [];

export async function queueMove(direction, player) {
  const isValidMove = endsUpInValidPosition(
    await model.get(),
    player,
    await model.obstacles(),
    {
      rowIndex: position.currentRow,
      tileIndex: position.currentTile,
    },
    [...movesQueue, direction]
  );

  if (!isValidMove) return;

  movesQueue.push(direction);
}

export function stepCompleted() {
  const direction = movesQueue.shift();

  if (direction === "forward") position.currentRow += TILE_SIZE;
  if (direction === "backward") position.currentRow -= TILE_SIZE;
  if (direction === "left") position.currentTile -= TILE_SIZE;
  if (direction === "right") position.currentTile += TILE_SIZE;
}

export function initializePlayer(player) {
  position.currentTile = 0;
  position.currentRow = 110;

  player.position.x = 0;
  player.position.y = 110;
  player.children[0].rotation.y = -Math.PI / 2
  player.children[0].position.z = 25;

  movesQueue.length = 0;
}
