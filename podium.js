import * as THREE from 'three';

export function createPodium(scene, model) {
  let radius = 0.6;  // Rayon par défaut
  let height = 0.05; // Hauteur du podium

  if (model) {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const groundSize = Math.max(size.x, size.z);
    const diameter = groundSize * 0.11;
    radius = diameter / 2;
    height = 0.5;
  }

  // Création de la géométrie du podium
  const podiumGeometry = new THREE.CylinderGeometry(radius, radius, height, 32);

  // Matériau du podium avec une légère lumière émissive
  const podiumMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,           // Couleur du podium
    roughness: 0.4,            // Matériau légèrement rugueux pour simuler une lumière douce
    metalness: 0.1             // Matériau avec un faible effet métallique
  });

  // Création du mesh du podium
  const podium = new THREE.Mesh(podiumGeometry, podiumMaterial);
  podium.position.set(0, height / 2, 0);  // Positionner le podium au sol

  // Ajout du podium à la scène
  scene.add(podium);
}
