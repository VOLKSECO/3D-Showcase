import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { config } from '../config.js';

export function setupScene() {
    const scene = new THREE.Scene();
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.2, 1000);
    camera.position.set(3, 3, 3);
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, document.body);
    controls.enableDamping = true;
    controls.enablePan = true;
    controls.minDistance = 0.1;
    controls.maxDistance = 10;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI / 2.75;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.25;
    controls.target = new THREE.Vector3(0, 0.5, 0);
    controls.update();

    const groundGeometry = new THREE.PlaneGeometry(1200, 1200);
    groundGeometry.rotateX(-Math.PI / 2);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: config.ground.color,
        side: THREE.DoubleSide
    });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    return { scene, camera, controls };
}