
import gsap from 'gsap'
import * as THREE from 'three';

import  {OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import  {GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';

import atmosphereVertexShader from './Shaders/atmosphereVertex.glsl';
import atmosphereFragmentShader from './Shaders/atmosphereFragment.glsl';

import vertexShader from './Shaders/Vertex.glsl';
import fragmentShader from './Shaders/Fragment.glsl';
import { Float32BufferAttribute, NoToneMapping } from 'three';

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
const Selection = new THREE.Audio(listener);

audioloader.load('../sounds/BGM1.wav', function(buffer){
  BGM.setBuffer(buffer)
  BGM.setLoop(true)
  BGM.setVolume(0.4)
  //BGM.play();
})
audioloader.load('../sounds/Menu Selection click.wav', function(buffer){
  Selection.setBuffer(buffer)
  Selection.setLoop(false)
  Selection.setVolume(1.0)

})

//TODO: Add selection noise + functionality

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
axesHelper.applyMatrix4(new THREE.Matrix4().makeTranslation(1.5, 0, -1.5));
axesHelper.updateMatrixWorld(true);
scene.add(axesHelper);

const moonTexture = new THREE.TextureLoader().load('Moon.jpg')
const geometry = new THREE.SphereGeometry(2, 32, 32)
const material = new THREE.MeshPhongMaterial({ map: moonTexture});
const moon = new THREE.Mesh( geometry, material);
scene.add(moon)
moon.position.x = 20;
moon.position.y = 5.5;

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,5,5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const starGeometry =new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff
})
const stars = new THREE.Points(starGeometry, starMaterial)
scene.add(stars)

const starVertices = []
for (let i=0; i<10000;i++){
  const x = (Math.random()-0.5)*2000;
  const y = (Math.random()-0.5)*2000;
  const z = -Math.random()*2000;
  starVertices.push(x,y,z)
}
starGeometry.setAttribute('position',new THREE.Float32BufferAttribute(starVertices, 3))

const planetTexture = new THREE.TextureLoader().load('Earth.jpg');
const normalTexture = new THREE.TextureLoader().load('NormalMap.jpg');

//TODO: create am information card in Blender
const amnesiaTexture = new THREE.TextureLoader().load('Me.jpg');
const genericCard = new GLTFLoader().load('Models/Card.glb', function(gltf){
  scene.add( gltf.scene );

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object
},function(xhr){
  console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
},function(error){
  console.log( 'An error happened' );
})
const cardMaterial = new THREE.MeshPhongMaterial({ map: planetTexture});
const CardMaterial2 = new THREE.PointsMaterial({
  color: 0xaaaaaa
})
const amnesiaCard = new THREE.Mesh(
  genericCard,
  CardMaterial2
)

scene.add(amnesiaCard);


const CardFolder = gui.addFolder('Cards')

CardFolder.add(amnesiaCard.rotation,'x', -3, 3,0.01)
CardFolder.add(amnesiaCard.rotation,'y', -3, 3,0.01)
CardFolder.add(amnesiaCard.rotation,'z', -3, 3,0.01)
CardFolder.add(amnesiaCard.position,'x', -60, 60,0.5)
CardFolder.add(amnesiaCard.position,'y', -60, 60,0.5)
CardFolder.add(amnesiaCard.position,'z', -60, 60,0.5)
CardFolder.open()




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
planet.rotation.x = 0.2
planet.rotation.y = -0.2
planet.rotation.z = 0.3
const group = new THREE.Group()

group.add(planet)
group.add(moon)
scene.add(group)
//planet.attach(moon);

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

planetFolder.add(planet.rotation,'x', -3, 3,0.01)
planetFolder.add(planet.rotation,'y', -3, 3,0.01)
planetFolder.add(planet.rotation,'z', -3, 3,0.01)
planetFolder.add(planet.position,'x', -60, 60,0.5)
planetFolder.add(planet.position,'y', -60, 60,0.5)
planetFolder.add(planet.position,'z', -60, 60,0.5)
planetFolder.open()

const moonFolder = gui.addFolder('Moon')

moonFolder.add(moon.rotation,'x', -1, 1,0.01)
moonFolder.add(moon.rotation,'y', -1, 1,0.01)
moonFolder.add(moon.rotation,'z', -1, 1,0.01) 
moonFolder.add(moon.position,'x', -60, 60,0.5)
moonFolder.add(moon.position,'y', -60, 60,0.5)
moonFolder.add(moon.position,'z', -60, 60,0.5)
moonFolder.open()

const cameraFolder = gui.addFolder('Camera')

cameraFolder.add(camera.rotation,'x', -1, 1,0.01)
cameraFolder.add(camera.rotation,'y', -1, 1,0.01)
cameraFolder.add(camera.rotation,'z', -1, 1,0.01)
cameraFolder.add(camera.position,'x', -60, 60,0.5)
cameraFolder.add(camera.position,'y', -60, 60,0.5)
cameraFolder.add(camera.position,'z', -60, 60,0.5)
cameraFolder.open()

//TODO Add the sections for each button in 3D space (Teams, Projects, Bio,  Contact)



const teams = document.querySelector('#Teams')
teams.addEventListener('mouseover',()=>{
  Selection.play();
}
)
teams.addEventListener('click',()=>{
  gsap.to(camera.position,{
    x: 50,
    duration: 4
  })
}
)
const bio = document.querySelector('#Bio')
bio.addEventListener('mouseover',()=>{
  Selection.play();
}
)
bio.addEventListener('click',()=>{
  gsap.to(camera.position,{
    x: -2,
    duration: 4
  })
}
)
const projects = document.querySelector('#Projects')
projects.addEventListener('mouseover',()=>{
  Selection.play();
}
)

const start = document.querySelector('#Start')
start.addEventListener('mouseover',()=>{
  Selection.play();
}
)

function animate(){



gsap.to(planet.rotation,{
  x: planet.rotation.x + (mouse.x*0.5),
  y: planet.rotation.y + (mouse.x*0.5),
  duration: 2
})

  group.rotation.y += 0.005; 
  moon.rotation.x += 0.01;
  moon.rotation.y += 0.005;
  moon.rotation.z += 0.01;

  requestAnimationFrame(animate);
  renderer.render( scene, camera );

}

animate();



