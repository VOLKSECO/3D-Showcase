import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { config } from '../config.js';

export async function loadAppropriateModel(scene, camera, controls, modelName) {
  const objExists = await fileExists(`3D_models/${modelName}/scene.obj`);
  const mtlExists = await fileExists(`3D_models/${modelName}/scene.mtl`);
  const gltfExists = await fileExists(`3D_models/${modelName}/scene.gltf`);

  if (objExists && mtlExists) {
    return loadObjModel(scene, camera, controls, modelName);
  } else if (gltfExists) {
    return loadGltfModel(scene, camera, controls, modelName);
  } else {
    console.error('No valid model files found.');
    return null;
  }
}

function loadObjModel(scene, camera, controls, modelName) {
  const mtlLoader = new MTLLoader().setPath(`3D_models/${modelName}/`);
  return new Promise((resolve, reject) => {
    mtlLoader.load('scene.mtl', (materials) => {
      materials.preload();
      const objLoader = new OBJLoader().setPath(`3D_models/${modelName}/`);
      objLoader.setMaterials(materials);
      objLoader.load('scene.obj', (object) => {
        console.log('✅ OBJ model loaded');
        adjustModel(scene, object);
        resolve(object);
      }, undefined, (error) => reject(error));
    });
  });
}

function loadGltfModel(scene, camera, controls, modelName) {
  const loader = new GLTFLoader().setPath(`3D_models/${modelName}/`);
  return new Promise((resolve, reject) => {
    loader.load('scene.gltf', (gltf) => {
      console.log('✅ GLTF model loaded');
      adjustModel(scene, gltf.scene);
      resolve(gltf.scene);
    }, undefined, (error) => reject(error));
  });
}

function adjustModel(scene, model) {
  model.rotation.x = -Math.PI / 2;
  centerAndPositionModel(model);
  model.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}

function centerAndPositionModel(model) {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const podiumSize = config.podium.size;
  const maxModelSize = Math.max(size.x, size.z);
  const scaleFactor = (podiumSize * 1.2) / maxModelSize;

  model.scale.set(scaleFactor, scaleFactor, scaleFactor);
  const newBox = new THREE.Box3().setFromObject(model);
  const newCenter = newBox.getCenter(new THREE.Vector3());
  const newMinY = newBox.min.y;

  model.position.sub(newCenter);
  model.position.y = -newMinY + config.podium.height+.02;
}

async function fileExists(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}