import * as THREE from 'three';
import {
	OrbitControls
} from 'OrbitControls';

let camera, scene, renderer, bulbLight, bulbMat, hemiLight, stats;
let cubeMat, floorMat;

let previousShadowMap = false;


// ref for lumens: http://www.power-sure.com/lumens.htm
const bulbLuminousPowers = {
	'110000 lm (1000W)': 110000,
	'3500 lm (300W)': 4500,
	'1700 lm (100W)': 1700,
	'800 lm (60W)': 800,
	'400 lm (40W)': 400,
	'180 lm (25W)': 180,
	'20 lm (4W)': 20,
	'Off': 0
};

// ref for solar irradiances: https://en.wikipedia.org/wiki/Lux
const hemiLuminousIrradiances = {
	'0.0001 lx (Moonless Night)': 0.0001,
	'0.002 lx (Night Airglow)': 0.002,
	'0.5 lx (Full Moon)': 0.5,
	'3.4 lx (City Twilight)': 3.4,
	'50 lx (Living Room)': 50,
	'100 lx (Very Overcast)': 100,
	'350 lx (Office Room)': 350,
	'400 lx (Sunrise/Sunset)': 400,
	'1000 lx (Overcast)': 1000,
	'18000 lx (Daylight)': 18000,
	'50000 lx (Direct Sun)': 50000
};

const params = {
	shadows: true,
	exposure: .8,
	bulbPower: Object.keys( bulbLuminousPowers )[ 1 ],
	hemiIrradiance: Object.keys( hemiLuminousIrradiances )[ 0 ]
};
const container = document.getElementById('container');

camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.x = 0;
camera.position.z = 4;
camera.position.y = 8;

scene = new THREE.Scene();
const bulbGeometry = new THREE.SphereGeometry(0.0001, 16, 8);
bulbLight = new THREE.PointLight(0xffee88, 1, 100, 2);

bulbMat = new THREE.MeshStandardMaterial({
	emissive: 0xffffee,
	emissiveIntensity: 1,
	color: 0x000000
});
bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
bulbLight.position.set(0, 3, 0);
bulbLight.castShadow = true;
scene.add(bulbLight);

hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.02);
scene.add(hemiLight);

floorMat = new THREE.MeshStandardMaterial({
	roughness: 0.8,
	color: 0xffffff,
	metalness: 0.2,
	bumpScale: 0.0005
});
const textureLoader = new THREE.TextureLoader();
textureLoader.load('hardwood2_diffuse.jpg', function (map) {

	map.wrapS = THREE.RepeatWrapping;
	map.wrapT = THREE.RepeatWrapping;
	map.anisotropy = 4;
	map.repeat.set(10, 24);
	map.encoding = THREE.sRGBEncoding;
	floorMat.map = map;
	floorMat.needsUpdate = true;

});
textureLoader.load('hardwood2_bump.jpg', function (map) {

	map.wrapS = THREE.RepeatWrapping;
	map.wrapT = THREE.RepeatWrapping;
	map.anisotropy = 4;
	map.repeat.set(10, 24);
	floorMat.bumpMap = map;
	floorMat.needsUpdate = true;

});
textureLoader.load('hardwood2_roughness.jpg', function (map) {

	map.wrapS = THREE.RepeatWrapping;
	map.wrapT = THREE.RepeatWrapping;
	map.anisotropy = 4;
	map.repeat.set(10, 24);
	floorMat.roughnessMap = map;
	floorMat.needsUpdate = true;

});

cubeMat = new THREE.MeshStandardMaterial({
	roughness: 0,
	color: 0xffffff,
	bumpScale: 0.002,
	metalness: 0
});
textureLoader.load('board.jpg', function (map) {

	map.wrapS = THREE.RepeatWrapping;
	map.wrapT = THREE.RepeatWrapping;
	map.anisotropy = 4;
	map.repeat.set(1, 1);
	map.encoding = THREE.sRGBEncoding;
	cubeMat.map = map;
	cubeMat.needsUpdate = true;

});
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMesh = new THREE.Mesh(floorGeometry, floorMat);
floorMesh.receiveShadow = true;
floorMesh.rotation.x = -Math.PI / 2.0;
scene.add(floorMesh);

const map = new THREE.TextureLoader().load('vul.jpg');
const map2 = new THREE.TextureLoader().load('crow.jpg');
map.wrapS = map.wrapT = THREE.RepeatWrapping;
map2.wrapS = map.wrapT = THREE.RepeatWrapping;
map.anisotropy = 16;
map2.anisotropy = 16;

const material2 = new THREE.MeshPhongMaterial({
	map: map,
	side: THREE.DoubleSide
});
const material1 = new THREE.MeshPhongMaterial({
	map: map2,
	side: THREE.DoubleSide
});
const pugs = new THREE.CylinderGeometry(.25, .25, .08, 64);
const c1 = new THREE.Mesh(pugs, material1);
c1.position.set(3.5, .14, 1);
c1.castShadow = true;
c1.userData.draggable = true;
c1.userData.name = 'CROW-1';
scene.add(c1);
const c2 = new THREE.Mesh(pugs, material1);
c2.position.set(3.5, .14, 2.11);
c2.castShadow = true;
c2.userData.draggable = true;
c2.userData.name = 'CROW-2';
scene.add(c2);
const c3 = new THREE.Mesh(pugs, material1);
c3.position.set(3.5, .14, -.25);
c3.castShadow = true;
c3.userData.draggable = true;
c3.userData.name = 'CROW-3';
scene.add(c3);
const c4 = new THREE.Mesh(pugs, material1);
c4.position.set(-3.5, .14, 2.11);
c4.castShadow = true;
c4.userData.draggable = true;
c4.userData.name = 'CROW-4';
scene.add(c4);
const c5 = new THREE.Mesh(pugs, material1);
c5.position.set(3.5, .14, -1.3);
c5.castShadow = true;
c5.userData.draggable = true;
c5.userData.name = 'CROW-5';
scene.add(c5);
const c6 = new THREE.Mesh(pugs, material1);
c6.position.set(-3.5, .14, 1);
c6.castShadow = true;
c6.userData.draggable = true;
c6.userData.name = 'CROW-6';
scene.add(c6);
const c7 = new THREE.Mesh(pugs, material1);
c7.position.set(-3.5, .14, -.25);
c7.castShadow = true;
c7.userData.draggable = true;
c7.userData.name = 'CROW-7';
scene.add(c7);
//	const material2 = new THREE.MeshStandardMaterial({color: 0xff0000});
const v1 = new THREE.Mesh(pugs, material2);
v1.position.set(-3.5, .14, -1.3);
v1.castShadow = true;
v1.userData.draggable = true;
v1.userData.name = 'VULTURE';
scene.add(v1);

const boxGeometry = new THREE.BoxGeometry(5, 0.1, 5);
const boxMesh = new THREE.Mesh(boxGeometry, cubeMat);
boxMesh.position.set(0, 0.05, 0);
boxMesh.castShadow = true;
boxMesh.userData.ground = true;
scene.add(boxMesh);

var audio = document.getElementById("audio");
var pick = document.getElementById("audio1");
var drop = document.getElementById("audio2");
audio.volume = .6

renderer = new THREE.WebGLRenderer();
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);


const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 8;
controls.maxDistance = 15;
controls.maxPolarAngle = Math.PI / 2.3;
controls.enableDamping = true;

window.addEventListener('resize', onWindowResize);

//Drag and Drop and game logic
const raycaster = new THREE.Raycaster();
const clickMouse = new THREE.Vector2();
const moveMouse = new THREE.Vector2();
var draggable = new THREE.Object3D();
draggable = null

function intersect(pos = new THREE.Vector2()) {
	raycaster.setFromCamera(pos, camera);
	return raycaster.intersectObjects(scene.children);
}
let ini_x, ini_z, des_x, des_z, rad = 0.4,
	crow_on_board = 0,
	turn = 0,
	crows_down = 0
const p_x = new Array(-0.855, 0, 1.37, 0.88, -1.32, 2.17, 0.53, 0, -0.55, -2.11)
const p_z = new Array(0.5, 1.16, 2.13, 0.5, 2.11, -0.5, -0.55, -2.15, -0.55, -0.53)
const occu = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
const adj = {
	1: [10, 5, 9, 8, 2, 3],
	2: [1, 3, 4, 5, 6, 10],
	3: [1, 2, 4, 7],
	4: [2, 3, 5, 6, 7, 8],
	5: [1, 2, 4, 9],
	6: [2, 4, 7, 9],
	7: [3, 4, 6, 8, 9, 10],
	8: [1, 4, 7, 9],
	9: [1, 5, 6, 7, 8, 10],
	10: [1, 2, 7, 9]
}

const betwn = {
	'10-7': 9,
	'7-10': 9,
	'9-6': 7,
	'6-9': 7,
	'8-4': 7,
	'4-8': 7,
	'7-3': 4,
	'3-7': 4,
	'2-6': 4,
	'6-2': 4,
	'4-5': 2,
	'5-4': 2,
	'1-3': 2,
	'3-1': 2,
	'2-10': 1,
	'10-2': 1,
	'5-9': 1,
	'9-5': 1,
	'1-8': 9,
	'8-1': 9
}

function crow_win() {
	if (v1.position.x < -3) return false
	let pos
	for (let k = 0; k < 10; k++) {
		if (v1.position.x == p_x[k] && v1.position.z == p_z[k]) {
			pos = k + 1
		}
	}
	for (let k = 0; k < adj[pos].length; k++) {
		if (occu[adj[pos][k] - 1] == 0) {
			return false;
		}
	}
	return true;
}
function predictPosition(_x, _z, name) {
	for (let i = 0; i < 10; i++) {
		let val = (_x - p_x[i]) * (_x - p_x[i]) + (_z - p_z[i]) * (_z - p_z[i])
		let dist = (p_x[i] - ini_x) * (p_x[i] - ini_x) + (p_z[i] - ini_z) * (p_z[i] - ini_z)
		if (turn == 0 && name != 'VULTURE' && val <= rad * rad && occu[i] == 0 &&
			(dist < 2.93 || ini_x < -3 || ini_x > 3) &&
			(!(crow_on_board < 7 && ini_x < 3 && ini_x > -3))) {
			if (ini_x < -3 || ini_x > 3) crow_on_board++;
			des_x = p_x[i];
			des_z = p_z[i];
			occu[i] = 1;
			for (let k = 0; k < 10; k++) {
				if (ini_x == p_x[k] && ini_z == p_z[k]) {
					occu[k] = 0;
				}
			}
			turn = 1
			return;
		} else {
			let curr
			for (let k = 0; k < 10; k++) {
				if (ini_x == p_x[k] && ini_z == p_z[k]) {
					curr = k + 1
				}
			}
			if (turn == 1 && name == 'VULTURE' && val <= rad * rad && occu[i] == 0 && (ini_x < -3 || adj[curr].includes(i + 1))) {
				if (ini_x > -3 && betwn[String(curr) + '-' + String(i + 1)] && occu[betwn[String(curr) + '-' + String(i + 1)] - 1] == 0) break;
				turn=0
				des_x = p_x[i];
				des_z = p_z[i];
				occu[i] = 1;
				if (ini_x > -3)
					occu[curr - 1] = 0;
				if (ini_x > -3 && betwn[String(curr) + '-' + String(i + 1)] && occu[betwn[String(curr) + '-' + String(i + 1)] - 1] == 1) {
					if (c1.position.x == p_x[betwn[String(curr) + '-' + String(i + 1)] - 1] &&
						c1.position.z == p_z[betwn[String(curr) + '-' + String(i + 1)] - 1]) {
						c1.position.set(3.5, .04, 1)
						c1.userData.draggable = false
					} else if (c2.position.x == p_x[betwn[String(curr) + '-' + String(i + 1)] - 1] &&
						c2.position.z == p_z[betwn[String(curr) + '-' + String(i + 1)] - 1]) {
						c2.position.set(3.5, .04, 2.13)
						c2.userData.draggable = false
					} else if (c3.position.x == p_x[betwn[String(curr) + '-' + String(i + 1)] - 1] &&
						c3.position.z == p_z[betwn[String(curr) + '-' + String(i + 1)] - 1]) {
						c3.position.set(3.5, .04, -.25)
						c3.userData.draggable = false
					} else if (c4.position.x == p_x[betwn[String(curr) + '-' + String(i + 1)] - 1] &&
						c4.position.z == p_z[betwn[String(curr) + '-' + String(i + 1)] - 1]) {
						c4.position.set(-3.5, .04, 2.11)
						c4.userData.draggable = false
					} else if (c5.position.x == p_x[betwn[String(curr) + '-' + String(i + 1)] - 1] &&
						c5.position.z == p_z[betwn[String(curr) + '-' + String(i + 1)] - 1]) {
						c5.position.set(3.5, .04, -1.3)
						c5.userData.draggable = false
					} else if (c6.position.x == p_x[betwn[String(curr) + '-' + String(i + 1)] - 1] &&
						c6.position.z == p_z[betwn[String(curr) + '-' + String(i + 1)] - 1]) {
						c6.position.set(-3.5, .04, 1)
						c6.userData.draggable = false
					} else {
						c7.position.set(-3.5, .04, -.25)
						c7.userData.draggable = false
					}
					occu[betwn[String(curr) + '-' + String(i + 1)] - 1] = 0
					crows_down++
				}
				return;
			}
		}

	}

	des_x = ini_x
	des_z = ini_z
}
let click=0
var p = document.getElementById("info")
var txt =document.getElementById("txt")
document.getElementById('link').onclick = function(code) 
{
    this.href = 'data:text/plain;charset=utf-11,' + encodeURIComponent(txt.value);
};
window.addEventListener('click', event => {
	//txt.scrollTop=textAreaObject.scrollHeight;
	click++
	if(click==1) p.innerHTML="CROWS START FIRST"
	if (draggable != null) {
		drop.play()
		console.log(`dropping draggable ${draggable.userData.name}`)
		predictPosition(draggable.position.x, draggable.position.z, draggable.userData.name)
		draggable.position.x = des_x
		draggable.position.z = des_z
		console.log(draggable.position.x, draggable.position.z)
		txt.append(draggable.userData.name+" dropped at "+String(draggable.position.x)+" "+String(draggable.position.z)+"\n")

		if (turn == 0) p.innerHTML = "CROW'S TURN"
		else p.innerHTML = "VULTURE'S TURN"
		//if ((turn == 0 && crow_on_board < 7 && ini_x < 3 && ini_x > -3))
		let flag=0
		if (crows_down == 4){
			p.innerHTML = "VULTURE WINS"
			flag=1
		}
		if (crow_win()){
			p.innerHTML = "CROWS WIN"
			flag=1
		}
		if(flag==1){
			c1.userData.draggable=c2.userData.draggable=c3.userData.draggable=false
			c4.userData.draggable=c5.userData.draggable=c6.userData.draggable=false
			c7.userData.draggable=v1.userData.draggable=false
		}
		draggable = null
		txt.scrollTop=txt.scrollHeight;
		return;
	}

	// THREE RAYCASTER
	clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	const found = intersect(clickMouse);
	if (found.length > 0) {
		if (found[0].object.userData.draggable) {
			pick.play()
			draggable = found[0].object
			ini_x = draggable.position.x
			ini_z = draggable.position.z
			console.log(`found draggable ${draggable.userData.name}`)
			txt.append(draggable.userData.name+" picked from "+String(draggable.position.x)+" "+String(draggable.position.z)+"\n")
		}
	}
})

window.addEventListener('mousemove', event => {
	moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	moveMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function dragObject() {
	if (draggable != null) {
		const found = intersect(moveMouse);
		if (found.length > 0) {
			for (let i = 0; i < found.length; i++) {
				let target = found[i].point;
				draggable.position.x = target.x
				draggable.position.z = target.z
			}
		}
	}
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

animate();

function animate() {
	controls.update();
	dragObject();
	if(click)
		audio.play()
	requestAnimationFrame(animate);

	render();

}

function render() {

	renderer.toneMappingExposure = Math.pow(params.exposure, 5.0);
	renderer.shadowMap.enabled = params.shadows;
	bulbLight.castShadow = params.shadows;

	if (params.shadows !== previousShadowMap) {
		cubeMat.needsUpdate = true;
		floorMat.needsUpdate = true;
		previousShadowMap = params.shadows;

	}
	bulbLight.power = bulbLuminousPowers[params.bulbPower];
	bulbMat.emissiveIntensity = bulbLight.intensity / Math.pow(0.02, 2.0);
	hemiLight.intensity = hemiLuminousIrradiances[params.hemiIrradiance];
	renderer.render(scene, camera);
}
