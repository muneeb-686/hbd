/**
 * Professional Birthday Wishes Website
 * Main JavaScript functionality
 * 
 * Features:
 * - Smooth animations and interactions
 * - Confetti celebrations
 * - Music visualizer
 * - Responsive navigation
 * - Performance optimized
 */

class BirthdayWishApp {
    constructor() {
        this.init();
        this.bindEvents();
        this.setupIntersectionObserver();
    }

    /**
     * Initialize the application
     */
    init() {
        this.elements = {
            loadingScreen: document.getElementById('loadingScreen'),
            celebrateBtn: document.getElementById('celebrateBtn'),
            wishBtn: document.getElementById('wishBtn'),
            confettiBtn: document.getElementById('confettiBtn'),
            musicBtn: document.getElementById('musicBtn'),
            confettiContainer: document.getElementById('confettiContainer'),
            musicVisualizer: document.getElementById('musicVisualizer'),
            navLinks: document.querySelectorAll('.nav-link'),
            sections: document.querySelectorAll('section[id]')
        };

        this.state = {
            isLoading: true,
            isMusicPlaying: false,
            activeSection: 'home'
        };

        this.animations = {
            confettiAnimations: [],
            musicTimeout: null
        };

        // Remove loading screen after content loads
        this.hideLoadingScreen();
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Button interactions
        this.elements.celebrateBtn?.addEventListener('click', () => this.triggerCelebration());
        this.elements.wishBtn?.addEventListener('click', () => this.scrollToSection('wishes'));
        this.elements.confettiBtn?.addEventListener('click', () => this.launchConfetti());
        this.elements.musicBtn?.addEventListener('click', () => this.toggleMusicVisualizer());

        // Navigation
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Scroll event for navbar
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Resize event
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Keyboard interactions
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    /**
     * Setup Intersection Observer for scroll animations
     */
    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.updateActiveNavLink(entry.target.id);
                }
            });
        }, options);

        // Observe all sections
        this.elements.sections.forEach(section => {
            this.observer.observe(section);
        });

        // Observe cards and features for animations
        const animatedElements = document.querySelectorAll('.wish-card, .memory-feature');
        animatedElements.forEach(el => {
            this.observer.observe(el);
        });
    }

    /**
     * Hide loading screen with smooth transition
     */
    hideLoadingScreen() {
        setTimeout(() => {
            this.elements.loadingScreen.classList.add('hidden');
            this.state.isLoading = false;
            document.body.classList.remove('no-scroll');
            
            // Trigger initial animations
            setTimeout(() => {
                this.triggerInitialAnimations();
            }, 500);
        }, 2000);
    }

    /**
     * Trigger initial page animations
     */
    triggerInitialAnimations() {
        // Add floating particles to hero
        this.createFloatingParticles();
        
        // Animate cake candles
        this.animateCakeCandles();
    }

    /**
     * Handle navigation clicks
     */
    handleNavigation(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        this.scrollToSection(targetId);
    }

    /**
     * Smooth scroll to section
     */
    scrollToSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            const offset = 80; // Navbar height
            const targetPosition = targetSection.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    /**
     * Handle scroll events
     */
    handleScroll() {
        const scrollY = window.scrollY;
        const navbar = document.querySelector('.navbar');
        
        // Add/remove navbar shadow
        if (scrollY > 50) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        // Parallax effect for hero background
        const heroSection = document.querySelector('.hero-section');
        if (heroSection && scrollY < window.innerHeight) {
            const parallaxElements = heroSection.querySelectorAll('.floating-balloon');
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                element.style.transform = `translateY(${scrollY * speed}px)`;
            });
        }
    }

    /**
     * Update active navigation link
     */
    updateActiveNavLink(activeId) {
        this.elements.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
        this.state.activeSection = activeId;
    }

    /**
     * Trigger celebration with multiple effects
     */
    triggerCelebration() {
        // Launch confetti
        this.launchConfetti();
        
        // Add celebration class to cake
        const cake = document.querySelector('.birthday-cake');
        cake.classList.add('celebrating');
        
        // Create celebration ripple effect
        this.createRippleEffect(this.elements.celebrateBtn);
        
        // Animate balloons
        this.animateBalloons();
        
        // Reset cake animation
        setTimeout(() => {
            cake.classList.remove('celebrating');
        }, 2000);
    }

    /**
     * Launch confetti animation
     */
    launchConfetti() {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#4ecdc4', '#feca57', '#ff6b6b'];
        const confettiCount = 100;
        
        // Clear existing confetti
        this.animations.confettiAnimations.forEach(animation => {
            animation.remove();
        });
        this.animations.confettiAnimations = [];

        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                this.createConfettiPiece(colors);
            }, i * 20);
        }

        // Create ripple effect
        this.createRippleEffect(this.elements.confettiBtn);
    }

    /**
     * Create individual confetti piece
     */
    createConfettiPiece(colors) {
        const confetti = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 8 + 4;
        const startX = Math.random() * window.innerWidth;
        const animationDuration = Math.random() * 2 + 3;
        
        confetti.style.cssText = `
            position: fixed;
            top: -10px;
            left: ${startX}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            z-index: 10000;
            pointer-events: none;
            animation: confettiFall ${animationDuration}s linear forwards;
        `;

        document.body.appendChild(confetti);
        this.animations.confettiAnimations.push(confetti);

        // Remove confetti after animation
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.remove();
            }
        }, animationDuration * 1000);
    }

    /**
     * Toggle music visualizer
     */
    toggleMusicVisualizer() {
        this.state.isMusicPlaying = !this.state.isMusicPlaying;
        const button = this.elements.musicBtn;
        const visualizer = this.elements.musicVisualizer;

        if (this.state.isMusicPlaying) {
            button.innerHTML = '<i class="fas fa-stop"></i><span>Stop Music</span>';
            visualizer.classList.add('active');
            this.startMusicAnimation();
        } else {
            button.innerHTML = '<i class="fas fa-music"></i><span>Play Birthday Song</span>';
            visualizer.classList.remove('active');
            this.stopMusicAnimation();
        }

        this.createRippleEffect(button);
    }

    /**
     * Start music visualizer animation
     */
    startMusicAnimation() {
        const bars = this.elements.musicVisualizer.querySelectorAll('.music-bar');
        
        const animateBars = () => {
            bars.forEach(bar => {
                const height = Math.random() * 60 + 20;
                bar.style.height = `${height}px`;
            });
        };

        // Initial animation
        animateBars();
        
        // Continue animation while music is playing
        this.animations.musicTimeout = setInterval(animateBars, 200);
    }

    /**
     * Stop music visualizer animation
     */
    stopMusicAnimation() {
        if (this.animations.musicTimeout) {
            clearInterval(this.animations.musicTimeout);
            this.animations.musicTimeout = null;
        }

        // Reset bars to default height
        const bars = this.elements.musicVisualizer.querySelectorAll('.music-bar');
        bars.forEach(bar => {
            bar.style.height = '20px';
        });
    }

    /**
     * Create ripple effect on button click
     */
    createRippleEffect(button) {
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
            margin-left: -10px;
            margin-top: -10px;
            width: 20px;
            height: 20px;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * Animate floating balloons
     */
    animateBalloons() {
        const balloons = document.querySelectorAll('.floating-balloon');
        balloons.forEach((balloon, index) => {
            setTimeout(() => {
                balloon.style.transform = 'translateY(-30px) scale(1.1)';
                balloon.style.transition = 'all 0.5s ease';
                
                setTimeout(() => {
                    balloon.style.transform = '';
                }, 500);
            }, index * 200);
        });
    }

    /**
     * Animate cake candles
     */
    animateCakeCandles() {
        const candles = document.querySelectorAll('.birthday-cake .candle');
        candles.forEach((candle, index) => {
            setTimeout(() => {
                const flame = candle.querySelector('.flame');
                if (flame) {
                    flame.style.animationDuration = `${0.4 + Math.random() * 0.4}s`;
                }
            }, index * 100);
        });
    }

    /**
     * Create floating particles
     */
    createFloatingParticles() {
        const particlesContainer = document.querySelector('.hero-particles');
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                this.createFloatingParticle(particlesContainer);
            }, i * 300);
        }
    }

    /**
     * Create individual floating particle
     */
    createFloatingParticle(container) {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 2;
        const startX = Math.random() * 100;
        const animationDuration = Math.random() * 10 + 10;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            left: ${startX}%;
            top: 100%;
            animation: particleFloat ${animationDuration}s linear infinite;
        `;

        container.appendChild(particle);

        // Remove particle after several cycles
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, animationDuration * 3000);
    }

    /**
     * Handle keyboard interactions
     */
    handleKeyboard(e) {
        switch (e.key) {
            case ' ':
                if (e.target === document.body) {
                    e.preventDefault();
                    this.triggerCelebration();
                }
                break;
            case 'Enter':
                if (e.target.classList.contains('btn')) {
                    e.target.click();
                }
                break;
            case 'Escape':
                if (this.state.isMusicPlaying) {
                    this.toggleMusicVisualizer();
                }
                break;
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Recalculate positions and animations if needed
        if (this.state.isMusicPlaying) {
            this.stopMusicAnimation();
            this.startMusicAnimation();
        }
    }

    /**
     * Debounce utility function
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
     * Utility function to generate random numbers
     */
    random(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Clean up resources
     */
    destroy() {
        // Clear all timeouts and intervals
        if (this.animations.musicTimeout) {
            clearInterval(this.animations.musicTimeout);
        }

        // Remove all event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);

        // Disconnect observer
        if (this.observer) {
            this.observer.disconnect();
        }

        // Clear confetti animations
        this.animations.confettiAnimations.forEach(animation => {
            if (animation.parentNode) {
                animation.remove();
            }
        });
    }
}

/**
 * Enhanced interactions and effects
 */
class BirthdayEffects {
    static addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100vh) rotate(360deg);
                    opacity: 0;
                }
            }

            .birthday-cake.celebrating {
                animation: cakeShake 0.5s ease-in-out 4;
            }

            @keyframes cakeShake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }

            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }

            .wish-card,
            .memory-feature {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease;
            }

            .wish-card:nth-child(even) {
                transform: translateY(30px) translateX(-20px);
            }

            .wish-card:nth-child(odd) {
                transform: translateY(30px) translateX(20px);
            }

            .memory-feature:nth-child(even) {
                transform: translateY(30px) scale(0.95);
            }

            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    static initAccessibility() {
        // Add focus indicators
        const focusableElements = document.querySelectorAll('button, a, [tabindex]');
        focusableElements.forEach(el => {
            el.addEventListener('focus', () => {
                el.style.outline = '2px solid #667eea';
                el.style.outlineOffset = '2px';
            });
            
            el.addEventListener('blur', () => {
                el.style.outline = 'none';
            });
        });
    }
}

/**
 * Initialize application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Add custom styles
    BirthdayEffects.addCustomStyles();
    
    // Initialize accessibility features
    BirthdayEffects.initAccessibility();
    
    // Initialize main application
    const app = new BirthdayWishApp();
    
    // Make app globally available for debugging
    window.birthdayApp = app;
    
    console.log('🎉 Birthday Wishes App initialized successfully!');
});

/**
 * Handle page visibility changes
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.birthdayApp?.state.isMusicPlaying) {
        // Pause music visualizer when page is hidden
        window.birthdayApp.toggleMusicVisualizer();
    }
});

/**
 * Service Worker registration for PWA capabilities
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker would be registered here for PWA functionality
        console.log('🌐 Ready for PWA enhancement');
    });
}