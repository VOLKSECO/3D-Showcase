import * as THREE from 'three';
import { setupScene } from './scene/sceneSetup.js';
import { createButtons } from './scene/buttons/buttons.js';
import { createPodium } from './scene/podium/podium.js';
import { loadAppropriateModel } from './loader/loader.js';

const { scene, camera, controls } = setupScene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

createPodium(scene);
let buttonGroup = null;

let currentModel = null;

// Load the selected model and update buttons
export function loadSelectedModel(modelName, buttonLinks, buttonTexts) {
    console.log('Received in main.js:', buttonLinks, buttonTexts); // Verify data
    if (currentModel) {
        scene.remove(currentModel);
        currentModel = null;
    }
    if (buttonGroup) {
        scene.remove(buttonGroup);
        buttonGroup = null;
    }

    loadAppropriateModel(scene, camera, controls, modelName).then(loadedModel => {
        currentModel = loadedModel;
        scene.add(currentModel);
        currentModel.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        buttonGroup = createButtons(scene, camera, renderer, buttonLinks, buttonTexts);
        renderer.render(scene, camera);
    }).catch(error => {
        console.error("Error loading model:", error);
    });
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();