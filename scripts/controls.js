
function initControls() {
    createSpeedControls();
    setupPauseButton();
    setupThemeToggle();
    setupResetButton();
    setupPlanetHover();
    setupAutoRotationToggle();
}

function createSpeedControls() {
    const controlsContainer = document.getElementById('planet-controls');

    window.planetObjects.slice(1).forEach((planetObj) => {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'planet-control';

        const label = document.createElement('label');
        label.textContent = planetObj.data.name;
        label.title = `Adjust speed for ${planetObj.data.name}`;

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '200';
        slider.value = planetObj.data.speed * 10000;
        slider.title = `Speed of ${planetObj.data.name}`;

        slider.addEventListener('input', () => {
            planetObj.data.speed = slider.value / 10000;
            speedValue.textContent = (slider.value / 100).toFixed(2);
        });

        const speedValue = document.createElement('span');
        speedValue.className = 'speed-value';
        speedValue.textContent = (planetObj.data.speed * 100).toFixed(2);

        controlDiv.appendChild(label);
        controlDiv.appendChild(slider);
        controlDiv.appendChild(speedValue);
        controlsContainer.appendChild(controlDiv);
    });
}

function setupPauseButton() {
    const pauseBtn = document.getElementById('pause-btn');

    pauseBtn.addEventListener('click', () => {
        window.isPaused = !window.isPaused;
        pauseBtn.textContent = window.isPaused ? '▶ Resume' : '⏸ Pause';
        pauseBtn.classList.toggle('active');
    });
}
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    themeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-mode');
        
        renderer.setClearColor(isLight ? 0xf5f5f5 : 0x000000);
        
        window.planetObjects.forEach(planet => {
            if(planet.data.name === 'Sun') return;
            planet.mesh.material.color.setHex(isLight ? 
                darkenColor(planet.data.color) : planet.data.color);
        });
        
        themeToggle.textContent = isLight ? '🌙 Dark Mode' : '🌞 Light Mode';
    });
}

function setupResetButton() {
    const resetBtn = document.getElementById('reset-btn');
    
    resetBtn.addEventListener('click', () => {
        if (typeof controls?.reset === 'function') {
            controls.reset();
        }
        camera.position.z = 50;
        let opacity = 1;
        const fadeOut = setInterval(() => {
            opacity -= 0.05;
            resetBtn.style.opacity = opacity;
            if (opacity <= 0.5) {
                clearInterval(fadeOut);
                const fadeIn = setInterval(() => {
                    opacity += 0.05;
                    resetBtn.style.opacity = opacity;
                    if (opacity >= 1) clearInterval(fadeIn);
                }, 20);
            }
        }, 20);
    });
}

function setupPlanetHover() {
    const planetInfo = document.getElementById('planet-info');
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(
            window.planetObjects.map(p => p.mesh)
        );

        if (intersects.length > 0) {
            const planet = window.planetObjects.find(
                p => p.mesh === intersects[0].object
            );
            planetInfo.style.display = 'block';
            planetInfo.textContent = planet.data.name;
        } else {
            planetInfo.style.display = 'none';
        }
    });
    let opacity = 0;
    window.addEventListener('mousemove', (event) => {
        
        if (intersects.length > 0) {
            opacity = Math.min(1, opacity + 0.1);
            planetInfo.style.opacity = opacity;
            planetInfo.style.display = 'block';
        } else {
            opacity = Math.max(0, opacity - 0.1);
            if (opacity <= 0) {
                planetInfo.style.display = 'none';
            } else {
                planetInfo.style.opacity = opacity;
            }
        }
    });
}
function setupAutoRotationToggle() {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = 'Auto-Rotate: ON';
    btn.id = 'rotate-btn';
    
    document.querySelector('.action-buttons').prepend(btn);
    
    btn.addEventListener('click', () => {
        controls.autoRotate = !controls.autoRotate;
        btn.textContent = `Auto-Rotate: ${controls.autoRotate ? 'ON' : 'OFF'}`;
    });
}

document.addEventListener('DOMContentLoaded', initControls);