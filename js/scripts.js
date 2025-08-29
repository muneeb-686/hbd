/**
 * Modern Birthday Wishes Interactive Experience
 * Enhanced JavaScript with smooth animations and interactions
 */

class BirthdayExperience {
    constructor() {
        this.state = {
            isLoaded: false,
            isMusicPlaying: false,
            confettiActive: false,
            currentSection: 'home'
        };
        
        this.elements = {};
        this.animations = new Map();
        this.observers = [];
        
        this.init();
    }

    /**
     * Initialize the birthday experience
     */
    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.initIntersectionObserver();
        this.handleLoading();
        this.createFloatingElements();
        
        console.log('🎉 Birthday Experience initialized!');
    }

    /**
     * Cache DOM elements for better performance
     */
    cacheElements() {
        this.elements = {
            // Core elements
            loadingScreen: document.getElementById('loadingScreen'),
            navbar: document.getElementById('navbar'),
            mobileToggle: document.getElementById('mobileToggle'),
            
            // Interactive buttons
            celebrateBtn: document.getElementById('celebrateBtn'),
            wishesBtn: document.getElementById('wishesBtn'),
            confettiBtn: document.getElementById('confettiBtn'),
            musicBtn: document.getElementById('musicBtn'),
            playButton: document.getElementById('playButton'),
            
            // Visual elements
            confettiBurst: document.getElementById('confettiBurst'),
            confettiArea: document.getElementById('confettiArea'),
            musicPlayer: document.getElementById('musicPlayer'),
            equalizer: document.querySelector('.equalizer'),
            
            // Navigation
            navLinks: document.querySelectorAll('.nav-link'),
            sections: document.querySelectorAll('section[id]'),
            
            // Animation targets
            wishCards: document.querySelectorAll('.wish-card'),
            celebrationCards: document.querySelectorAll('.celebration-card'),
            memoryItems: document.querySelectorAll('.memory-item'),
            cake: document.querySelector('.cake'),
            balloons: document.querySelectorAll('.balloon'),
            candles: document.querySelectorAll('.flame')
        };
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Button interactions
        this.elements.celebrateBtn?.addEventListener('click', () => this.triggerMainCelebration());
        this.elements.wishesBtn?.addEventListener('click', () => this.scrollToSection('wishes'));
        this.elements.confettiBtn?.addEventListener('click', () => this.launchConfetti());
        this.elements.musicBtn?.addEventListener('click', () => this.toggleMusic());
        this.elements.playButton?.addEventListener('click', () => this.toggleMusic());

        // Navigation
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Mobile menu
        this.elements.mobileToggle?.addEventListener('click', () => this.toggleMobileMenu());

        // Scroll handling with throttle
        this.addScrollListener();

        // Keyboard interactions
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Window events
        window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));
        window.addEventListener('beforeunload', () => this.cleanup());

        // Interactive cake candles
        this.elements.candles.forEach((flame, index) => {
            flame.addEventListener('click', () => this.blowOutCandle(flame, index));
        });

        // Card hover effects
        this.setupCardInteractions();
    }

    /**
     * Handle loading screen with enhanced animation
     */
    handleLoading() {
        // Simulate loading time
        setTimeout(() => {
            this.elements.loadingScreen?.classList.add('hidden');
            this.state.isLoaded = true;
            document.body.classList.remove('no-scroll');
            
            // Trigger welcome animation
            setTimeout(() => this.playWelcomeAnimation(), 500);
        }, 0);
    }

    /**
     * Play welcome animation sequence
     */
    playWelcomeAnimation() {
        // Animate cake candles
        this.animateCakeCandles();
        
        // Float balloons
        this.animateBalloons();
        
        // Create welcome particles
        this.createWelcomeParticles();
    }

    /**
     * Set up intersection observer for scroll animations
     */
    initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        // Section observer for navigation
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.updateActiveNavigation(entry.target.id);
                }
            });
        }, observerOptions);

        // Animation observer for cards and elements
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe sections
        this.elements.sections.forEach(section => {
            sectionObserver.observe(section);
        });

        // Observe animated elements
        [...this.elements.wishCards, ...this.elements.celebrationCards, ...this.elements.memoryItems].forEach(el => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                animationObserver.observe(el);
            }
        });

        this.observers.push(sectionObserver, animationObserver);
    }

    /**
     * Handle scroll events with navbar effects
     */
    addScrollListener() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    
                    // Update navbar appearance
                    if (scrollY > 50) {
                        this.elements.navbar?.classList.add('scrolled');
                    } else {
                        this.elements.navbar?.classList.remove('scrolled');
                    }
                    
                    // Parallax effect for floating elements
                    this.updateParallax(scrollY);
                    
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    /**
     * Update parallax effects
     */
    updateParallax(scrollY) {
        const balloons = document.querySelectorAll('.balloon');
        const hearts = document.querySelectorAll('.heart');
        
        balloons.forEach((balloon, index) => {
            const speed = 0.2 + (index * 0.1);
            balloon.style.transform += ` translateY(${scrollY * speed}px)`;
        });
        
        hearts.forEach((heart, index) => {
            const speed = 0.1 + (index * 0.05);
            heart.style.transform += ` translateY(${scrollY * speed}px)`;
        });
    }

    /**
     * Handle navigation clicks
     */
    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href')?.substring(1);
        if (targetId) {
            this.scrollToSection(targetId);
        }
    }

    /**
     * Smooth scroll to section
     */
    scrollToSection(sectionId) {
        const target = document.getElementById(sectionId);
        if (target) {
            const offset = 80; // Account for fixed navbar
            const targetPosition = target.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    /**
     * Update active navigation
     */
    updateActiveNavigation(activeId) {
        this.elements.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
        
        this.state.currentSection = activeId;
    }

    /**
     * Trigger main celebration with multiple effects
     */
    triggerMainCelebration() {
        // Create ripple effect
        this.createRippleEffect(this.elements.celebrateBtn);
        
        // Launch confetti
        this.launchConfetti();
        
        // Animate cake
        this.celebrateCake();
        
        // Animate balloons
        this.animateBalloons();
        
        // Play celebration sound (visual feedback)
        this.visualCelebrationSound();
        
        // Scroll to wishes section after animation
        setTimeout(() => {
            this.scrollToSection('wishes');
        }, 1500);
    }

    /**
     * Launch confetti with enhanced physics
     */
    launchConfetti() {
        if (this.state.confettiActive) return;
        
        this.state.confettiActive = true;
        const colors = ['#667eea', '#764ba2', '#f093fb', '#fa709a', '#4facfe', '#fee140'];
        const confettiCount = 150;
        const container = this.elements.confettiBurst || this.elements.confettiArea;
        
        if (!container) return;

        // Clear existing confetti
        container.innerHTML = '';

        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                this.createConfettiPiece(colors, container);
            }, i * 15);
        }

        // Reset confetti state
        setTimeout(() => {
            this.state.confettiActive = false;
            container.innerHTML = '';
        }, 4000);

        // Create ripple effect
        this.createRippleEffect(this.elements.confettiBtn);
    }

    /**
     * Create individual confetti piece with physics
     */
    createConfettiPiece(colors, container) {
        const confetti = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 8 + 4;
        const startX = Math.random() * (container.offsetWidth || window.innerWidth);
        const duration = Math.random() * 2 + 3;
        const rotation = Math.random() * 360;
        
        confetti.style.cssText = `
            position: absolute;
            top: -10px;
            left: ${startX}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            pointer-events: none;
            transform: rotate(${rotation}deg);
            animation: confettiDrop ${duration}s linear forwards;
            z-index: 1000;
        `;

        container.appendChild(confetti);

        // Clean up after animation
        setTimeout(() => {
            confetti.remove();
        }, duration * 1000);
    }

    /**
     * Toggle music with visual effects
     */
    toggleMusic() {
        this.state.isMusicPlaying = !this.state.isMusicPlaying;
        const button = this.elements.musicBtn;
        const playButton = this.elements.playButton;
        const equalizer = this.elements.equalizer;

        if (this.state.isMusicPlaying) {
            // Update button text
            if (button) {
                button.innerHTML = '<i class="fas fa-stop"></i><span>Stop Music</span>';
            }
            
            // Update play button
            if (playButton) {
                playButton.innerHTML = '<i class="fas fa-pause"></i>';
            }
            
            // Start visualizer
            equalizer?.classList.add('active');
            this.startMusicVisualization();
            
        } else {
            // Reset button text
            if (button) {
                button.innerHTML = '<i class="fas fa-music"></i><span>Play Music</span>';
            }
            
            // Reset play button
            if (playButton) {
                playButton.innerHTML = '<i class="fas fa-play"></i>';
            }
            
            // Stop visualizer
            equalizer?.classList.remove('active');
            this.stopMusicVisualization();
        }

        // Create ripple effect
        this.createRippleEffect(button || playButton);
    }

    /**
     * Start music visualization
     */
    startMusicVisualization() {
        const bars = document.querySelectorAll('.equalizer .bar');
        
        const animateBars = () => {
            bars.forEach(bar => {
                const height = Math.random() * 40 + 20;
                bar.style.height = `${height}px`;
            });
        };

        // Start animation loop
        this.musicInterval = setInterval(animateBars, 200);
    }

    /**
     * Stop music visualization
     */
    stopMusicVisualization() {
        if (this.musicInterval) {
            clearInterval(this.musicInterval);
            this.musicInterval = null;
        }

        // Reset bars to default height
        const bars = document.querySelectorAll('.equalizer .bar');
        bars.forEach(bar => {
            bar.style.height = '20px';
        });
    }

    /**
     * Animate cake for celebration
     */
    celebrateCake() {
        const cake = this.elements.cake;
        if (!cake) return;

        cake.style.animation = 'none';
        setTimeout(() => {
            cake.style.animation = 'bounce 0.6s ease-in-out 3';
        }, 10);

        // Make candles flicker more intensely
        this.elements.candles.forEach(flame => {
            flame.style.animationDuration = '0.3s';
        });

        // Reset candle animation after celebration
        setTimeout(() => {
            this.elements.candles.forEach(flame => {
                flame.style.animationDuration = '0.6s';
            });
        }, 2000);
    }

    /**
     * Animate balloons floating
     */
    animateBalloons() {
        this.elements.balloons.forEach((balloon, index) => {
            setTimeout(() => {
                balloon.style.transform = `translateY(-30px) scale(1.1)`;
                balloon.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                
                setTimeout(() => {
                    balloon.style.transform = '';
                }, 800);
            }, index * 200);
        });
    }

    /**
     * Animate cake candles on load
     */
    animateCakeCandles() {
        this.elements.candles.forEach((flame, index) => {
            setTimeout(() => {
                flame.style.animationDelay = `${Math.random() * 0.5}s`;
                flame.style.animationDuration = `${0.4 + Math.random() * 0.4}s`;
            }, index * 100);
        });
    }

    /**
     * Blow out candle interaction
     */
    blowOutCandle(flame, index) {
        flame.style.opacity = '0';
        flame.style.transform = 'translateX(-50%) scale(0)';
        
        // Create smoke effect
        this.createSmokeEffect(flame);
        
        // Relight after 2 seconds
        setTimeout(() => {
            flame.style.opacity = '1';
            flame.style.transform = 'translateX(-50%) scale(1)';
        }, 2000);
    }

    /**
     * Create smoke effect when candle is blown out
     */
    createSmokeEffect(flame) {
        const smoke = document.createElement('div');
        const rect = flame.getBoundingClientRect();
        
        smoke.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width/2}px;
            top: ${rect.top}px;
            width: 4px;
            height: 4px;
            background: rgba(150, 150, 150, 0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: smokeRise 1s ease-out forwards;
        `;

        document.body.appendChild(smoke);

        // Remove smoke after animation
        setTimeout(() => smoke.remove(), 1000);
    }

    /**
     * Create ripple effect on button click
     */
    createRippleEffect(button) {
        if (!button) return;

        const ripple = document.createElement('div');
        const rect = button.getBoundingClientRect();
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: 50%;
            top: 50%;
            width: 20px;
            height: 20px;
            margin-left: -10px;
            margin-top: -10px;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    /**
     * Visual celebration sound effect
     */
    visualCelebrationSound() {
        const soundWaves = document.createElement('div');
        soundWaves.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 100px;
            height: 100px;
            border: 3px solid rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            pointer-events: none;
            z-index: 1000;
            animation: soundWave 1s ease-out forwards;
        `;

        document.body.appendChild(soundWaves);

        // Create multiple sound wave rings
        for (let i = 1; i <= 3; i++) {
            setTimeout(() => {
                const wave = soundWaves.cloneNode();
                wave.style.animationDelay = `${i * 0.2}s`;
                document.body.appendChild(wave);
                
                setTimeout(() => wave.remove(), 1500);
            }, i * 200);
        }

        setTimeout(() => soundWaves.remove(), 1500);
    }

    /**
     * Create welcome particles
     */
    createWelcomeParticles() {
        const particleCount = 30;
        const container = document.querySelector('.hero-section');
        
        if (!container) return;

        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                this.createFloatingParticle(container);
            }, i * 100);
        }
    }

    /**
     * Create individual floating particle
     */
    createFloatingParticle(container) {
        const particle = document.createElement('div');
        const colors = ['#667eea', '#764ba2', '#f093fb', '#fa709a', '#4facfe'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 6 + 2;
        const startX = Math.random() * 100;
        const duration = Math.random() * 8 + 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            left: ${startX}%;
            top: 100%;
            opacity: 0.7;
            pointer-events: none;
            animation: particleFloat ${duration}s linear infinite;
            z-index: 1;
        `;

        container.appendChild(particle);

        // Remove after several cycles
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, duration * 2000);
    }

    /**
     * Create floating elements continuously
     */
    createFloatingElements() {
        // Create heart particles periodically
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance every interval
                this.createRandomHeart();
            }
        }, 3000);

        // Create star particles
        setInterval(() => {
            if (Math.random() < 0.2) { // 20% chance
                this.createRandomStar();
            }
        }, 4000);
    }

    /**
     * Create random heart particle
     */
    createRandomHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart-particle';
        
        heart.style.cssText = `
            position: fixed;
            width: 15px;
            height: 15px;
            background: #fa709a;
            transform: rotate(45deg);
            left: ${Math.random() * 100}vw;
            top: 100vh;
            pointer-events: none;
            z-index: 1;
            opacity: 0.6;
            animation: heartFloat 6s linear forwards;
        `;

        // Create heart shape
        heart.innerHTML = `
            <div style="
                position: absolute;
                width: 15px;
                height: 15px;
                background: #fa709a;
                border-radius: 50%;
                top: -7.5px;
                left: 0;
            "></div>
            <div style="
                position: absolute;
                width: 15px;
                height: 15px;
                background: #fa709a;
                border-radius: 50%;
                top: 0;
                left: -7.5px;
            "></div>
        `;

        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 6000);
    }

    /**
     * Create random star particle
     */
    createRandomStar() {
        const star = document.createElement('div');
        star.innerHTML = '✨';
        
        star.style.cssText = `
            position: fixed;
            font-size: 20px;
            left: ${Math.random() * 100}vw;
            top: 100vh;
            pointer-events: none;
            z-index: 1;
            opacity: 0.8;
            animation: starFloat 8s linear forwards;
        `;

        document.body.appendChild(star);
        setTimeout(() => star.remove(), 8000);
    }

    /**
     * Setup card interaction effects
     */
    setupCardInteractions() {
        // Add hover effects to wish cards
        this.elements.wishCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-12px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });

        // Add click effects to celebration cards
        this.elements.celebrationCards.forEach(card => {
            card.addEventListener('click', () => {
                this.createRippleEffect(card);
            });
        });
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboard(e) {
        switch (e.key) {
            case ' ':
                if (e.target === document.body) {
                    e.preventDefault();
                    this.triggerMainCelebration();
                }
                break;
            case 'c':
            case 'C':
                if (e.ctrlKey || e.metaKey) break; // Don't interfere with copy
                this.launchConfetti();
                break;
            case 'm':
            case 'M':
                this.toggleMusic();
                break;
            case 'Escape':
                if (this.state.isMusicPlaying) {
                    this.toggleMusic();
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                window.scrollBy(0, -100);
                break;
            case 'ArrowDown':
                e.preventDefault();
                window.scrollBy(0, 100);
                break;
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Recalculate particle positions
        const particles = document.querySelectorAll('.floating-heart-particle, [style*="particleFloat"]');
        particles.forEach(particle => {
            if (particle.parentNode) {
                particle.remove();
            }
        });
    }

    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.toggle('mobile-active');
        }
    }

    /**
     * Utility: Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Clean up resources
     */
    cleanup() {
        // Clear intervals
        if (this.musicInterval) {
            clearInterval(this.musicInterval);
        }

        // Disconnect observers
        this.observers.forEach(observer => observer.disconnect());

        // Clear animations
        this.animations.clear();
        
        // Remove dynamic particles
        const particles = document.querySelectorAll('.floating-heart-particle, [style*="particleFloat"]');
        particles.forEach(particle => particle.remove());
    }
}

/**
 * Enhanced CSS Animations (added via JavaScript)
 */
function injectAdditionalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        @keyframes smokeRise {
            0% {
                opacity: 0.6;
                transform: translateY(0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-30px) scale(1.5);
            }
        }

        @keyframes soundWave {
            0% {
                transform: translate(-50%, -50%) scale(0);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) scale(3);
                opacity: 0;
            }
        }

        @keyframes particleFloat {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.7;
            }
            90% {
                opacity: 0.7;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }

        @keyframes heartFloat {
            0% {
                transform: translateY(0) rotate(45deg);
                opacity: 0.6;
            }
            50% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(405deg);
                opacity: 0;
            }
        }

        @keyframes starFloat {
            0% {
                transform: translateY(0) scale(1);
                opacity: 0.8;
            }
            50% {
                transform: translateY(-50vh) scale(1.2);
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) scale(0.8);
                opacity: 0;
            }
        }

        /* Mobile menu styles */
        @media (max-width: 768px) {
            .nav-menu {
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(20px);
                flex-direction: column;
                padding: var(--space-md);
                box-shadow: var(--shadow-lg);
                transform: translateY(-10px);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .nav-menu.mobile-active {
                display: flex;
                transform: translateY(0);
                opacity: 1;
                visibility: visible;
            }

            .mobile-toggle.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }

            .mobile-toggle.active span:nth-child(2) {
                opacity: 0;
            }

            .mobile-toggle.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }

        /* Focus indicators */
        button:focus,
        a:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
            .btn {
                border: 2px solid;
            }
            
            .wish-card {
                border: 2px solid var(--gray-dark);
            }
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Initialize everything when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Inject additional styles
    injectAdditionalStyles();
    
    // Initialize the birthday experience
    const birthdayApp = new BirthdayExperience();
    
    // Make available globally for debugging
    window.birthdayApp = birthdayApp;
    
    // Add some fun console messages
    console.log('%c🎉 Welcome to the Birthday Celebration! 🎂', 
        'color: #667eea; font-size: 16px; font-weight: bold;');
    console.log('%cKeyboard shortcuts:', 'color: #764ba2; font-weight: bold;');
    console.log('• Spacebar: Start celebration');
    console.log('• C: Launch confetti');
    console.log('• M: Toggle music');
    console.log('• Esc: Stop music');
    console.log('• Arrow keys: Scroll up/down');
});

/**
 * Handle visibility change for performance
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.birthdayApp?.state.isMusicPlaying) {
        window.birthdayApp.toggleMusic();
    }
});

/**
 * Service worker registration (if available)
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        console.log('🌐 Ready for PWA enhancement');
    });
}