/**
 * Physics Simulations for Interactive Learning
 * Provides canvas-based physics demonstrations
 */

class PhysicsSimulation {
    constructor(canvasId, type = 'pendulum') {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.type = type;
        this.isRunning = false;
        this.animationId = null;
        
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Initialize simulation based on type
        this.init();
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = Math.min(400, container.clientWidth * 0.6);
    }
    
    init() {
        switch(this.type) {
            case 'pendulum':
                this.initPendulum();
                break;
            case 'projectile':
                this.initProjectile();
                break;
            case 'wave':
                this.initWave();
                break;
            case 'spring':
                this.initSpring();
                break;
            default:
                this.initPendulum();
        }
    }
    
    // Simple Pendulum Simulation
    initPendulum() {
        this.pendulum = {
            length: 150,
            angle: Math.PI / 4,
            angleVelocity: 0,
            angleAcceleration: 0,
            damping: 0.995,
            gravity: 0.5
        };
    }
    
    drawPendulum() {
        const { width, height } = this.canvas;
        const { length, angle } = this.pendulum;
        
        // Clear canvas
        this.ctx.fillStyle = 'rgba(248, 250, 252, 0.1)';
        this.ctx.fillRect(0, 0, width, height);
        
        // Calculate position
        const pivotX = width / 2;
        const pivotY = height / 4;
        const bobX = pivotX + length * Math.sin(angle);
        const bobY = pivotY + length * Math.cos(angle);
        
        // Draw string
        this.ctx.beginPath();
        this.ctx.moveTo(pivotX, pivotY);
        this.ctx.lineTo(bobX, bobY);
        this.ctx.strokeStyle = '#64748b';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw pivot
        this.ctx.beginPath();
        this.ctx.arc(pivotX, pivotY, 5, 0, Math.PI * 2);
        this.ctx.fillStyle = '#1e293b';
        this.ctx.fill();
        
        // Draw bob
        this.ctx.beginPath();
        this.ctx.arc(bobX, bobY, 20, 0, Math.PI * 2);
        this.ctx.fillStyle = '#2563eb';
        this.ctx.fill();
        
        // Draw trail
        this.ctx.beginPath();
        this.ctx.arc(bobX, bobY, 2, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(37, 99, 235, 0.3)';
        this.ctx.fill();
    }
    
    updatePendulum() {
        const { length, gravity, damping } = this.pendulum;
        
        // Physics calculations
        this.pendulum.angleAcceleration = (-gravity / length) * Math.sin(this.pendulum.angle);
        this.pendulum.angleVelocity += this.pendulum.angleAcceleration;
        this.pendulum.angleVelocity *= damping;
        this.pendulum.angle += this.pendulum.angleVelocity;
    }
    
    // Projectile Motion Simulation
    initProjectile() {
        this.projectile = {
            x: 50,
            y: 300,
            vx: 5,
            vy: -15,
            gravity: 0.3,
            trail: []
        };
    }
    
    drawProjectile() {
        const { width, height } = this.canvas;
        
        // Clear canvas
        this.ctx.fillStyle = 'rgba(248, 250, 252, 1)';
        this.ctx.fillRect(0, 0, width, height);
        
        // Draw ground
        this.ctx.fillStyle = '#e2e8f0';
        this.ctx.fillRect(0, height - 50, width, 50);
        
        // Draw trail
        this.ctx.strokeStyle = 'rgba(37, 99, 235, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.projectile.trail.forEach((point, i) => {
            if (i === 0) this.ctx.moveTo(point.x, point.y);
            else this.ctx.lineTo(point.x, point.y);
        });
        this.ctx.stroke();
        
        // Draw projectile
        this.ctx.beginPath();
        this.ctx.arc(this.projectile.x, this.projectile.y, 8, 0, Math.PI * 2);
        this.ctx.fillStyle = '#2563eb';
        this.ctx.fill();
    }
    
    updateProjectile() {
        // Update position
        this.projectile.vy += this.projectile.gravity;
        this.projectile.x += this.projectile.vx;
        this.projectile.y += this.projectile.vy;
        
        // Add to trail
        this.projectile.trail.push({ x: this.projectile.x, y: this.projectile.y });
        if (this.projectile.trail.length > 50) {
            this.projectile.trail.shift();
        }
        
        // Reset if out of bounds
        if (this.projectile.y > this.canvas.height - 50 || this.projectile.x > this.canvas.width) {
            this.projectile.x = 50;
            this.projectile.y = 300;
            this.projectile.vy = -15;
            this.projectile.trail = [];
        }
    }
    
    // Wave Simulation
    initWave() {
        this.wave = {
            amplitude: 30,
            frequency: 0.02,
            phase: 0,
            speed: 0.05
        };
    }
    
    drawWave() {
        const { width, height } = this.canvas;
        
        // Clear canvas
        this.ctx.fillStyle = 'rgba(248, 250, 252, 1)';
        this.ctx.fillRect(0, 0, width, height);
        
        // Draw wave
        this.ctx.strokeStyle = '#2563eb';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        
        for (let x = 0; x < width; x++) {
            const y = height / 2 + this.wave.amplitude * Math.sin(this.wave.frequency * x + this.wave.phase);
            if (x === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        
        this.ctx.stroke();
        
        // Draw amplitude lines
        this.ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(0, height / 2 - this.wave.amplitude);
        this.ctx.lineTo(width, height / 2 - this.wave.amplitude);
        this.ctx.moveTo(0, height / 2 + this.wave.amplitude);
        this.ctx.lineTo(width, height / 2 + this.wave.amplitude);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    
    updateWave() {
        this.wave.phase += this.wave.speed;
    }
    
    // Spring Mass System
    initSpring() {
        this.spring = {
            restLength: 100,
            k: 0.1,
            mass: 1,
            damping: 0.98,
            y: 200,
            vy: 0
        };
    }
    
    drawSpring() {
        const { width, height } = this.canvas;
        const centerX = width / 2;
        const topY = 50;
        
        // Clear canvas
        this.ctx.fillStyle = 'rgba(248, 250, 252, 0.95)';
        this.ctx.fillRect(0, 0, width, height);
        
        // Draw spring
        this.ctx.strokeStyle = '#64748b';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        const coils = 15;
        const coilWidth = 20;
        for (let i = 0; i <= coils; i++) {
            const t = i / coils;
            const y = topY + t * (this.spring.y - topY);
            const x = centerX + (i % 2 === 0 ? -coilWidth : coilWidth) * (i > 0 && i < coils ? 1 : 0);
            
            if (i === 0) this.ctx.moveTo(centerX, topY);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.lineTo(centerX, this.spring.y);
        this.ctx.stroke();
        
        // Draw ceiling
        this.ctx.fillStyle = '#e2e8f0';
        this.ctx.fillRect(centerX - 40, topY - 10, 80, 10);
        
        // Draw mass
        this.ctx.fillStyle = '#2563eb';
        this.ctx.fillRect(centerX - 30, this.spring.y, 60, 40);
    }
    
    updateSpring() {
        const displacement = this.spring.y - (50 + this.spring.restLength);
        const springForce = -this.spring.k * displacement;
        const acceleration = springForce / this.spring.mass;
        
        this.spring.vy += acceleration;
        this.spring.vy *= this.spring.damping;
        this.spring.y += this.spring.vy;
    }
    
    // Animation control
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    reset() {
        this.stop();
        this.init();
        this.draw();
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.update();
        this.draw();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    update() {
        switch(this.type) {
            case 'pendulum':
                this.updatePendulum();
                break;
            case 'projectile':
                this.updateProjectile();
                break;
            case 'wave':
                this.updateWave();
                break;
            case 'spring':
                this.updateSpring();
                break;
        }
    }
    
    draw() {
        switch(this.type) {
            case 'pendulum':
                this.drawPendulum();
                break;
            case 'projectile':
                this.drawProjectile();
                break;
            case 'wave':
                this.drawWave();
                break;
            case 'spring':
                this.drawSpring();
                break;
        }
    }
}

// Initialize simulations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Auto-initialize all simulation containers
    document.querySelectorAll('[data-simulation]').forEach(container => {
        const canvas = container.querySelector('canvas');
        if (!canvas) return;
        
        const type = container.dataset.simulation;
        const sim = new PhysicsSimulation(canvas.id, type);
        
        // Add controls
        const controls = container.querySelector('.simulation-controls');
        if (controls) {
            const startBtn = controls.querySelector('.start-btn');
            const stopBtn = controls.querySelector('.stop-btn');
            const resetBtn = controls.querySelector('.reset-btn');
            
            if (startBtn) startBtn.addEventListener('click', () => sim.start());
            if (stopBtn) stopBtn.addEventListener('click', () => sim.stop());
            if (resetBtn) resetBtn.addEventListener('click', () => sim.reset());
        }
        
        // Auto-start
        sim.draw();
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhysicsSimulation;
}
