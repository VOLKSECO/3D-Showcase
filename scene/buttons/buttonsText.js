import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { config } from '../../config.js';

export function createTextButtons(group, numberOfButtons, radius, buttonTexts) {
    const loader = new FontLoader();
    loader.load(
        'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
        (font) => {
            const angleStep = (Math.PI * 2) / numberOfButtons;
            const textRadius = radius + config.buttons.size * 2;

            for (let i = 0; i < numberOfButtons; i++) {
                const angle = i * angleStep;
                const text = buttonTexts[i] || `Link ${i + 1}`; // Fallback if undefined
                console.log(`Button ${i + 1} text:`, text); // Verify text

                const textGeometry = new TextGeometry(text, {
                    font: font,
                    size: config.text.size,
                    depth: 0.005,
                    curveSegments: 6,
                    bevelEnabled: false
                });

                textGeometry.computeBoundingBox();
                const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
                textGeometry.translate(-textWidth / 2, 0, 0);

                const textMaterial = new THREE.MeshStandardMaterial({ color: config.buttons.colors[i] });
                const textMesh = new THREE.Mesh(textGeometry, textMaterial);

                textMesh.position.set(
                    textRadius * Math.cos(angle),
                    config.podium.height,
                    textRadius * Math.sin(angle)
                );
                textMesh.rotation.set(-Math.PI / 2, 0, Math.PI / 2 - angleStep * i);

                group.add(textMesh);
            }
        },
        undefined,
        (error) => console.error('Error loading font:', error)
    );
}