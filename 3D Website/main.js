
import gsap from 'gsap'
import * as THREE from 'three';

import  {OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

import atmosphereVertexShader from './Shaders/atmosphereVertex.glsl';
import atmosphereFragmentShader from './Shaders/atmosphereFragment.glsl';

import vertexShader from './Shaders/Vertex.glsl';
import fragmentShader from './Shaders/Fragment.glsl';

const canvasContainer= document.querySelector('#CanvasContainer')

const scene = new THREE.Scene();

const gui = new dat.GUI();

const guiProperties = {};
const camera = new THREE.PerspectiveCamera(75, canvasContainer.offsetWidth/canvasContainer.offsetHeight, 0.1, 2000 );
camera.position.setX(-2);
camera.position.setY(-0);
camera.position.setZ(7);


const renderer = new THREE.WebGLRenderer({
 canvas: document.querySelector('canvas'),
 antialias: true
})

renderer.setPixelRatio(window.devicePixelRatio );
renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
renderer.setClearColor("black");


renderer.render( scene, camera );

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
    renderer.render(scene, camera)
}
const mouse ={
  x: undefined,
  y: undefined
}
window.addEventListener('mousemove', ()=>{
  mouse.x = (event.clientX/innerWidth) *2-1
  mouse.y = (event.clientY/innerHeight) *2+1
});

const controls = new OrbitControls(camera, renderer.domElement);
// example starts here
let gridHelper = new THREE.GridHelper(100, 100);
scene.add(gridHelper);
var axesHelper = new THREE.AxesHelper(1);
axesHelper.applyMatrix(new THREE.Matrix4().makeTranslation(1.5, 0, -1.5));
axesHelper.updateMatrixWorld(true);
scene.add(axesHelper);

const geometry = new THREE.SphereGeometry(2, 32, 32)
const material = new THREE.MeshPhongMaterial({ color: 0x00FFFF});
const moon = new THREE.Mesh( geometry, material);
scene.add(moon)

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,5,5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const cameraFolder = gui.addFolder('Camera')

cameraFolder.add(camera.position,'x',-100,100,0.5)
cameraFolder.add(camera.position,'y',-100,100,0.5)
cameraFolder.add(camera.position,'z',-100,100,0.5)
cameraFolder.open()

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
  })
);
const group = new THREE.Group()

group.add(planet)
scene.add(group)
planet.attach(moon);

const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.ShaderMaterial( {
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  })
);
atmosphere.scale.set(1.1, 1.1, 1.1);
atmosphere.rotation.x = 0.2353;
scene.add(atmosphere);

function animate(){

  requestAnimationFrame(animate);
  renderer.render( scene, camera );
  planet.rotation.y += 0.005;

  gsap.to(group.rotation,{
    x: mouse.y*0.5,
    y: mouse.x*0.5,
    duration: 2
  })
 // moon.rotation.x += 0.01;
 // moon.rotation.y += 0.005;
  //moon.rotation.z += 0.01;



}

animate();


