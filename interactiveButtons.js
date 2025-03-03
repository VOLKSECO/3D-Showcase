import * as THREE from 'three';

export function createButtons(scene, camera, renderer) {
  const buttons = [];
  const buttonLinks = {
    "Bouton 1": "https://hub.antenna.ch/sites/default/files/2024-06/A036-STA-20244181%20A.0.pdf",
    "Bouton 2": "https://hub.antenna.ch/node/93",
    "Bouton 3": "https://volkseco.ch"
  };

  const radius = 1; // Rayon du cercle autour du centre de la scène
  const numberOfButtons = 3; // Nombre total de boutons
  const angleStep = (Math.PI * 2) / numberOfButtons; // Distribution angulaire des boutons

  const buttonColors = [
    0xffc000, // Jaune
    0x00b0f0, // Bleu
    0x92d050  // Vert
  ];

  // Crée les boutons en utilisant des cylindres (forme de bouton arcade)
  for (let i = 0; i < numberOfButtons; i++) {
    const name = `Bouton ${i + 1}`;
    const angle = i * angleStep; // Calculer l'angle pour chaque bouton

    const buttonGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 32); // Cylindre
    const buttonMaterial = new THREE.MeshStandardMaterial({ color: buttonColors[i] });
    const button = new THREE.Mesh(buttonGeometry, buttonMaterial);

    // Calculer la position circulaire pour chaque bouton
    button.position.set(
      radius * Math.cos(angle), // x = rayon * cos(angle)
      0,                        // y = hauteur du bouton (au niveau du sol)
      radius * Math.sin(angle)  // z = rayon * sin(angle)
    );

    button.name = name;
    button.originalScale = button.scale.clone();
    button.originalColor = button.material.color.clone();

    // Orienter le bouton vers le centre de la scène
    button.lookAt(new THREE.Vector3(0, 0, 0));

    // Activer l'ombrage pour chaque bouton
    button.castShadow = true; // Le bouton produit une ombre
    button.receiveShadow = true; // Le bouton reçoit des ombres

    // Ajouter une bounding box pour la détection de survol
    button.boundingBox = new THREE.Box3().setFromObject(button);

    scene.add(button);
    buttons.push(button);
  }

  // Crée une lumière directionnelle pour les ombres
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Lumière blanche
  directionalLight.position.set(5, 5, 5).normalize(); // Positionner la lumière
  directionalLight.castShadow = true; // La lumière peut projeter des ombres
  scene.add(directionalLight);

  // Créer un plan pour recevoir les ombres (le sol)
  const planeGeometry = new THREE.PlaneGeometry(100, 100); // Grand plan pour le sol
  const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2; // Rotation du plan pour qu'il soit horizontal
  plane.position.y = -0.1; // Légèrement au-dessous du niveau des boutons
  plane.receiveShadow = true; // Le sol reçoit des ombres
  scene.add(plane);

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
        clicked.material.color.set(0xffffff); // Changer la couleur en blanc
        clickedButton = clicked; // Sauvegarder le bouton cliqué
      }
      window.open(buttonLinks[clicked.name], '_blank'); // Ouvrir le lien
    }
  }

  // Ajouter les événements de souris
  renderer.domElement.addEventListener('mousemove', onMouseMove);
  renderer.domElement.addEventListener('click', onMouseClick);
}
