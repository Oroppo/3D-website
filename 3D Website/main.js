
import gsap from 'gsap'
import * as THREE from 'three';

import  {OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

import atmosphereVertexShader from './Shaders/atmosphereVertex.glsl';
import atmosphereFragmentShader from './Shaders/atmosphereFragment.glsl';

import vertexShader from './Shaders/Vertex.glsl';
import fragmentShader from './Shaders/Fragment.glsl';
import { NoToneMapping } from 'three';

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

//Audio BoilerPlate
const listener = new THREE.AudioListener();
camera.add(listener);

const audioloader = new THREE.AudioLoader()
const BGM = new THREE.Audio(listener);

audioloader.load('../sounds/BGM.mp3', function(buffer){
  BGM.setBuffer(buffer)
  BGM.setLoop(true)
  BGM.setVolume(0.4)
  BGM.play();
})

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = canvasContainer.offsetWidth / canvasContainer.offsetHeight
    camera.updateProjectionMatrix()
    renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
    renderer.render(scene, camera)
}
const mouse ={
  x: 1,
  y: 1
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



function addStar(){
  const geometry = new THREE.BufferGeometry(0.25,24,24);
  const material = new THREE.PointsMaterial({color: 0xffffff})
  const star = new THREE.Mesh(geometry, material);

  const [x,y,z] = Array(3).fill().map(()=>THREE.MathUtils.randFloatSpread(100));

  star.position.set(x,y,z);
  scene.add(star);
}
Array(200).fill().forEach(addStar);



const planetTexture = new THREE.TextureLoader().load('Earth.jpg');
const normalTexture = new THREE.TextureLoader().load('NormalMap.jpg');

const card = new THREE.Plane({
  normal: new THREE.Vector3(10,10,10),
  constant: 5
})

const planet = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.ShaderMaterial( {
    normalTexture,
    vertexShader,
    fragmentShader,
    uniforms:{
      earthTexture:{
        value: planetTexture
      }
    }
  })
);
planet.rotation.x = -0.5
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
scene.add(atmosphere);



const planetFolder = gui.addFolder('Planet')

planetFolder.add(planet.rotation,'x', -1, 1,0.01)
planetFolder.add(planet.rotation,'y', -1, 1,0.01)
planetFolder.add(planet.rotation,'z', -1, 1,0.01)
planetFolder.add(planet.position,'x', -60, 60,0.5)
planetFolder.add(planet.position,'y', -60, 60,0.5)
planetFolder.add(planet.position,'z', -60, 60,0.5)
planetFolder.open()

const cameraFolder = gui.addFolder('Camera')

cameraFolder.add(camera.rotation,'x', -1, 1,0.01)
cameraFolder.add(camera.rotation,'y', -1, 1,0.01)
cameraFolder.add(camera.rotation,'z', -1, 1,0.01)
cameraFolder.add(camera.position,'x', -60, 60,0.5)
cameraFolder.add(camera.position,'y', -60, 60,0.5)
cameraFolder.add(camera.position,'z', -60, 60,0.5)
cameraFolder.open()

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

