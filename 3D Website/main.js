import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

import vertexShader from './Shaders/Vertex.glsl';
import fragmentShader from './Shaders/Fragment.glsl';

console.log(vertexShader);

const scene = new THREE.Scene();

const gui = new dat.GUI();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 2000 );

const renderer = new THREE.WebGLRenderer({
 canvas: document.querySelector('canvas'),
})

renderer.setPixelRatio(window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);
//document.body.appendChild(renderer,domElement)
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

//const lightHelper = new THREE.PointLightHelper(pointLight)
//const gridHelper = new THREE.GridHelper(200,50);
//scene.add (lightHelper, gridHelper)

const cameraFolder = gui.addFolder('Camera')

cameraFolder.add(camera.position,'x')
cameraFolder.add(camera.position,'y',-30,30,0.01)
cameraFolder.add(camera.position,'z',-30,30,0.01)

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

const planetTexture = new THREE.TextureLoader().load('Earth.jpg');
const normalTexture = new THREE.TextureLoader().load('NormalMap.jpg');

const planet = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.ShaderMaterial( {
    vertexShader,
    fragmentShader,
    uniforms:{
      earthTexture:{
        value: planetTexture
      }
    }
  // map: planetTexture,
  //  normalMap: normalTexture
  })
);

scene.add(planet);

planet.position.z = 20;
planet.position.x = -10;
planet.position.y = -4;
planet.rotation.x = 0.2353;
planet.attach(moon);



/*
function moveCamera(){
  const t = document.body.getBoundingClientRect().top;
  
  camera.rotation.x = t * -0.0001;
  camera.rotation.y = t * -0.0002;
  camera.rotation.z = t * -0.0002;
}

document.body.onscroll = moveCamera;
*/


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


