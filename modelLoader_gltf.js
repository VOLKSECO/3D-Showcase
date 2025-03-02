import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function loadModel(scene, camera, controls) {
  let currentModel = null; // Stocke le modèle actuel

  const loader = new GLTFLoader().setPath('3D_model/');
  loader.load('scene.gltf', (gltf) => {
    console.log('✅ Modèle GLTF chargé');
    const model = gltf.scene;
    currentModel = model;

    // Appliquer des propriétés aux maillages
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.envMapIntensity = 1;
          child.material.needsUpdate = true;
        }
      }
    });

    // 🔹 Centrer et ajuster la position du modèle
    centerAndPositionModel(model, camera, controls);

    // Ajouter à la scène
    scene.add(model);

  }, (xhr) => {
    console.log(`🔄 Chargement GLTF : ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`);
  }, (error) => {
    console.error('❌ Erreur de chargement GLTF:', error);
  });
}

// Fonction pour centrer et ajuster le modèle GLTF et la caméra
function centerAndPositionModel(model, camera, controls) {
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  const groundSize = 10; // Taille du sol définie dans sceneSetup.js
  const maxModelSize = Math.max(size.x, size.y, size.z); // Utilise la plus grande dimension du modèle
  const scaleFactor = (groundSize * 0.1) / maxModelSize; // Calculer l'échelle

  model.scale.set(scaleFactor, scaleFactor, scaleFactor); // Redimensionner le modèle

  // Recalculer la boîte après redimensionnement
  const newBox = new THREE.Box3().setFromObject(model);
  const newMinY = newBox.min.y;

  // 🔹 Centrer et poser le modèle sur le sol
  model.position.sub(center);
  model.position.y = -newMinY+.05; // Positionner le modèle sur le sol

  // 🔹 Ajuster la caméra pour un bon cadrage
  const maxDim = Math.max(newBox.getSize(new THREE.Vector3()).x, newBox.getSize(new THREE.Vector3()).y, newBox.getSize(new THREE.Vector3()).z);
  
  // Calculer la distance de la caméra en fonction de la plus grande dimension du modèle
  const fitHeightDistance = maxDim / (2 * Math.atan(Math.PI * camera.fov / 360)); // Distance verticale
  const fitWidthDistance = fitHeightDistance / camera.aspect; // Distance horizontale
  const distance = Math.max(fitHeightDistance, fitWidthDistance) * 1.5; // Assurer un espace suffisant autour du modèle

  const direction = new THREE.Vector3().subVectors(camera.position, center).normalize();
  camera.position.copy(center).add(direction.multiplyScalar(distance)); // Positionner la caméra en fonction de la taille de l'objet

  camera.lookAt(new THREE.Vector3(0, size.y / 2, 0)); // Regard de la caméra vers le centre du modèle
  controls.target.set(0, size.y / 2, 0); // Ajuster le point cible pour les contrôles
  controls.update(); // Mettre à jour les contrôles
}
