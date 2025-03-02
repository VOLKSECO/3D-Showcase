import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

export function loadModel(scene, camera, controls) {
  const groundSize = 10; // Taille du sol définie dans sceneSetup.js

  const mtlLoader = new MTLLoader().setPath('3D_model/');
  mtlLoader.load('scene.mtl', (materials) => {
    materials.preload();

    const objLoader = new OBJLoader().setPath('3D_model/');
    objLoader.setMaterials(materials);

    objLoader.load('scene.obj', (object) => {
      console.log('✅ Modèle OBJ chargé');

      // Activer les ombres
      object.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      // 🔹 Corriger l'orientation du modèle (rotation)
      
      object.rotation.x = -Math.PI / 2; // Rotation de 90° autour de l'axe X (si nécessaire)
      // Si l'objet est toujours couché, essayez une autre rotation comme object.rotation.y = Math.PI / 2;

      // 🔹 Ajuster la taille et poser le modèle sur le sol
      fitModelToGround(object, groundSize);

      // Ajouter à la scène
      scene.add(object);

      // Ajouter des arêtes noires autour du modèle
      addEdges(object);

      // Ajuster la caméra pour bien voir le modèle
      adjustCameraToModel(object, camera, controls, groundSize);

    }, (xhr) => {
      console.log(`🔄 Chargement OBJ : ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`);
    }, (error) => {
      console.error('❌ Erreur de chargement OBJ:', error);
    });
  }, (error) => {
    console.error('❌ Erreur de chargement MTL:', error);
  });
}

// 🔹 Fonction pour ajouter des arêtes autour du modèle
function addEdges(model) {
  // Créer la géométrie des arêtes
  const edgesGeometry = new THREE.EdgesGeometry(model.geometry);
  
  // Créer un matériau pour les arêtes (noir dans ce cas)
  const edgesMaterial = new THREE.LineBasicMaterial({
    color: 0x000000,  // Couleur des arêtes (noir)
    linewidth: 2,     // Épaisseur des lignes
  });

  // Créer un objet LineSegments pour les arêtes
  const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);

  // Ajouter les arêtes à chaque maillage du modèle
  model.add(edges);
}

// 🔹 Ajuster la taille du modèle et le poser sur le sol
function fitModelToGround(model, groundSize) {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());

  // Calcul du facteur d'échelle pour adapter au sol
  const maxModelSize = Math.max(size.x, size.z);
  const scaleFactor = groundSize * 0.08 / maxModelSize; // On garde une marge de 10%

  // Appliquer l'échelle uniformément
  model.scale.set(scaleFactor, scaleFactor, scaleFactor);

  // 🔹 Recalculer la boîte après redimensionnement
  const newBox = new THREE.Box3().setFromObject(model);
  const newMinY = newBox.min.y;

  // 🔹 Centrer et poser le modèle sur le sol
  model.position.sub(newBox.getCenter(new THREE.Vector3())); // Centrer l'objet
  model.position.y = -newMinY + 0.1; // Positionner sur le sol (ajustement Y)  
}

// 🔹 Ajuster la caméra pour bien voir le modèle
function adjustCameraToModel(model, camera, controls, groundSize) {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());

  const maxDim = Math.max(size.x, size.y, size.z);
  const distance = maxDim * 1.5; // 🔹 Ajustement pour un bon cadrage

  // Position de la caméra en fonction de la taille du modèle
  camera.position.set(0, size.y * 2, distance*1.5);
  camera.lookAt(0, size.y / 2, 0);

  // Mise à jour des contrôles pour centrer la scène
  controls.target.set(0, size.y / 2, 0);
  controls.update();
}
