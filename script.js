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
    constructor(x, y, color, size) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.005;
    }

    update() {
        this.alpha -= this.decay;
        this.size *= 0.95;
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

    const x = e.clientX || e.touches[0].clientX;
    const y = e.clientY || e.touches[0].clientY;

    const color = `hsl(${hue}, 100%, 50%)`;
    const brushWidth = Math.random() * 20 + 10;

    for (let t = 0; t < 1; t += 0.02) {
        const point = getBrushPoint(t, lastX, lastY, x, y, brushWidth);
        const size = Math.random() * 3 + 1;
        particles.push(new Particle(point.x, point.y, color, size));
    }

    [lastX, lastY] = [x, y];

    hue = (hue + 1) % 360;
}

function animateParticles() {
    ctx.globalCompositeOperation = 'lighter';

    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

        if (particle.alpha <= 0 || particle.size <= 0.1) {
            particles.splice(index, 1);
        }
    });

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
    
    // Add pulse effect
    resetBtn.classList.add('pulse');
    setTimeout(() => {
        resetBtn.classList.remove('pulse');
    }, 500);

    // Create burst effect
    const burstParticles = 20;
    const burstRadius = 100;
    for (let i = 0; i < burstParticles; i++) {
        const angle = (i / burstParticles) * Math.PI * 2;
        const x = canvas.width / 2 + Math.cos(angle) * burstRadius;
        const y = canvas.height / 2 + Math.sin(angle) * burstRadius;
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        particles.push(new Particle(x, y, color, 5));
    }
});

// Add hover effect
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
