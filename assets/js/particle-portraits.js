/**
 * Optimized Particle Portrait System
 * Creates animated portraits of famous physicists using efficient particle effects
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
        this._observer = null;
        this._onResize = null;
        this.prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Performance optimizations
        this.isVisible = true;
        this.frameCount = 0;
        this.targetFPS = this.prefersReducedMotion ? 24 : 30; // Reduced from 60fps
        this.fpsInterval = 1000 / this.targetFPS;
        this.lastFrameTime = 0;
        
        this.init();
    }
    
    init() {
        // Set canvas size
    this.resize();
    this._onResize = () => this.resize();
    window.addEventListener('resize', this._onResize);
        
        // Add visibility detection
        this.setupVisibilityObserver();
        
        // Load image and create particles
        this.loadImage();
    }
    
    setupVisibilityObserver() {
        if ('IntersectionObserver' in window) {
            this._observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    this.isVisible = entry.isIntersecting;
                });
            });
            this._observer.observe(this.container);
        }
    }
    
    resize() {
    const dpr = Math.max(window.devicePixelRatio || 1, 1);
    this.dpr = dpr;
    const rect = this.container.getBoundingClientRect();
    this.cssWidth = Math.floor(rect.width);
    this.cssHeight = Math.floor(rect.height);
    // Set CSS size
    this.canvas.style.width = this.cssWidth + 'px';
    this.canvas.style.height = this.cssHeight + 'px';
    // Set backing store size for crisp rendering
    this.canvas.width = Math.floor(this.cssWidth * dpr);
    this.canvas.height = Math.floor(this.cssHeight * dpr);
    // Map 1 unit to 1 CSS pixel
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    
    loadImage() {
        const img = new Image();
        
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
        
        // Scale image to fit visible CSS canvas size - show full portrait
        const cssW = this.cssWidth || this.canvas.getBoundingClientRect().width;
        const cssH = this.cssHeight || this.canvas.getBoundingClientRect().height;
        const scale = Math.min(cssW / img.width, cssH / img.height) * 0.9; // show most without cropping
        
        const width = Math.floor(img.width * scale);
        const height = Math.floor(img.height * scale);
        
        tempCanvas.width = width;
        tempCanvas.height = height;
        
        // Draw image normally without heavy processing
        tempCtx.drawImage(img, 0, 0, width, height);
        const imageData = tempCtx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
    // Calculate offsets to center the image in CSS pixels
    const offsetX = (cssW - width) / 2;
    const offsetY = (cssH - height) / 2;
        
        // Dynamic sampling gap to target a particle budget for efficiency
        const targetParticles = this.prefersReducedMotion ? 8000 : 12000;
        const area = width * height;
        let gap = Math.max(2, Math.round(Math.sqrt(area / targetParticles)));
        gap = Math.min(gap, 5); // clamp upper bound
        const sizeScale = gap / 2; // keep coverage consistent

        // Cache key by image and scale/gap
        const cacheKey = `${this.imageUrl}|${width}x${height}|g${gap}`;
        const cached = ParticlePortrait.cache.get(cacheKey);
        if (cached) {
            // Rehydrate cached particle data
            for (let i = 0; i < cached.length; i++) {
                const p = cached[i];
                this.particles.push(new Particle(p.x + offsetX, p.y + offsetY, p.color, p.size));
            }
            console.log(`Loaded ${this.particles.length} particles from cache`);
            return;
        }

        const raw = [];
        for (let y = 0; y < height; y += gap) {
            for (let x = 0; x < width; x += gap) {
                const index = (y * width + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                const a = data[index + 3];
                if (a > 100) {
                    const brightness = (r + g + b) / 3;
                    const base = brightness < 120 ? 3.2 : 2.4;
                    const size = base * sizeScale;
                    const color = `rgb(${r}, ${g}, ${b})`;
                    const px = x; // offset applied on rehydrate to allow reuse across positions
                    const py = y;
                    raw.push({ x: px, y: py, color, size });
                    this.particles.push(new Particle(px + offsetX, py + offsetY, color, size));
                }
            }
        }
        ParticlePortrait.cache.set(cacheKey, raw);
        console.log(`Created ${this.particles.length} particles from image (gap=${gap})`);
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
        const gap = 4;
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
    
    animate(currentTime = 0) {
        // Only animate if visible and enough time has passed
        if (!this.isVisible || currentTime - this.lastFrameTime < this.fpsInterval) {
            this.animationId = requestAnimationFrame((time) => this.animate(time));
            return;
        }

    this.lastFrameTime = currentTime;
    // Clear using CSS pixel dimensions (transform already maps units)
    this.ctx.clearRect(0, 0, this.cssWidth || this.canvas.width, this.cssHeight || this.canvas.height);
        
        // Only update every 2nd frame to reduce CPU usage
        const shouldUpdate = this.frameCount % 2 === 0;
        
        // Update and draw particles
        this.particles.forEach(particle => {
            if (shouldUpdate) particle.update(this.mouse);
            particle.draw(this.ctx);
        });
        
        this.frameCount++;
        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.particles = [];
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        if (this._onResize) {
            window.removeEventListener('resize', this._onResize);
            this._onResize = null;
        }
        if (this._observer) {
            this._observer.disconnect();
            this._observer = null;
        }
    }
}

// Static cache map
ParticlePortrait.cache = new Map();

class Particle {
    constructor(x, y, color, size) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.density = Math.random() * 30 + 1;
        this.vx = (Math.random() - 0.5) * 0.4; // Increased movement
        this.vy = (Math.random() - 0.5) * 0.4;
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = (Math.random() - 0.5) * 0.02; // More rotation
        this.floatRadius = Math.random() * 1.2 + 0.8; // Larger float radius
    }
    
    update(mouse) {
        // Random floating movement (like atoms)
        this.angle += this.angleSpeed;
        
        // Apply random floating motion
        const floatX = Math.cos(this.angle) * this.floatRadius;
        const floatY = Math.sin(this.angle) * this.floatRadius;
        
        // Reduced random velocity changes for more lively movement
        this.vx += (Math.random() - 0.5) * 0.03; // Increased from 0.02
        this.vy += (Math.random() - 0.5) * 0.03;
        
        // Return to base position with spring physics
        const returnSpeed = 0.06; // Slightly faster return
        this.vx += (this.baseX + floatX - this.x) * returnSpeed;
        this.vy += (this.baseY + floatY - this.y) * returnSpeed;
        
        // Apply friction
        this.vx *= 0.96; // Less friction for more movement
        this.vy *= 0.96;
        
        // Limit maximum velocity
        const maxVel = 1.2; // Increased max velocity
        if (Math.abs(this.vx) > maxVel) this.vx = maxVel * Math.sign(this.vx);
        if (Math.abs(this.vy) > maxVel) this.vy = maxVel * Math.sign(this.vy);
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
    }
    
    draw(ctx) {
        // Add subtle glow to particles
        if (this.size > 3.5) {
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 3;
        }
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        
        // Reset shadow for performance
        if (this.size > 3.5) {
            ctx.shadowBlur = 0;
        }
    }
}

// Physicist data
const physicists = [
    {
        name: 'Albert Einstein',
        image: 'assets/images/physicists/einstein.jpg',
        quote: 'Imagination is more important than knowledge.',
        quotes: [
            'Imagination is more important than knowledge.',
            'Life is like riding a bicycle. To keep your balance, you must keep moving.',
            'The important thing is not to stop questioning.',
            'In the middle of difficulty lies opportunity.'
        ]
    },
    {
        name: 'Isaac Newton',
        image: 'assets/images/physicists/newton.jpg',
        quote: 'If I have seen further, it is by standing on the shoulders of giants.',
        quotes: [
            'If I have seen further, it is by standing on the shoulders of giants.',
            'What we know is a drop, what we don’t know is an ocean.',
            'Truth is ever to be found in the simplicity, and not in the multiplicity and confusion of things.',
            'Tact is the art of making a point without making an enemy.'
        ]
    },
    {
        name: 'Marie Curie',
        image: 'assets/images/physicists/curie.jpg',
        quote: 'Nothing in life is to be feared, it is only to be understood.',
        quotes: [
            'Nothing in life is to be feared, it is only to be understood.',
            'Be less curious about people and more curious about ideas.',
            'I was taught that the way of progress was neither swift nor easy.'
        ]
    },
    {
        name: 'Richard Feynman',
        image: 'assets/images/physicists/feynman.jpg',
        quote: 'Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.',
        quotes: [
            'What I cannot create, I do not understand.',
            'The first principle is that you must not fool yourself—and you are the easiest person to fool.',
            'Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.'
        ]
    },
    {
        name: 'Niels Bohr',
        image: 'assets/images/physicists/bohr.jpg',
        quote: 'Prediction is very difficult, especially about the future.',
        quotes: [
            'Prediction is very difficult, especially about the future.',
            'An expert is a man who has made all the mistakes which can be made in a very narrow field.',
            'How wonderful that we have met with a paradox. Now we have some hope of making progress.'
        ]
    },
    {
        name: 'Stephen Hawking',
        image: 'assets/images/physicists/hawking.jpg',
        quote: 'Intelligence is the ability to adapt to change.',
        quotes: [
            'Intelligence is the ability to adapt to change.',
            'However difficult life may seem, there is always something you can do and succeed at.',
            'Quiet people have the loudest minds.'
        ]
    }
];

// Initialize particle portraits when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.particle-hero');
    if (heroSection) {
        let currentPhysicist = 0;
        let portrait = null;
        
        // Create portrait container if it doesn't exist (centered with quote)
        let portraitContainer = document.getElementById('particle-portrait');
        if (!portraitContainer) {
            portraitContainer = document.createElement('div');
            portraitContainer.id = 'particle-portrait';
            // Let CSS control size/position; insert into right column if present
            const rightCol = heroSection.querySelector('.particle-hero-content > div:last-child');
            (rightCol || heroSection).appendChild(portraitContainer);
        }
        
        // Create quote container if it doesn't exist (directly below portrait)
        let quoteContainer = document.getElementById('physicist-quote');
        if (!quoteContainer) {
            quoteContainer = document.createElement('div');
            quoteContainer.id = 'physicist-quote';
            const rightCol = heroSection.querySelector('.particle-hero-content > div:last-child');
            (rightCol || heroSection).appendChild(quoteContainer);
        }
        
        function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

        // Shuffle-bag to avoid immediate repeats across full rotation
        function createShuffleBag(items) {
            let bag = [];
            let idx = 0;
            let last = null;
            function shuffle() {
                bag = items.slice();
                for (let i = bag.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [bag[i], bag[j]] = [bag[j], bag[i]];
                }
                if (last && bag.length > 1 && bag[0] === last) {
                    const j = 1 + Math.floor(Math.random() * (bag.length - 1));
                    [bag[0], bag[j]] = [bag[j], bag[0]];
                }
                idx = 0;
            }
            shuffle();
            return {
                next() {
                    if (idx >= bag.length) shuffle();
                    last = bag[idx];
                    return bag[idx++];
                }
            };
        }

        const physicistBag = createShuffleBag(physicists);
        const lastQuoteByName = new Map();

        function showNextPhysicist() {
            const physicist = physicistBag.next();
            if (portrait) portrait.destroy();
            createNewPortrait(physicist);
        }
        
        function createNewPortrait(physicist) {
            portrait = new ParticlePortrait('particle-portrait', physicist.image, physicist.name);
            
            // Update quote
            const quoteElement = document.getElementById('physicist-quote');
            if (quoteElement) {
                const list = physicist.quotes || [physicist.quote];
                let q = list[0];
                if (list.length > 1) {
                    const last = lastQuoteByName.get(physicist.name);
                    const candidates = list.filter(s => s !== last);
                    q = pickRandom(candidates);
                    lastQuoteByName.set(physicist.name, q);
                }
                quoteElement.innerHTML = `
                    <blockquote style="margin: 0; font-size: 1.1rem; line-height: 1.6;">
                        "${q}"
                        <cite style="display: block; margin-top: 0.8rem; font-size: 0.95rem; color: #4F46E5; font-weight: 600;">— ${physicist.name}</cite>
                    </blockquote>
                `;
            }
        }
        
        // Show first physicist
        showNextPhysicist();
        
        // Rotate every 10–14s randomly; pause when tab hidden
        let intervalId;
        function scheduleNext() {
            const ms = 10000 + Math.random() * 4000;
            intervalId = setTimeout(() => { showNextPhysicist(); scheduleNext(); }, ms);
        }
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (intervalId) clearTimeout(intervalId);
            } else {
                scheduleNext();
            }
        });
        scheduleNext();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ParticlePortrait, Particle };
}
