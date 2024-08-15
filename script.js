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
}

function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawSmoothLine(points, color, lineWidth) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length - 2; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }

    if (points.length > 2) {
        const last = points.length - 1;
        ctx.quadraticCurveTo(points[last - 1].x, points[last - 1].y, points[last].x, points[last].y);
    }

    ctx.stroke();
}

function draw(e) {
    if (!isDrawing) return;

    const x = e.clientX || e.touches[0].clientX;
    const y = e.clientY || e.touches[0].clientY;

    currentPath.push({ x, y });

    const color = `hsl(${hue}, 100%, 50%)`;
    ctx.lineWidth = direction ? ctx.lineWidth + 0.1 : ctx.lineWidth - 0.1;

    if (ctx.lineWidth > 50 || ctx.lineWidth < 1) {
        direction = !direction;
    }

    drawSmoothLine(currentPath, color, ctx.lineWidth);

    ctx.shadowBlur = 15;
    ctx.shadowColor = color;

    hue += 2;
    if (hue >= 360) hue = 0;
}

function startDrawing(e) {
    isDrawing = true;
    currentPath = [];
    [lastX, lastY] = [e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY];
    currentPath.push({ x: lastX, y: lastY });
}

function stopDrawing() {
    isDrawing = false;
    ctx.shadowBlur = 0;
    paths.push(currentPath);
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    draw(e.touches[0]);
});
canvas.addEventListener('touchend', stopDrawing);

function resetCanvas() {
    clearCanvas();
    hue = 0;
    direction = true;
    ctx.lineWidth = 1;
    paths = [];
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.hypot(centerX, centerY);
    
    for (let radius = 0; radius < maxRadius; radius += 5) {
        setTimeout(() => {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
            ctx.stroke();
        }, radius * 2);
    }
}

resetBtn.addEventListener('click', resetCanvas);

function downloadCanvas() {
    const link = document.createElement('a');
    link.download = 'abstract-art.jpg';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
}

downloadBtn.addEventListener('click', downloadCanvas);

resizeCanvas();
