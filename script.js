const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const resetBtn = document.getElementById('resetBtn');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hue = 0;
let particles = [];
let lineWidth = 2;
let lastUpdateTime = 0;
const targetFPS = 60;
const frameTime = 1000 / targetFPS;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(x, y, color, size) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.005;
        this.velocity = {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2
        };
    }

    update() {
        this.alpha -= this.decay;
        this.size *= 0.95;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function getBrushPoint(t, startX, startY, endX, endY, width) {
    const x = startX + (endX - startX) * t;
    const y = startY + (endY - startY) * t;
    const angle = Math.atan2(endY - startY, endX - startX) + Math.PI / 2;
    const bristleSpread = width * (Math.sin(t * Math.PI) * 0.5 + 0.5);
    const bristleX = x + Math.cos(angle) * bristleSpread * (Math.random() - 0.5);
    const bristleY = y + Math.sin(angle) * bristleSpread * (Math.random() - 0.5);
    return { x: bristleX, y: bristleY };
}

function draw(e) {
    if (!isDrawing) return;

    const currentTime = Date.now();
    if (currentTime - lastUpdateTime < frameTime) return;
    lastUpdateTime = currentTime;

    const x = e.clientX || e.touches[0].clientX;
    const y = e.clientY || e.touches[0].clientY;

    const baseColor = `hsl(${hue}, 100%, 50%)`;
    const complementaryHue = (hue + 180) % 360;
    const complementaryColor = `hsl(${complementaryHue}, 100%, 50%)`;

    const brushWidth = Math.sin(Date.now() * 0.01) * 10 + 20; // Oscillating brush width

    for (let t = 0; t < 1; t += 0.05) {
        const point = getBrushPoint(t, lastX, lastY, x, y, brushWidth);
        const size = Math.random() * 3 + 1;
        const color = Math.random() > 0.5 ? baseColor : complementaryColor;
        particles.push(new Particle(point.x, point.y, color, size));
    }

    // Draw main stroke
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = baseColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    [lastX, lastY] = [x, y];

    hue = (hue + 1) % 360;
    lineWidth = Math.min(lineWidth + 0.1, 20); // Gradually increase line width
}

function animateParticles() {
    ctx.globalCompositeOperation = 'screen';

    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

        if (particle.alpha <= 0 || particle.size <= 0.1) {
            particles.splice(index, 1);
        }
    });

    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(animateParticles);
}

function startDrawing(e) {
    isDrawing = true;
    lineWidth = 2; // Reset line width
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
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particles = [];
    
    resetBtn.classList.add('pulse');
    setTimeout(() => {
        resetBtn.classList.remove('pulse');
    }, 500);

    const burstParticles = 50;
    const burstRadius = 150;
    for (let i = 0; i < burstParticles; i++) {
        const angle = (i / burstParticles) * Math.PI * 2;
        const x = canvas.width / 2 + Math.cos(angle) * burstRadius;
        const y = canvas.height / 2 + Math.sin(angle) * burstRadius;
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        particles.push(new Particle(x, y, color, 5));
    }
});

resetBtn.addEventListener('mouseover', () => {
    const span = resetBtn.querySelector('span');
    span.style.transition = 'transform 0.5s ease';
    span.style.transform = 'rotate(180deg)';
});

resetBtn.addEventListener('mouseout', () => {
    const span = resetBtn.querySelector('span');
    span.style.transition = 'transform 0.5s ease';
    span.style.transform = 'rotate(0deg)';
});

animateParticles();
