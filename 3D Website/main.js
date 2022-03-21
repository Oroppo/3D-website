import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render( scene, camera );

const geometry = new THREE.SphereGeometry(2, 32, 32)
const material = new THREE.MeshPhongMaterial({ color: 0x00FFFF});
const moon = new THREE.Mesh( geometry, material);

scene.add(moon)



const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,5,5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200,50);
scene.add (lightHelper, gridHelper)

function addStar(){
  const geometry = new THREE.SphereGeometry(0.25,24,24);
  const material = new THREE.MeshPhysicalMaterial({color: 0xffffff})
  const star = new THREE.Mesh(geometry, material);

  const [x,y,z] = Array(3).fill().map(()=>THREE.MathUtils.randFloatSpread(100));

  star.position.set(x,y,z);
  scene.add(star);
}
Array(200).fill().forEach(addStar);


const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

const planetTexture = new THREE.TextureLoader().load('planet.jpg');
const normalTexture = new THREE.TextureLoader().load('NormalMap.jpg');

const planet = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshPhongMaterial( {
    map: planetTexture,
    normalMap: normalTexture
  })
);

scene.add(planet);

planet.position.z = 20;
planet.position.x = -10;
planet.position.y = -4;
planet.rotation.x = 0.2353;
planet.attach(moon);




function moveCamera(){
  const t = document.body.getBoundingClientRect().top;

  camera.rotation.x = t * -0.0001;
  camera.rotation.y = t * -0.0002;
  camera.rotation.z = t * -0.0002;
}

document.body.onscroll = moveCamera;

function animate(){

  requestAnimationFrame(animate);
  planet.rotation.y += 0.01;
  moon.rotation.x += 0.01;
  moon.rotation.y += 0.005;
  moon.rotation.z += 0.01;

  //console.log(moon.getWorldPosition());

  renderer.render( scene, camera );

}

animate();


