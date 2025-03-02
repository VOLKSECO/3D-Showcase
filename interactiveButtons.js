import * as THREE from 'three';

export function createButtons(scene, camera, renderer) {
  const buttons = [];
  const buttonLinks = {
    "Bouton 1": "https://volkseco.ch",
    "Bouton 2": "https://volkseco.ch",
    "Bouton 3": "https://volkseco.ch",
    "Bouton 4": "https://volkseco.ch"
  };

  const radius = 0.8; // Rayon autour du centre de la scène pour les boutons
  const positions = [
    { name: "Bouton 1", angle: Math.PI / 4 },
    { name: "Bouton 2", angle: Math.PI / 4 * 3 },
    { name: "Bouton 3", angle: Math.PI / 4 * 5 },
    { name: "Bouton 4", angle: Math.PI / 4 * 7 }
  ];

  // Crée les boutons en utilisant des positions circulaires
  positions.forEach(({ name, angle }) => {
    const buttonGeometry = new THREE.BoxGeometry(0.4, 0.025, 0.2);
    const buttonMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const button = new THREE.Mesh(buttonGeometry, buttonMaterial);

    // Calculer la position circulaire pour chaque bouton
    button.position.set(
      radius * Math.cos(angle), // x = rayon * cos(angle)
      0,                     // y = hauteur du bouton
      radius * Math.sin(angle)  // z = rayon * sin(angle)
    );

    button.name = name;
    button.originalScale = button.scale.clone();
    button.originalColor = button.material.color.clone();

    // Orienter le bouton vers le centre de la scène
    button.lookAt(new THREE.Vector3(0, 0, 0));

    // Ajouter une bounding box pour la détection de survol
    button.boundingBox = new THREE.Box3().setFromObject(button);

    scene.add(button);
    buttons.push(button);
  });

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hoveredButton = null;
  let clickedButton = null;

  // Fonction de détection de survol de la souris
  function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(buttons, false);

    let foundButton = null;
    intersects.forEach((intersect) => {
      const button = intersect.object;
      if (button.boundingBox.containsPoint(intersect.point)) {
        foundButton = button;
      }
    });

    if (foundButton && foundButton !== clickedButton) {
      if (hoveredButton !== foundButton) {
        if (hoveredButton) {
          resetButton(hoveredButton);
        }
        highlightButton(foundButton);
        hoveredButton = foundButton;
      }
    } else if (!foundButton && hoveredButton) {
      resetButton(hoveredButton);
      hoveredButton = null;
    }
  }

  // Fonction pour surligner un bouton au survol
  function highlightButton(button) {
    button.material.color.set(0xfff000); // Change couleur au survol (jaune)
    button.scale.set(1.05, 1.05, 1.05);    // Agrandir légèrement le bouton
  }

  // Réinitialiser la couleur et la taille d'un bouton
  function resetButton(button) {
    if (button !== clickedButton) {
      button.material.color.copy(button.originalColor); // Réinitialiser la couleur
      button.scale.copy(button.originalScale);          // Réinitialiser la taille
    }
  }

  // Fonction pour gérer le clic sur un bouton
  function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(buttons, false);

    let clicked = null;
    intersects.forEach((intersect) => {
      const button = intersect.object;
      if (button.boundingBox.containsPoint(intersect.point)) {
        clicked = button;
      }
    });

    if (clicked && buttonLinks[clicked.name]) {
      if (clicked !== clickedButton) {
        // Marquer le bouton comme cliqué et le changer en bleu
        if (clickedButton) {
          resetButton(clickedButton); // Réinitialiser l'ancien bouton cliqué
        }
        clicked.material.color.set(0x0000ff); // Changer la couleur en bleu
        clickedButton = clicked; // Sauvegarder le bouton cliqué
      }
      window.open(buttonLinks[clicked.name], '_blank'); // Ouvrir le lien
    }
  }

  // Ajouter les événements de souris
  renderer.domElement.addEventListener('mousemove', onMouseMove);
  renderer.domElement.addEventListener('click', onMouseClick);
}
