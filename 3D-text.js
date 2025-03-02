import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// Fonction pour créer les textes avec un alignement vertical
export function createTextScene(scene) {
    const loader = new FontLoader();

    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        // Définir les couleurs, tailles, et positions des textes
        const textData = [
            { text: "Plans", color: 0xffc000, size: 0.05, position: { x: 1.2, y: 0.0, z: .01 }, rotation: { x: -Math.PI / 2, y: 0 } },
            { text: "Infos", color: 0x92d050, size: 0.05, position: { x: -.3, y: 0, z: -.85 }, rotation: { x: -Math.PI / 2, y: 0 } },
            { text: "Guide", color: 0x00b0f0, size: 0.05, position: { x: -0.3, y: 0.00, z: .9 }, rotation: { x: -Math.PI / 2, y: 0 } }
        ];

        // Création des textes
        textData.forEach(data => {
            // Création de la géométrie du texte
            const textGeometry = new TextGeometry(data.text, {
                font: font,
                size: data.size,      // Taille du texte
                height: 0.01,         // Épaisseur du texte
                curveSegments: 6,
                bevelEnabled: false
            });

            // Création du matériau pour chaque texte
            const textMaterial = new THREE.MeshStandardMaterial({ color: data.color });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);

            // Positionnement des textes sur le sol en alignement à gauche
            textMesh.position.set(data.position.x, data.position.y, data.position.z);

            // Application de la rotation pour être à l'horizontale
            textMesh.rotation.set(data.rotation.x, data.rotation.y, 0);

            // Ajouter le texte à la scène
            scene.add(textMesh);
        });
    });
}
