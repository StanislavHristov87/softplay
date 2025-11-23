// Dark Mode Functionality
function initDarkMode() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply theme on page load
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
    }
    
    // Toggle dark mode
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
    
    // Add event listeners to all dark mode toggle buttons
    const darkModeToggles = document.querySelectorAll('#dark-mode-toggle, #dark-mode-toggle-mobile');
    darkModeToggles.forEach(toggle => {
        if (toggle) {
            toggle.addEventListener('click', toggleDarkMode);
        }
    });
}

// Initialize dark mode immediately (before DOMContentLoaded to prevent flash)
initDarkMode();

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize EmailJS
    let emailjsConfigured = false;
    const publicKey = "QZsSJQLXLIJc7FoFD";
    const serviceId = 'service_7o1kojx';
    const templateId = 'template_br4872r'; // Your template ID from EmailJS dashboard
    
    // Wait for EmailJS to be available
    function initEmailJS() {
        if (typeof emailjs !== 'undefined') {
            try {
                if (publicKey && publicKey !== "YOUR_PUBLIC_KEY") {
                    emailjs.init(publicKey);
                    emailjsConfigured = true;
                    console.log('EmailJS initialized successfully with public key:', publicKey);
                } else {
                    console.warn('EmailJS public key not configured.');
                }
            } catch (error) {
                console.error('EmailJS initialization error:', error);
            }
        } else {
            // Retry after a short delay if EmailJS isn't loaded yet
            setTimeout(initEmailJS, 100);
        }
    }
    
    // Initialize EmailJS - try immediately and retry if needed
    if (typeof emailjs !== 'undefined') {
        initEmailJS();
    } else {
        // Wait for EmailJS to load
        window.addEventListener('load', function() {
            setTimeout(initEmailJS, 500);
        });
    }
    
    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    
    if (contactForm) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton ? submitButton.textContent : '';
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const messageInput = document.getElementById('message');
            const serviceInput = document.getElementById('service');
            
            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const phone = phoneInput ? phoneInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';
            const service = serviceInput ? serviceInput.value : '';
            
            // Validate form
            if (!name || !email || !phone || !message) {
                showMessage('Моля, попълнете всички задължителни полета.', 'error');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Моля, въведете валиден имейл адрес.', 'error');
                return;
            }
            
            // Validate phone (basic validation - at least 5 digits)
            const phoneRegex = /[\d\s\+\-\(\)]{5,}/;
            if (!phoneRegex.test(phone)) {
                showMessage('Моля, въведете валиден телефонен номер.', 'error');
                return;
            }
            
            // Check if EmailJS is configured and ready
            if (!emailjsConfigured) {
                // Try to initialize again
                if (typeof emailjs !== 'undefined') {
                    try {
                        emailjs.init(publicKey);
                        emailjsConfigured = true;
                    } catch (e) {
                        console.error('EmailJS init error:', e);
                    }
                }
                
                if (!emailjsConfigured) {
                    showMessage('EmailJS не е конфигуриран. Моля, свържете се с нас директно на телефона: +359 889 878 731 или на имейл: softplay1987@gmail.com', 'error');
                    console.error('EmailJS not configured');
                    
                    // Re-enable submit button
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = originalButtonText;
                        submitButton.style.opacity = '1';
                    }
                    return;
                }
            }
            
            // Disable submit button and show loading state
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'ИЗПРАЩА СЕ...';
                submitButton.style.opacity = '0.7';
            }
            
            // EmailJS template parameters
            // Make sure these variable names match your EmailJS template
            const templateParams = {
                from_name: name,
                from_email: email,
                from_phone: phone,
                service: service || 'Не е избрана услуга',
                message: message,
                to_email: 'softplay1987@gmail.com',
                reply_to: email
            };
            
            console.log('=== EmailJS Debug Info ===');
            console.log('Public Key:', publicKey);
            console.log('Service ID:', serviceId);
            console.log('Template ID:', templateId);
            console.log('EmailJS Configured:', emailjsConfigured);
            console.log('EmailJS Available:', typeof emailjs !== 'undefined');
            console.log('Template Params:', templateParams);
            console.log('========================');
            
            // Send email using EmailJS
            emailjs.send(serviceId, templateId, templateParams)
                .then(function(response) {
                    console.log('Email sent successfully!', response.status, response.text);
                    showMessage('Съобщението е изпратено успешно! Ще се свържем с вас скоро.', 'success');
                    contactForm.reset();
                    
                    // Re-enable submit button
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = originalButtonText;
                        submitButton.style.opacity = '1';
                    }
                }, function(error) {
                    console.error('EmailJS Error Details:', {
                        status: error.status,
                        text: error.text,
                        error: error
                    });
                    
                    let errorMessage = 'Възникна грешка при изпращането. Моля, опитайте отново или се свържете директно на телефона: +359 889 878 731';
                    
                    // Provide more specific error messages
                    if (error.status === 400) {
                        errorMessage = 'Грешка в конфигурацията. Моля, проверете настройките на формата.';
                    } else if (error.status === 401) {
                        errorMessage = 'Грешка при автентикация. Моля, свържете се с нас директно.';
                    } else if (error.status === 404) {
                        errorMessage = 'Сервисът не е намерен. Моля, опитайте по-късно.';
                    }
                    
                    showMessage(errorMessage, 'error');
                    
                    // Re-enable submit button
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = originalButtonText;
                        submitButton.style.opacity = '1';
                    }
                });
        });
    }
    
    // Show form message
    function showMessage(text, type) {
        if (!formMessage) return;
        
        formMessage.textContent = text;
        formMessage.classList.remove('hidden');
        formMessage.classList.remove('text-green-600', 'text-red-600');
        
        if (type === 'success') {
            formMessage.classList.add('text-green-600');
        } else {
            formMessage.classList.add('text-red-600');
        }
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Hide message after 5 seconds
        setTimeout(function() {
            formMessage.classList.add('hidden');
        }, 5000);
    }
    
    // Header scroll effect (optional - add shadow on scroll)
    let lastScroll = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('shadow-lg');
        } else {
            header.classList.remove('shadow-lg');
        }
        
        lastScroll = currentScroll;
    });
    
    // Scroll Animation Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
    
    // Observe stagger items with delay
    document.querySelectorAll('.stagger-item').forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Image load animation
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        }
    });
});

