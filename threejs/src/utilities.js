import { TILE_SIZE } from "./constants";
import * as THREE from "three";

export function calculateFinalPosition(currentPosition, moves) {
  return moves.reduce((position, direction) => {
    if (direction === "forward")
      return {
        x: position.tileIndex,
        y: position.rowIndex + TILE_SIZE,
      };
    if (direction === "backward")
      return {
        x: position.tileIndex,
        y: position.rowIndex - TILE_SIZE,
      };
    if (direction === "left")
      return {
        x: position.tileIndex - TILE_SIZE,
        y: position.rowIndex,
      };
    if (direction === "right")
      return {
        x: position.tileIndex + TILE_SIZE,
        y: position.rowIndex,
      };
    return position;
  }, currentPosition);
}

export function endsUpInValidPosition(model, player, obstacles, currentPosition, moves) {
  // Calculate where the player would end up after the move
  const position = calculateFinalPosition(
    currentPosition,
    moves
  );

  // Detect if we hit the edge of the board
  const limits = calculateBoardLimits(model);
  if (
    position.x < limits.minTile ||
    position.x > limits.maxTile ||
    position.y < limits.minRow ||
    position.y > limits.maxRow
  ) {
    // Invalid move, ignore move command
    return false;
  }

  if (isTileBlocked(obstacles, player, position)) return false;

  return true;
}

export function calculateBoardLimits(model) {
  const board = model.getObjectByName("Plano-completo")

  const box = new THREE.Box3().setFromObject(board);
  const size = new THREE.Vector3();
  box.getSize(size);
  const center = new THREE.Vector3();
  box.getCenter(center);

  const min = box.min;
  const max = box.max;

  const boardLimits = {
    minTile: min.x,
    maxTile: max.x,
    minRow: min.y,
    maxRow: max.y
  };

  return boardLimits;
}

export function isTileBlocked(obstacles, player, position) {
  const tempPlayer = player.clone();
  tempPlayer.position.x = position.x
  tempPlayer.position.y = position.y

  const playerBox = new THREE.Box3().setFromObject(tempPlayer);
  return obstacles.some((item) => {
    const obstacleBox = new THREE.Box3().setFromObject(item);
    return playerBox.intersectsBox(obstacleBox);
  });
}

export function worldToGrid(position) {
  return {
    x: Math.round(position.x / TILE_SIZE),
    y: Math.round(position.y / TILE_SIZE),
  };
}
