import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function setupScene() {
  // Création de la scène
  const scene = new THREE.Scene();

  // Lumières
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
  directionalLight.position.set(5, 10, 5.5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Caméra
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.2, 1000);
  camera.position.set(3, 3, 3);
  camera.lookAt(0, 0, 0);

  // Contrôles
  const controls = new OrbitControls(camera, document.body);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 1;
  controls.maxDistance = 10;
  controls.minPolarAngle = 0.5;
  controls.maxPolarAngle = 1.5;
  controls.autoRotate = false;
  controls.target = new THREE.Vector3(0, 0.5, 0);
  controls.update();

  // ✅ Sol vert clair
  const groundGeometry = new THREE.PlaneGeometry(10, 10);
  groundGeometry.rotateX(-Math.PI / 2);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x4CA64C,
    side: THREE.DoubleSide
  });
  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);

  // Lumière Spot
  const spotLight = new THREE.SpotLight(0xffffff, 300, 50, 0.22, 1);
  spotLight.position.set(0, 15, 0);
  spotLight.castShadow = true;
  scene.add(spotLight);

  return { scene, camera, controls };
}
