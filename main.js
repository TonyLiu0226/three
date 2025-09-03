import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = true;
controls.enableZoom = true;
controls.enablePan = true;


let images = ['flyover', 'bigleaf', 'invoke', 'boardspace', 'netint']
let positions = [0, (Math.PI / 3 * 2), (Math.PI / 3 * 4)]

const circleRadius = 50;
const dataRadius = 4;


const ring = new THREE.Mesh(
    new THREE.RingGeometry(circleRadius - 2, circleRadius, 32),
    new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        side: THREE.DoubleSide, 
        transparent: false, 
        opacity: 1.0,
        wireframe: false,
        depthTest: false // Disable depth testing to respect renderOrder
    })
);

// Rotate the circle to lay flat on the XY plane
ring.rotation.x = Math.PI / 2;
ring.position.y = -0.1;
ring.renderOrder = 0; // Ring should render first (background)


scene.add(ring);

for (let i = 0; i < positions.length; i++) {
    const textureloader = new THREE.TextureLoader();
    const texture = textureloader.load(`${images[i]}.jpg`);
    const dataPoint = new THREE.Mesh(
        new THREE.CircleGeometry(dataRadius, 32),
        new THREE.MeshBasicMaterial({
            map: texture,  
            side: THREE.DoubleSide, 
            transparent: false, 
            opacity: 1.0,
            wireframe: false,
            depthTest: false // Disable depth testing to respect renderOrder
        })
    );
    dataPoint.position.x = Math.sin(positions[i]) * circleRadius;
    dataPoint.position.z = Math.cos(positions[i]) * circleRadius;
    dataPoint.position.y = 1;

    dataPoint.rotation.x = Math.PI / 2;
    dataPoint.renderOrder = 1; // Data points should render on top
    scene.add(dataPoint);
}


// Set camera position so we can see the circle
camera.position.set(0, -10, 0);
camera.lookAt(0, 0, 50);

function animate() {
    controls.update(); // Update controls
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();