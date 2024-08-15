const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const resetBtn = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hue = 0;
let direction = true;
let paths = [];
let currentPath = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    clearCanvas();
    redrawPaths();
}

function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function redrawPaths() {
    paths.forEach(path => {
        drawSmoothLine(path, `hsl(${hue}, 100%, 50%)`, ctx.lineWidth);
        hue = (hue + 2) % 360;
    });
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ... (rest of the code remains the same)

function resetCanvas() {
    clearCanvas();
    hue = 0;
    direction = true;
    ctx.lineWidth = 1;
    paths = [];
    currentPath = [];
    isDrawing = false;
    lastX = 0;
    lastY = 0;
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
}

// ... (rest of the code remains the same)

resizeCanvas();
