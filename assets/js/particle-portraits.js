/**
 * Particle Portrait System
 * Creates animated portraits of famous physicists using particle effects
 */

class ParticlePortrait {
    constructor(containerId, imageUrl, physicistName) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        this.imageUrl = imageUrl;
        this.physicistName = physicistName;
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 100 };
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        // Set canvas size
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Remove mouse/touch interactions to keep particles floating freely
        
        // Load image and create particles
        this.loadImage();
    }
    
    resize() {
        const containerRect = this.container.getBoundingClientRect();
        this.canvas.width = containerRect.width;
        this.canvas.height = containerRect.height;
    }
    
    loadImage() {
        const img = new Image();
        // Remove crossOrigin for local images
        
        img.onload = () => {
            console.log('Image loaded successfully:', this.imageUrl);
            this.createParticles(img);
            this.animate();
        };
        
        img.onerror = (error) => {
            console.error('Image failed to load:', this.imageUrl, error);
            // Fallback to text-based particles if image fails
            this.createTextParticles();
            this.animate();
        };
        
        // Use relative path without leading slash for local files
        img.src = this.imageUrl.startsWith('/') ? this.imageUrl.substring(1) : this.imageUrl;
    }
    
    createParticles(img) {
        // Clear existing particles
        this.particles = [];
        
        // Create temporary canvas for image processing
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        // Scale image to fit canvas
        const scale = Math.min(
            this.canvas.width / img.width,
            this.canvas.height / img.height
        ) * 0.9; // Make it larger to fill more space
        
        const width = Math.floor(img.width * scale);
        const height = Math.floor(img.height * scale);
        
        tempCanvas.width = width;
        tempCanvas.height = height;
        
        // Draw and get image data
        tempCtx.drawImage(img, 0, 0, width, height);
        const imageData = tempCtx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        // Calculate offsets to center the image
        const offsetX = (this.canvas.width - width) / 2;
        const offsetY = (this.canvas.height - height) / 2;
        
        // Sample pixels and create particles
        const gap = 4; // Good balance for particle density
        for (let y = 0; y < height; y += gap) {
            for (let x = 0; x < width; x += gap) {
                const index = (y * width + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                const a = data[index + 3];
                
                if (a > 128) { // Only create particle if pixel is visible
                    this.particles.push(new Particle(
                        x + offsetX,
                        y + offsetY,
                        `rgba(${r}, ${g}, ${b}, ${a / 255})`, // Real colors from image
                        2
                    ));
                }
            }
        }
        
        console.log(`Created ${this.particles.length} particles from image`);
    }
    
    createTextParticles() {
        // Fallback: Create particles from physicist name
        this.ctx.font = 'bold 60px Inter';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Clear canvas and draw text
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillText(this.physicistName, this.canvas.width / 2, this.canvas.height / 2);
        
        // Get text pixels
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        // Create particles from text
        const gap = 3;
        for (let y = 0; y < this.canvas.height; y += gap) {
            for (let x = 0; x < this.canvas.width; x += gap) {
                const index = (y * this.canvas.width + x) * 4;
                const a = data[index + 3];
                
                if (a > 128) {
                    const hue = (x / this.canvas.width) * 360;
                    this.particles.push(new Particle(
                        x,
                        y,
                        `hsl(${hue}, 70%, 50%)`,
                        2
                    ));
                }
            }
        }
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.particles = [];
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

class Particle {
    constructor(x, y, color, size) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.density = Math.random() * 30 + 1;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = (Math.random() - 0.5) * 0.02;
        this.floatRadius = Math.random() * 3 + 2;
    }
    
    update(mouse) {
        // Random floating movement (like atoms)
        this.angle += this.angleSpeed;
        
        // Apply random floating motion
        const floatX = Math.cos(this.angle) * this.floatRadius;
        const floatY = Math.sin(this.angle) * this.floatRadius;
        
        // Add some random velocity changes
        this.vx += (Math.random() - 0.5) * 0.1;
        this.vy += (Math.random() - 0.5) * 0.1;
        
        // Return to base position with weak spring physics
        const returnSpeed = 0.02;
        this.vx += (this.baseX + floatX - this.x) * returnSpeed;
        this.vy += (this.baseY + floatY - this.y) * returnSpeed;
        
        // Apply friction
        this.vx *= 0.95;
        this.vy *= 0.95;
        
        // Limit maximum velocity
        const maxVel = 2;
        if (Math.abs(this.vx) > maxVel) this.vx = maxVel * Math.sign(this.vx);
        if (Math.abs(this.vy) > maxVel) this.vy = maxVel * Math.sign(this.vy);
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

// Physicist data
const physicists = [
    {
        name: 'Albert Einstein',
        image: 'assets/images/physicists/einstein.jpg',
        quote: 'Imagination is more important than knowledge.'
    },
    {
        name: 'Isaac Newton',
        image: 'assets/images/physicists/newton.jpg',
        quote: 'If I have seen further, it is by standing on the shoulders of giants.'
    },
    {
        name: 'Marie Curie',
        image: 'assets/images/physicists/curie.jpg',
        quote: 'Nothing in life is to be feared, it is only to be understood.'
    },
    {
        name: 'Richard Feynman',
        image: 'assets/images/physicists/feynman.jpg',
        quote: 'Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.'
    },
    {
        name: 'Niels Bohr',
        image: 'assets/images/physicists/bohr.jpg',
        quote: 'Prediction is very difficult, especially about the future.'
    },
    {
        name: 'Stephen Hawking',
        image: 'assets/images/physicists/hawking.jpg',
        quote: 'Intelligence is the ability to adapt to change.'
    }
];

// Initialize particle portraits when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.particle-hero');
    if (heroSection) {
        let currentPhysicist = 0;
        let portrait = null;
        
        function showNextPhysicist() {
            if (portrait) {
                portrait.destroy();
            }
            
            const physicist = physicists[currentPhysicist];
            portrait = new ParticlePortrait('particle-portrait', physicist.image, physicist.name);
            
            // Update quote
            const quoteElement = document.getElementById('physicist-quote');
            if (quoteElement) {
                quoteElement.innerHTML = `
                    <blockquote>
                        "${physicist.quote}"
                        <cite>— ${physicist.name}</cite>
                    </blockquote>
                `;
            }
            
            currentPhysicist = (currentPhysicist + 1) % physicists.length;
        }
        
        // Show first physicist
        showNextPhysicist();
        
        // Rotate physicists every 10 seconds
        setInterval(showNextPhysicist, 10000);
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ParticlePortrait, Particle };
}
