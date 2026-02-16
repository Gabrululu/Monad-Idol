import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useGSAPAnimations = () => {
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        // Small delay to ensure DOM is ready
        setTimeout(() => {
            // Hero title animation
            const heroTitle = document.querySelector('.hero-title');
            if (heroTitle) {
                gsap.from(heroTitle, {
                    duration: 1,
                    y: -50,
                    opacity: 0,
                    ease: 'power3.out',
                    delay: 0.2,
                });
            }

            // Hero subtitle animation
            const heroSubtitles = document.querySelectorAll('.hero-subtitle');
            if (heroSubtitles.length > 0) {
                gsap.from(heroSubtitles, {
                    duration: 1,
                    y: 30,
                    opacity: 0,
                    ease: 'power3.out',
                    stagger: 0.2,
                    delay: 0.4,
                });
            }

            // Mascot entrance animation
            const mascot = document.querySelector('.mascot-container');
            if (mascot) {
                gsap.from(mascot, {
                    duration: 1.2,
                    scale: 0,
                    rotation: 360,
                    opacity: 0,
                    ease: 'elastic.out(1, 0.5)',
                    delay: 0.8,
                });

                // Continuous mascot float animation
                gsap.to(mascot, {
                    y: -15,
                    duration: 2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'power1.inOut',
                });

                // Mascot hover scale
                mascot.addEventListener('mouseenter', () => {
                    gsap.to('.mascot-image', {
                        scale: 1.15,
                        rotation: 10,
                        duration: 0.3,
                        ease: 'back.out(1.7)',
                    });
                });

                mascot.addEventListener('mouseleave', () => {
                    gsap.to('.mascot-image', {
                        scale: 1,
                        rotation: 0,
                        duration: 0.3,
                        ease: 'power2.out',
                    });
                });
            }

            // Welcome section animations
            const welcomeTitle = document.querySelector('.welcome-title');
            if (welcomeTitle) {
                gsap.from(welcomeTitle, {
                    duration: 1,
                    y: -30,
                    opacity: 0,
                    ease: 'power3.out',
                    delay: 0.3,
                });
            }

            // Rotating text animation
            const rotatingText = document.querySelector('.rotating-text');
            if (rotatingText) {
                const words = ['Builders', 'Creators', 'Innovators', 'Developers', 'Visionaries'];
                let currentIndex = 0;

                const animateText = () => {
                    gsap.to(rotatingText, {
                        opacity: 0,
                        y: -20,
                        duration: 0.5,
                        ease: 'power2.in',
                        onComplete: () => {
                            currentIndex = (currentIndex + 1) % words.length;
                            rotatingText.textContent = words[currentIndex];
                            gsap.to(rotatingText, {
                                opacity: 1,
                                y: 0,
                                duration: 0.5,
                                ease: 'power2.out',
                            });
                        },
                    });
                };

                // Set initial word
                rotatingText.textContent = words[0];
                gsap.set(rotatingText, { opacity: 1 });

                // Rotate every 3 seconds
                setInterval(animateText, 3000);
            }

            const featureCards = document.querySelectorAll('.feature-card');
            if (featureCards.length > 0) {
                gsap.from(featureCards, {
                    duration: 0.8,
                    y: 50,
                    opacity: 0,
                    scale: 0.9,
                    stagger: 0.15,
                    ease: 'back.out(1.2)',
                    delay: 0.6,
                });

                // Add hover glow effect
                featureCards.forEach((card) => {
                    card.addEventListener('mouseenter', () => {
                        gsap.to(card, {
                            boxShadow: '0 20px 60px rgba(130, 71, 229, 0.4)',
                            duration: 0.3,
                            ease: 'power2.out',
                        });
                    });

                    card.addEventListener('mouseleave', () => {
                        gsap.to(card, {
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                            duration: 0.3,
                            ease: 'power2.out',
                        });
                    });
                });
            }

            const ctaHint = document.querySelector('.cta-hint');
            if (ctaHint) {
                gsap.from(ctaHint, {
                    duration: 1,
                    y: 20,
                    opacity: 0,
                    ease: 'power3.out',
                    delay: 1.2,
                });

                // Continuous subtle bounce
                gsap.to(ctaHint, {
                    y: -5,
                    duration: 1.5,
                    repeat: -1,
                    yoyo: true,
                    ease: 'power1.inOut',
                });
            }

            // Tab buttons animation
            const tabButtons = document.querySelectorAll('.tab-button');
            if (tabButtons.length > 0) {
                gsap.from(tabButtons, {
                    duration: 0.6,
                    y: 20,
                    opacity: 0,
                    stagger: 0.1,
                    ease: 'power2.out',
                    delay: 0.6,
                });
            }

            // Cards animation with ScrollTrigger (exclude welcome section)
            const cards = document.querySelectorAll('.glass:not(header .glass):not(.welcome-section .glass)');
            cards.forEach((card, index) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none none', // Only play once, don't reverse
                    },
                    duration: 0.8,
                    y: 50,
                    opacity: 0,
                    ease: 'power3.out',
                    delay: index * 0.05,
                });
            });

            // Button hover animations
            const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
            buttons.forEach((button) => {
                button.addEventListener('mouseenter', () => {
                    gsap.to(button, {
                        scale: 1.05,
                        duration: 0.3,
                        ease: 'power2.out',
                    });
                });

                button.addEventListener('mouseleave', () => {
                    gsap.to(button, {
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.out',
                    });
                });
            });
        }, 100);

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);
};

// Utility function for page transitions
export const animatePageTransition = (element) => {
    if (element) {
        gsap.from(element, {
            duration: 0.5,
            opacity: 0,
            y: 20,
            ease: 'power2.out',
        });
    }
};

// Utility for stagger animations
export const animateList = (selector, delay = 0) => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
        gsap.from(elements, {
            duration: 0.6,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            ease: 'power2.out',
            delay,
        });
    }
};
