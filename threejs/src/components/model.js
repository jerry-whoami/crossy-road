import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

export class Model {
  constructor() {
    this._model = null;
    this._animations = null;
    this._vehicles = null;
    this._obstacles = null;
  }

  async get() {
    return await this.load();
  }

  async vehicles() {
    if (!this._vehicles) await this.load();

    return this._vehicles;
  }

  async obstacles() {
    if (!this._obstacles) await this.load();

    return this._obstacles;
  }

  async animations() {
    if (!this._animations) await this.load();

    return this._animations;
  }

  async load() {
    if (this._model) return this._model;

    const loader = new GLTFLoader();

    return new Promise((resolve, reject) => {
      loader.load(
        "./models/scene.glb",
        (gltf) => {
          const model = gltf.scene;

          model.scale.set(8, 8, 8);
          model.position.y = 75;
          model.rotation.x = Math.PI / 2;

          this._animations = gltf.animations;

          this._vehicles = model.children.filter((child) => {
            const name = child.name.toLowerCase();
            if (name.includes('car') || name.includes('truck')) return true;

            return false;
          });

          this._obstacles = model.children.filter((child) => {
            const name = child.name.toLowerCase();
            if (name.includes('three')) return true;

            return false;
          });

          const group = new THREE.Group();
          group.add(model);

          this._model = group; // Cache the result
          resolve(this._model);
        },
        undefined,
        (error) => reject(error)
      );
    });
  }
}

export const model = new Model();
