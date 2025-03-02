import * as THREE from 'three';
import { setupScene } from './sceneSetup.js';
import { createButtons } from './interactiveButtons.js';
import { createPodium } from './podium.js'; // Importation de la fonction pour créer le podium

// Configuration de la scène, caméra et contrôles
const { scene, camera, controls } = setupScene();

// Création du rendu
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Fonction pour vérifier l'existence d'un fichier
async function fileExists(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Erreur lors de la vérification du fichier :', error);
    return false;
  }
}

// Ajouter les boutons interactifs à la scène
createButtons(scene, camera, renderer); // Ajout de la fonction de création de boutons

// Création du podium indépendamment du modèle
createPodium(scene); // Ajout du podium à la scène sans dépendance du modèle

import { createTextScene } from './3D-text.js';  // Importation de la fonction de création du texte

// Créer les textes dans la scène
createTextScene(scene);

// Fonction pour choisir et charger le modèle approprié (OBJ ou GLTF)
async function loadAppropriateModel() {
  const objExists = await fileExists('3D_model/scene.obj');
  const mtlExists = await fileExists('3D_model/scene.mtl');
  const gltfExists = await fileExists('3D_model/scene.gltf');

  let model = null;

  if (objExists && mtlExists) {
    console.log('Chargement du modèle OBJ...');
    import('./modelLoader_obj.js').then(({ loadModel }) => {
      model = loadModel(scene, camera, controls);
    }).catch((err) => {
      console.error('Erreur lors du chargement du modèle OBJ:', err);
    });
  } else if (gltfExists) {
    console.log('Chargement du modèle GLTF...');
    import('./modelLoader_gltf.js').then(({ loadModel }) => {
      model = loadModel(scene, camera, controls);
    }).catch((err) => {
      console.error('Erreur lors du chargement du modèle GLTF:', err);
    });
  } else {
    console.log('Aucun modèle disponible à charger.');
  }
}

// Charger le bon modèle au démarrage
loadAppropriateModel();

// Ajustement de la taille de la fenêtre (optimisé pour ne pas trop appeler la fonction)
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, 100); // 100ms de délai pour limiter les appels
});

// Animation et rendu en continu
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// Lancer l'animation
animate();
