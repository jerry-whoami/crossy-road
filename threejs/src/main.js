import * as THREE from "three";
import { Renderer } from "./components/renderer";
import { Camera } from "./components/camera";
import { initializePlayer, Player, queueMove } from "./components/player";
import { model as modelLoader } from "./components/model";
import { animatePlayer } from "./animations/player";
import { hitTest } from "./hit-test";
import "./style.css";

let mixer;

async function init() {
  const scene = new THREE.Scene();

  const model = await modelLoader.get();
  const vehicles = await modelLoader.vehicles();
  const animations = await modelLoader.animations();
  scene.add(model)

  const player = Player(model);
  scene.add(player);

  const camera = Camera();
  player.add(camera);

  const ambientLight = new THREE.AmbientLight();
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight();
  dirLight.position.set(100, 100, 200);
  player.add(dirLight);

  const renderer = Renderer();

  // Setup animation mixer
  mixer = new THREE.AnimationMixer(model);
  animations.forEach((clip) => {
    mixer.clipAction(clip).play();
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);

    animatePlayer(player);
    hitTest(player, vehicles)
    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(animate())

  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault(); // Avoid scrolling the page
      console.log("forward");
      queueMove("forward", player);
    } else if (event.key === "ArrowDown") {
      event.preventDefault(); // Avoid scrolling the page
      console.log("backward");
      queueMove("backward", player);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault(); // Avoid scrolling the page
      console.log("left");
      queueMove("left", player);
    } else if (event.key === "ArrowRight") {
      event.preventDefault(); // Avoid scrolling the page
      console.log("right");
      queueMove("right", player);
    }
  });

  document
    .querySelector("#retry")
    ?.addEventListener("click", () => {
      const resultDOM = document.getElementById("result-container");
      resultDOM.style.visibility = "hidden";

      initializePlayer(player);
    });
}

init().catch(console.error)
