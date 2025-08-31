import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false;
controls.enableZoom = false;
controls.enablePan = false;


let images = ['flyover', 'bigleaf', 'invoke', 'boardspace', 'netint']
let yRotations = [0, 120, 240, 120, 0]
let zRotations = [0, 0, 0, 0, 180]

for (let i = 0; i < images.length; i++) {
    loadImage(images[i], i);
}

camera.position.z = 5;

let currentStep = 0;
let stepTimer = 0;
const stepDuration = 120; // 60 frames = 1 second at 60fps

function animate() {
    stepTimer++;
    if (stepTimer >= stepDuration && currentStep < 6) {
        currentStep++;
        changeScene(currentStep);
        stepTimer = 0;
    }
    
    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );


function loadImage(item, i) {
    const loader = new THREE.TextureLoader();
    loader.load(    
        `${item}.jpg`, // URL or path to your image
        function (texture) {
            // Image loaded successfully, now create a material and apply it
            const material = new THREE.MeshBasicMaterial({ map: texture });
            const geometry = new THREE.PlaneGeometry(1, 1); // Example: a simple plane
            const mesh = new THREE.Mesh(geometry, material);
            
            // Position the mesh in a circle around the camera
            const radius = 3; // Distance from center
            const angle = (yRotations[i] * Math.PI) / 180; // Convert to radians
            
            mesh.position.z = Math.sin(angle) * radius;
            mesh.position.x = Math.cos(angle) * radius; // Offset by camera position
            
            // Rotate the mesh to face the camera
            mesh.rotation.y = -angle; // Face inward toward center
            
            scene.add(mesh);
        },
        undefined, // onProgress callback (optional)
        function (err) {
            console.error('An error occurred loading the image:', err);
        }
    );
}

function changeScene(step) {
    const radius = 5; // Distance to keep camera from center (same as original camera.position.z)
    
    switch (step) {
        case 1:
            // Move to position corresponding to first image (0°)
            camera.position.set(0, 0, radius);
            controls.target.set(0, 0, 0);
            controls.update();
            break;
        case 2:
            // Move to position corresponding to second image (120°)
            const angle2 = (120 * Math.PI) / 180;
            camera.position.set(-Math.cos(angle2) * radius, 0, -Math.sin(angle2) * radius);
            controls.target.set(0, 0, 0);
            controls.update();
            break;
        case 3:
            // Move to position corresponding to third image (240°)
            const angle3 = (240 * Math.PI) / 180;
            camera.position.set(-Math.cos(angle3) * radius, 0, -Math.sin(angle3) * radius);
            controls.target.set(0, 0, 0);
            controls.update();
            break;
        case 4:
            // Back to second image position (120°)
            const angle4 = (120 * Math.PI) / 180;
            camera.position.set(-Math.cos(angle4) * radius, 0, -Math.sin(angle4) * radius);
            controls.target.set(0, 0, 0);
            controls.update();
            break;
        case 5:
            // Back to first image position (0°)
            camera.position.set(0, 0, radius);
            controls.target.set(0, 0, 0);
            controls.update();
            break;
        case 6:
            // Add some height for final position
            camera.position.set(0, 2, radius);
            controls.target.set(0, 0, 0);
            controls.update();
            break;
    }
}