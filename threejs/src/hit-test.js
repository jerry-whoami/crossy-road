import * as THREE from "three";

const resultDOM = document.getElementById("result-container");

export function hitTest(player, vehicles) {
  // Get bounding box of the player at the new position
  const playerBox = new THREE.Box3().setFromObject(player);

  for (const vehicle of vehicles) {
    if (!vehicle) continue;

    const vehicleBox = new THREE.Box3().setFromObject(vehicle);

    if (playerBox.intersectsBox(vehicleBox)) {
      resultDOM.style.visibility = "visible";
      return true;
    }
  }

  return false;
}
