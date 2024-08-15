const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const resetBtn = document.getElementById('resetBtn');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hue = 0;
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = color;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.1) this.size -= 0.1;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawShape(x, y, sides, size) {
    ctx.beginPath();
    ctx.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));

    for (let i = 1; i <= sides; i++) {
        ctx.lineTo(x + size * Math.cos(i * 2 * Math.PI / sides), 
                   y + size * Math.sin(i * 2 * Math.PI / sides));
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function draw(e) {
    if (!isDrawing) return;

    const x = e.clientX || e.touches[0].clientX;
    const y = e.clientY || e.touches[0].clientY;

    const color = `hsl(${hue}, 100%, 50%)`;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = Math.random() * 10 + 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw line
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Draw shape
    const sides = Math.floor(Math.random() * 5) + 3;
    const size = Math.random() * 20 + 5;
    drawShape(x, y, sides, size);

    // Create particles
    for (let i = 0; i < 5; i++) {
        particles.push(new Particle(x, y, color));
    }

    [lastX, lastY] = [x, y];

    hue += 2;
    if (hue >= 360) hue = 0;

    // Add glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
}

function animateParticles() {
    ctx.globalAlpha = 0.02;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].size <= 0.1) {
            particles.splice(i, 1);
        }
    }

    requestAnimationFrame(animateParticles);
}

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY];
}

function stopDrawing() {
    isDrawing = false;
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

resetBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = [];
});

animateParticles();
