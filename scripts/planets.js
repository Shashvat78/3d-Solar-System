
const planetData = [
    { name: 'Sun', radius: 5, color: 0xffff00, distance: 0, speed: 0, rotationSpeed: 0.01 },
    { name: 'Mercury', radius: 0.4, color: 0xb5b5b5, distance: 10, speed: 0.04, rotationSpeed: 0.004 },
    { name: 'Venus', radius: 0.6, color: 0xe6c229, distance: 15, speed: 0.015, rotationSpeed: 0.002 },
    { name: 'Earth', radius: 0.6, color: 0x3498db, distance: 20, speed: 0.01, rotationSpeed: 0.02 },
    { name: 'Mars', radius: 0.5, color: 0xe67e22, distance: 25, speed: 0.008, rotationSpeed: 0.018 },
    { name: 'Jupiter', radius: 1.2, color: 0xf1c40f, distance: 35, speed: 0.002, rotationSpeed: 0.04 },
    { name: 'Saturn', radius: 1.0, color: 0xf39c12, distance: 45, speed: 0.0009, rotationSpeed: 0.038, hasRing: true },
    { name: 'Uranus', radius: 0.8, color: 0x1abc9c, distance: 55, speed: 0.0004, rotationSpeed: 0.03 },
    { name: 'Neptune', radius: 0.8, color: 0x3498db, distance: 65, speed: 0.0001, rotationSpeed: 0.032 }
];

window.planetObjects = [];


function createSolarSystem() {
    planetData.forEach((planet, index) => {
        const planetObj = createPlanet(planet, index);
        window.planetObjects.push(planetObj);
        if (index > 0) {
            createOrbitPath(planet.distance);
        }
    });
}

function createPlanet(planet, index) {
    const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
    const material = new THREE.MeshPhongMaterial({ 
        color: planet.color,
        emissive: index === 0 ? planet.color : 0x000000,
        emissiveIntensity: index === 0 ? 0.5 : 0
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    
    if (planet.distance > 0) {
        mesh.position.x = planet.distance;
    }
    if (planet.hasRing) {
        addPlanetRings(mesh, planet.radius);
    }
    
    scene.add(mesh);
    
    return {
        mesh: mesh,
        data: planet,
        angle: Math.random() * Math.PI * 2
    };
}

function addPlanetRings(planetMesh, planetRadius) {
    const ringGeometry = new THREE.RingGeometry(planetRadius * 1.5, planetRadius * 2, 32);
    const ringMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xf5d742,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    planetMesh.add(ring);
}

function createOrbitPath(radius) {
    const orbitGeometry = new THREE.BufferGeometry();
    const orbitMaterial = new THREE.LineBasicMaterial({ 
        color: 0x888888, 
        transparent: true, 
        opacity: 0.3 
    });
    
    const points = [];
    const segments = 64;
    
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(
            Math.cos(theta) * radius,
            0,
            Math.sin(theta) * radius
        ));
    }
    
    orbitGeometry.setFromPoints(points);
    const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
    scene.add(orbit);
}

function updatePlanets(delta) {
    window.planetObjects.forEach((planetObj, index) => {
        if (index === 0) {
            planetObj.mesh.rotation.y += planetObj.data.rotationSpeed * delta * 10;
        } else {
            planetObj.angle += planetObj.data.speed * delta;
            planetObj.mesh.position.x = Math.cos(planetObj.angle) * planetObj.data.distance;
            planetObj.mesh.position.z = Math.sin(planetObj.angle) * planetObj.data.distance;
            
            planetObj.mesh.rotation.y += planetObj.data.rotationSpeed * delta * 10;
        }
    });
}