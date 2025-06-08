
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}


function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

function radToDeg(radians) {
    return radians * (180 / Math.PI);
}


function randomInRange(min, max) { 
    return Math.random() * (max - min) + min;
}
function darkenColor(hexColor) {
    return hexColor - 0x222222; 
}

function formatNumber(num, precision = 2) {
    return parseFloat(num.toFixed(precision));
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        clamp,
        degToRad,
        radToDeg,
        randomInRange,
        formatNumber
    };
}