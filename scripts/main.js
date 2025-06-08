
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const config = {
    backgroundColor: 0x000000,
    starCount: 10000,
    starFieldSize: 2000
};

function init() {
    setupRenderer();
    setupCamera();
    setupLights();
    createStarField();
    createSolarSystem();
    setupEventListeners();
    animate();
    setupButtonHovers();
}


function setupRenderer() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(config.backgroundColor);
    document.body.appendChild(renderer.domElement);
}

function setupCamera() {
    camera.position.z = 50;
    window.controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 20;
    controls.maxDistance = 200;
}

function setupLights() {
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
}
function createStarField() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true
    });

    const starsVertices = [];
    for (let i = 0; i < config.starCount; i++) {
        starsVertices.push(
            (Math.random() - 0.5) * config.starFieldSize,
            (Math.random() - 0.5) * config.starFieldSize,
            (Math.random() - 0.5) * config.starFieldSize
        );
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

function animate() {
    requestAnimationFrame(animate);
    
    if (!window.isPaused) {
        const delta = window.clock.getDelta();
        updatePlanets(delta);
    }
    
    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function setupEventListeners() {
    window.addEventListener('resize', onWindowResize);
}
function setupButtonHovers() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
    });
}
window.clock = new THREE.Clock();
window.isPaused = false;
init();