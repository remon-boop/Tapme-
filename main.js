// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Menu toggle for mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 85, // Account for fixed header
                behavior: 'smooth'
            });
        });
    });

    // Fade-in animation for How It Works section
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    }
    
    // Check on load and scroll
    checkFade();
    window.addEventListener('scroll', checkFade);

    // Product filter functionality
    const productFilter = document.getElementById('product-filter');
    const productCards = document.querySelectorAll('.product-card');
    
    productFilter.addEventListener('change', function() {
        const category = this.value;
        
        productCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // File upload functionality
    const fileInput = document.getElementById('upload');
    const fileName = document.getElementById('file-name');
    
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileName.textContent = this.files[0].name;
        } else {
            fileName.textContent = 'No file chosen';
        }
    });

    // Custom order form submission
    const orderForm = document.getElementById('custom-order-form');
    
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const description = document.getElementById('description').value;
        
        // Create WhatsApp message
        const message = `Hi! My name is ${name}. I want to order a custom keychain. Description: ${description}. My number is ${phone}. I will send the design image here.`;
        
        // Encode the message for URL
        const encodedMessage = encodeURIComponent(message);
        
        // Open WhatsApp with the message
        window.open(`https://wa.me/8801789053188?text=${encodedMessage}`, '_blank');
    });
    
    // Product Share Button Functionality
    const shareButtons = document.querySelectorAll('.btn-share');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.dataset.product;
            const productPrice = this.dataset.price;
            const shareMessage = `Check out this awesome ${productName} from Tap Me! Order here: https://wa.me/8801789053188`;
            
            // Check if Web Share API is supported
            if (navigator.share) {
                navigator.share({
                    title: 'Tap Me - Customizable NFC Keychains',
                    text: shareMessage,
                    url: window.location.href
                })
                .catch(error => {
                    console.error('Error sharing:', error);
                    fallbackShare(shareMessage);
                });
            } else {
                fallbackShare(shareMessage);
            }
        });
    });
    
    // Fallback share function (copy to clipboard)
    function fallbackShare(text) {
        // Create temporary input
        const input = document.createElement('input');
        input.setAttribute('value', text);
        document.body.appendChild(input);
        
        // Select and copy text
        input.select();
        document.execCommand('copy');
        
        // Remove temporary input
        document.body.removeChild(input);
        
        // Notify user
        alert('Link copied to clipboard: ' + text);
    }
});
