This file will guide users on how to download, use, participate, and add models to your project.
markdown

# 3D Showcase

A dynamic 3D model viewer built with [Three.js](https://threejs.org/), featuring a podium with interactive buttons and a Markdown-driven model selection system. Easily showcase 3D models (OBJ or GLTF) with customizable descriptions and button links.

![Screenshot](https://github.com/VOLKSECO/3D-Showcase/blob/main/screenshot.png) <!-- Replace with an actual screenshot URL -->

## Features
- View 3D models on a podium with orbit controls.
- Three interactive buttons around the podium, each with custom text and links.
- Model selection via a dropdown, driven by a `models.md` file.
- Supports OBJ (with MTL) and GLTF model formats.
- Responsive design for various screen sizes.

## Demo
Try it live: [https://volkseco.github.io/3D-Showcase/]
## Installation

### Prerequisites
- A modern web browser (Brave, Firefox, Chrome, etc.).
- A local server (e.g., [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for VS Code or `npx http-server`).

### Steps to Download and Run
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/3D-Showcase.git
   cd 3D-Showcase

Serve the Project:
Option 1: Use VS Code with Live Server:
Open the folder in VS Code.

Right-click index.html and select "Open with Live Server".

Option 2: Use a simple HTTP server:
bash

npx http-server

Open http://127.0.0.1:8080 in your browser.

View the Showcase:
The page should load with the first model (e.g., "Stylo") displayed, along with its description and buttons.

Usage
Select a Model: Use the dropdown at the bottom to switch between models listed in 3D_models/models.md.

Interact with Buttons: Hover over or click the buttons around the podium to highlight them or open their links in a new tab.

Explore the Model: Use the mouse to rotate, zoom, and pan the 3D scene.

How to Participate
We welcome contributions! Here’s how you can get involved:
Fork the Repository:
Click "Fork" on GitHub to create your own copy.

Make Changes:
Add new features, fix bugs, or improve documentation.

Test locally using the steps above.

Submit a Pull Request:
Push your changes to your fork: git push origin your-branch.

Open a pull request on this repository with a description of your changes.

Issues:
Check the Issues tab for tasks or report bugs.

How to Add New Models
Adding a new model is simple and requires two steps:
Step 1: Add Model Files
Create a new folder in /3D_models/ named after your model (e.g., /3D_models/NewModel/).

Add your 3D model files:
For OBJ: Include scene.obj and scene.mtl (plus textures if needed).

For GLTF: Include scene.gltf and scene.bin (plus textures if needed).

Example structure:

/3D_models/NewModel/
├── scene.obj
└── scene.mtl

Step 2: Update models.md
Open /3D_models/models.md in a text editor.

Add a new section for your model with the following format:
markdown

# NewModel
- Model Description: A brief description of your model.
- Model Link 1: https://example.com/link1
- Model Link text 1: Button1Text
- Model Link 2: https://example.com/link2
- Model Link text 2: Button2Text
- Model Link 3: https://example.com/link3
- Model Link text 3: Button3Text

Example:
markdown

# Robot
- Model Description: A robotic arm model for industrial use.
- Model Link 1: https://example.com/plans.pdf
- Model Link text 1: Plans
- Model Link 2: https://example.com/guide.html
- Model Link text 2: Guide
- Model Link 3: https://example.com/parts.csv
- Model Link text 3: Parts

Save the file.

Step 3: Test
Reload the page in your browser.

The new model should appear in the dropdown, with its description at the top and button texts/links working as specified.

License
This project is licensed under the MIT License - see the LICENSE file for details.

Project Structure
```bash
/3D-Showcase
├── index.html          # Entry point with model selector
├── index.css           # Styles for layout and responsiveness
├── main.js             # Core logic for scene and model loading
├── config.js           # Configuration (colors, sizes)
├── /loader/
│   └── loader.js       # Loads OBJ or GLTF models
├── /scene/
│   ├── sceneSetup.js   # Sets up Three.js scene, camera, controls
│   ├── /buttons/
│   │   ├── buttons.js  # Creates interactive buttons
│   │   └── buttonsText.js  # Renders 3D text for buttons
│   └── /podium/
│       └── podium.js   # Creates the podium
├── /3D_models/
│   ├── models.md       # Model metadata in Markdown
│   └── /[ModelName]/   # Folders with model files
├── README.md           # This file
└── LICENSE             # License file (e.g., MIT)

