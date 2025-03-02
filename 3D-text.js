import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// Fonction pour créer les textes avec un alignement vertical
export function createTextScene(scene) {
    const loader = new FontLoader();

    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        // Définir les couleurs, tailles, et positions des textes
        const textData = [
            { text: "threes.js", color: 0xffF000, size: 0.05, position: { x: -0.15, y: 0.0, z: .8 }, rotation: { x: -Math.PI / 2, y: 0 } },
            { text: "CAD to Web", color: 0x00ff00, size: 0.25, position: { x: -1, y: 0, z: -1 }, rotation: { x: -Math.PI / 2, y: 0 } },
            { text: "OBJ", color: 0x0000ff, size: 0.05, position: { x: -0.08, y: 0.05, z: .5 }, rotation: { x: -Math.PI / 2, y: 0 } }
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
