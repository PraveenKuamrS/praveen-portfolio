// contact.js
document.addEventListener("DOMContentLoaded", function () {
    // ========== Mobile Menu Toggle ==========
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuBackdrop = document.getElementById('mobileMenuBackdrop');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMobileMenu(show) {
        if (show) {
            mobileMenuBtn.classList.add('active');
            mobileMenu.classList.add('active');
            mobileMenuBackdrop.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            mobileMenuBackdrop.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            const isActive = mobileMenu.classList.contains('active');
            toggleMobileMenu(!isActive);
        });

        // Close mobile menu when clicking backdrop
        mobileMenuBackdrop.addEventListener('click', function() {
            toggleMobileMenu(false);
        });

        // Close mobile menu when clicking on a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                toggleMobileMenu(false);
            });
        });
    }

    // ========== Dark Mode Toggle ==========
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const theme = htmlElement.getAttribute('data-theme');
            const newTheme = theme === 'light' ? 'dark' : 'light';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // ========== Scroll Animations ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements
    const animateElements = document.querySelectorAll('.service-card-modern, .work-card, .timeline-step, .faq-card, .contact-link');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // ========== Carousel Controls ==========
    const carousels = document.querySelectorAll('.work-carousel[data-project]');
    const carouselStates = {};

    carousels.forEach(carousel => {
        const projectName = carousel.getAttribute('data-project');
        const images = carousel.querySelectorAll('.carousel-img');
        const dotsContainer = carousel.querySelector('.carousel-dots');
        
        carouselStates[projectName] = {
            currentIndex: 0,
            totalImages: images.length,
            autoPlayInterval: null
        };

        // Create dots
        if (dotsContainer && images.length > 1) {
            for (let i = 0; i < images.length; i++) {
                const dot = document.createElement('div');
                dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    goToSlide(projectName, i);
                });
                dotsContainer.appendChild(dot);
            }
        }

        // Start autoplay
        startAutoPlay(projectName);

        // Pause on hover
        carousel.addEventListener('mouseenter', () => stopAutoPlay(projectName));
        carousel.addEventListener('mouseleave', () => startAutoPlay(projectName));
    });

    window.changeSlide = function(projectName, direction) {
        const state = carouselStates[projectName];
        if (!state) return;

        const newIndex = (state.currentIndex + direction + state.totalImages) % state.totalImages;
        goToSlide(projectName, newIndex);
    };

    function goToSlide(projectName, index) {
        const state = carouselStates[projectName];
        const carousel = document.querySelector(`[data-project="${projectName}"]`);
        if (!carousel) return;

        const images = carousel.querySelectorAll('.carousel-img');
        const dots = carousel.querySelectorAll('.carousel-dot');

        images[state.currentIndex].classList.remove('active');
        if (dots[state.currentIndex]) dots[state.currentIndex].classList.remove('active');

        state.currentIndex = index;

        images[state.currentIndex].classList.add('active');
        if (dots[state.currentIndex]) dots[state.currentIndex].classList.add('active');
    }

    function startAutoPlay(projectName) {
        const state = carouselStates[projectName];
        if (!state) return;

        stopAutoPlay(projectName);
        state.autoPlayInterval = setInterval(() => {
            changeSlide(projectName, 1);
        }, 3000);
    }

    function stopAutoPlay(projectName) {
        const state = carouselStates[projectName];
        if (state && state.autoPlayInterval) {
            clearInterval(state.autoPlayInterval);
            state.autoPlayInterval = null;
        }
    }

    // ========== Contact Form with Enhanced UX ==========
    const contactForm = document.getElementById('project-contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = document.getElementById('submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        const formMessage = document.getElementById('form-message');

        // Show loading state
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
        submitBtn.disabled = true;
        formMessage.style.display = 'none';

        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const appType = document.getElementById('contact-type').value;
        const budget = document.getElementById('contact-budget').value;
        const timeline = document.getElementById('contact-timeline').value;
        const details = document.getElementById('contact-details').value;

        try {
            const response = await fetch('https://formsubmit.co/ajax/praveenkuamrvpgs13@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    _subject: `[Portfolio Lead] New ${appType} Request`,
                    _replyto: email,
                    Name: name,
                    Email: email,
                    AppType: appType,
                    Budget: budget,
                    Timeline: timeline,
                    ProjectDetails: details
                })
            });

            const result = await response.json();

            if (result.success === "true" || result.success === true) {
                formMessage.textContent = "✓ Message sent successfully! I'll reach out within 24 hours.";
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';
                contactForm.reset();
            } else if (result.message && result.message.includes("Activation")) {
                formMessage.textContent = "⚠ Please check your email to activate the form, then try again.";
                formMessage.className = 'form-message error';
                formMessage.style.display = 'block';
            } else {
                throw new Error(result.message || "Failed to send");
            }
        } catch (error) {
            console.error(error);
            formMessage.textContent = "✗ Error sending message. Please email me directly at praveenkuamrvpgs13@gmail.com";
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
        } finally {
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
});
