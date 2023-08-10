import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js";
import { GUI } from "https://cdn.skypack.dev/dat.gui";

const fileUrl = new URL('../assets/Donkey.gltf', import.meta.url);

// BASIC RAW CODE-1
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 10, 10);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let controls = new OrbitControls(camera, renderer.domElement);

const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

const ambientLight = new THREE.AmbientLight(0xededed, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
scene.add(directionalLight);
directionalLight.position.set(10, 11, 7);

// CONTROLLERS
let gui = new GUI();
let options = {
  'Main': 0x2F3130,
  'Main light': 0x7C7C7C,
  'Main dark': 0x0A0A0A,
  'Hooves':0x0F0B0D,
  'Hair':0x0B0804,
  'Muzzle':0x0B0804,
  'Eye dark':0x020202,
  'Eye white': 0xBEBEBE
};

const gltfLoader = new GLTFLoader();
gltfLoader.load(fileUrl.href, function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    console.log(model.getObjectByName('Cube_1'));
    gui.addColor(options, 'Main').onChange(function(e){
      model.getObjectByName('Cube').material.color.setHex(e);
    });
    gui.addColor(options, 'Main light').onChange(function(e){
      model.getObjectByName('Cube_1').material.color.setHex(e);
    });
    gui.addColor(options, 'Main dark').onChange(function(e){
      model.getObjectByName('Cube_2').material.color.setHex(e);
    });
    gui.addColor(options, 'Hooves').onChange(function(e){
      model.getObjectByName('Cube_3').material.color.setHex(e);
    });
    gui.addColor(options, 'Hair').onChange(function(e){
      model.getObjectByName('Cube_4').material.color.setHex(e);
    });
    gui.addColor(options, 'Muzzle').onChange(function(e){
      model.getObjectByName('Cube_5').material.color.setHex(e);
    });
    gui.addColor(options, 'Eye dark').onChange(function(e){
      model.getObjectByName('Cube_6').material.color.setHex(e);
    });
    gui.addColor(options, 'Eye white').onChange(function(e){
      model.getObjectByName('Cube_7').material.color.setHex(e);
    });

}, undefined, function (error) {
    console.error(error);
});

// RENDER
function animate(time) {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});