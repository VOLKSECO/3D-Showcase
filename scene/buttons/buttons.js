import * as THREE from 'three';
import { createTextButtons } from './buttonsText.js';
import { config } from '../../config.js';

export function createButtons(scene, camera, renderer, buttonLinks, buttonTexts) {
    const buttonGroup = new THREE.Group();
    const buttons = [];
    const numberOfButtons = config.buttons.number;
    const radius = (config.podium.size - config.buttons.size) * 0.85;
    const angleStep = (Math.PI * 2) / numberOfButtons;

    for (let i = 0; i < numberOfButtons; i++) {
        const name = `Button ${i + 1}`;
        const angle = i * angleStep;

        const buttonGeometry = new THREE.CylinderGeometry(config.buttons.size, config.buttons.size + 0.015, 0.04, 32);
        const buttonMaterial = new THREE.MeshStandardMaterial({ color: config.buttons.colors[i] });
        const button = new THREE.Mesh(buttonGeometry, buttonMaterial);

        button.position.set(radius * Math.cos(angle), config.podium.height, radius * Math.sin(angle));
        button.name = name;
        button.originalScale = button.scale.clone();
        button.originalColor = button.material.color.clone();
        button.lookAt(new THREE.Vector3(0, config.podium.height, 0));
        button.castShadow = true;
        button.receiveShadow = true;
        button.boundingBox = new THREE.Box3().setFromObject(button);

        buttonGroup.add(button);
        buttons.push(button);
    }

    createTextButtons(buttonGroup, numberOfButtons, radius, buttonTexts);
    scene.add(buttonGroup);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredButton = null;
    let clickedButton = null;

    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(buttons);

        let foundButton = intersects.find(i => i.object.boundingBox.containsPoint(i.point))?.object;
        if (foundButton && foundButton !== clickedButton) {
            if (hoveredButton !== foundButton) {
                if (hoveredButton) resetButton(hoveredButton);
                highlightButton(foundButton);
                hoveredButton = foundButton;
            }
        } else if (!foundButton && hoveredButton) {
            resetButton(hoveredButton);
            hoveredButton = null;
        }
    }

    function highlightButton(button) {
        button.material.color.set(0xfff000);
        button.scale.set(1.05, 1.05, 1.05);
    }

    function resetButton(button) {
        if (button !== clickedButton) {
            button.material.color.copy(button.originalColor);
            button.scale.copy(button.originalScale);
        }
    }

    function onMouseClick(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(buttons);

        let clicked = intersects.find(i => i.object.boundingBox.containsPoint(i.point))?.object;
        if (clicked && buttonLinks[clicked.name.split(' ')[1] - 1]) {
            if (clicked !== clickedButton) {
                if (clickedButton) resetButton(clickedButton);
                clicked.material.color.set(0xffffff);
                clickedButton = clicked;
            }
            window.open(buttonLinks[clicked.name.split(' ')[1] - 1], '_blank');
        }
    }

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onMouseClick);

    return buttonGroup;
}