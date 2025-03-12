import * as THREE from 'three';
import { config } from '../../config.js';

export function createPodium(scene) {
    const radius = config.podium.size;
    const height = config.podium.height;
    const color = config.podium.color;

    const spotLight = new THREE.SpotLight(0xffffff, 300, 50, 0.22, 1);
    spotLight.position.set(0, 15, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);

    const podiumGeometry = new THREE.CylinderGeometry(radius, radius + 0.06, height, 32);

    const podiumMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.1,
        metalness: 0.0
    });

    const podium = new THREE.Mesh(podiumGeometry, podiumMaterial);
    podium.position.set(0, height / 2, 0);

    podium.castShadow = true;
    podium.receiveShadow = true;

    scene.add(podium);
}