import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js";
import * as CANNON from 'https://cdn.skypack.dev/cannon-es';

// BASIC RAW CODE-1
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0 , 6, 6);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let controls = new OrbitControls(camera, renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
scene.add(directionalLight);
directionalLight.position.set(0,50,0);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height  = 1024;

// const helper = new THREE.AxesHelper(20);
// scene.add(helper);

// CANNON.Body / physics body
const world = new CANNON.World({gravity: new CANNON.Vec3(0, -9.81, 0)});

//ground
const planeGeo = new THREE.PlaneGeometry(10, 10);
const planeMat = new THREE.MeshStandardMaterial({
  color: 0xFFFFFF,
  side: THREE.DoubleSide,
});
const planeMesh = new THREE.Mesh(planeGeo, planeMat);
scene.add(planeMesh);
planeMesh.receiveShadow = true;

//physics in ground
const planePhyMat = new CANNON.Material();
const planeBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Box(new CANNON.Vec3(5, 5, 0.001)),
  Material: planePhyMat
});
planeBody.quaternion.setFromEuler(-Math.PI/2,0,0);
world.addBody(planeBody);

const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();

window.addEventListener('mousemove', function(e){
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  planeNormal.copy(camera.position).normalize();
  plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, intersectionPoint);
});

const meshes = [];
const bodies = [];

window.addEventListener('click', function(e){
  const sphereGeo = new THREE.SphereGeometry(0.125, 30, 30);
  const sphereMat = new THREE.MeshStandardMaterial({ 
    color:Math.random()*0xFFFFFF,
    metalness: 0,
    roughness: 0
  });
  const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(sphereMesh);
  // sphereMesh.position.copy(intersectionPoint);
  sphereMesh.castShadow = true;
  const spherePhysMat = new CANNON.Material();
  const sphereBody = new CANNON.Body({
    mass: 0.3,
    shape: new CANNON.Sphere(0.125),
    position: new CANNON.Vec3(intersectionPoint.x, intersectionPoint.y, intersectionPoint.z),
    material: spherePhysMat
  });
  world.addBody(sphereBody);

  const planeSphereContactMat = new CANNON.ContactMaterial(
    planePhyMat,
    spherePhysMat,
    {restitution: 0.3}
  );

  world.addContactMaterial(planeSphereContactMat);

  meshes.push(sphereMesh);
  bodies.push(sphereBody);
});

const timeStep = 1 / 60;

// RENDER
function animate() {
  requestAnimationFrame(animate);
  world.step(timeStep);

  planeMesh.position.copy(planeBody.position);
  planeMesh.quaternion.copy(planeBody.quaternion);

  for(let i = 0; i < meshes.length; i++){
    meshes[i].position.copy(bodies[i].position);
    meshes[i].quaternion.copy(bodies[i].quaternion);
  }

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});