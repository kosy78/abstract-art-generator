// ... (previous code remains the same) ...

const resetBtn = document.getElementById('resetBtn');

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
        particles.push(new Particle(x, y, color));
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

// ... (rest of the code remains the same) ...
