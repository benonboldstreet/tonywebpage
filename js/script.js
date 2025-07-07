// Lazy loading functionality
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-image');
    
    // Create intersection observer for lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                loadImage(img);
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

function loadImage(img) {
    const placeholder = img.parentNode.querySelector('.image-placeholder');
    
    // Ensure image is visible
    img.style.opacity = '1';
    img.classList.add('loaded');
    
    // Hide placeholder
    if (placeholder) {
        placeholder.style.opacity = '0';
    }
    
    img.onerror = function() {
        console.log('Image failed to load:', img.src);
        if (placeholder) {
            placeholder.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999; font-size: 14px;">Image not found</div>';
            placeholder.style.opacity = '1';
        }
    };
}

// Lightbox functionality
let currentImageIndex = 0;
let galleryImages = [];

function initLightbox() {
    // Collect all visible gallery images
    updateGalleryImages();
    
    // Add keyboard support
    document.addEventListener('keydown', function(e) {
        if (document.getElementById('lightbox').style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    previousImage();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
            }
        }
    });
    
    // Close lightbox when clicking outside image
    document.getElementById('lightbox').addEventListener('click', function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });
}

function updateGalleryImages() {
    // Get all currently visible gallery items
    const visibleItems = Array.from(document.querySelectorAll('.gallery-item'))
        .filter(item => item.style.display !== 'none');
    
    galleryImages = visibleItems.map(item => {
        const img = item.querySelector('.lazy-image');
        const overlay = item.querySelector('.gallery-overlay');
        const title = overlay.querySelector('h3').textContent;
        const description = overlay.querySelector('p').textContent;
        
        return {
            src: img.src,
            alt: img.alt,
            title: title,
            description: description,
            element: item
        };
    });
}

function openLightbox(galleryItem) {
    updateGalleryImages(); // Update in case filter has changed
    
    // Find the index of clicked item
    currentImageIndex = galleryImages.findIndex(item => item.element === galleryItem);
    
    if (currentImageIndex === -1) return;
    
    displayLightboxImage();
    document.getElementById('lightbox').style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

function displayLightboxImage() {
    const currentImage = galleryImages[currentImageIndex];
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxCounter = document.getElementById('lightbox-counter');
    
    lightboxImg.src = currentImage.src;
    lightboxImg.alt = currentImage.alt;
    lightboxTitle.textContent = currentImage.title;
    lightboxDescription.textContent = currentImage.description;
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
    
    // Show/hide navigation arrows
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    prevBtn.style.display = galleryImages.length > 1 ? 'block' : 'none';
    nextBtn.style.display = galleryImages.length > 1 ? 'block' : 'none';
}

function previousImage() {
    if (galleryImages.length <= 1) return;
    
    currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : galleryImages.length - 1;
    displayLightboxImage();
}

function nextImage() {
    if (galleryImages.length <= 1) return;
    
    currentImageIndex = currentImageIndex < galleryImages.length - 1 ? currentImageIndex + 1 : 0;
    displayLightboxImage();
}

// Enhanced form validation functionality
function initFormValidation() {
    // Initialize character counters
    const textareas = document.querySelectorAll('textarea[maxlength]');
    textareas.forEach(textarea => {
        updateCharacterCounter(textarea);
    });
    
    // Add form progress tracking
    const forms = document.querySelectorAll('form[name="booking"], form[name="contact"], form[name="review"]');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('input', () => updateFormProgress(form));
            input.addEventListener('change', () => updateFormProgress(form));
        });
    });
}

function validateField(field) {
    const formGroup = field.closest('.form-group');
    const messageDiv = formGroup.querySelector('.validation-message');
    let isValid = true;
    let message = '';
    
    // Clear previous validation state
    formGroup.classList.remove('error', 'success');
    messageDiv.classList.remove('show', 'error', 'success');
    
    // Check if field is required and empty
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        message = 'This field is required';
    }
    // Validate specific field types
    else if (field.value.trim()) {
        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    isValid = false;
                    message = 'Please enter a valid email address';
                }
                break;
                
            case 'tel':
                const phoneRegex = /^[0-9\s\-\+\(\)]{10,15}$/;
                if (!phoneRegex.test(field.value)) {
                    isValid = false;
                    message = 'Please enter a valid phone number (10-15 digits)';
                }
                break;
                
            case 'text':
                if (field.hasAttribute('minlength') && field.value.length < field.getAttribute('minlength')) {
                    isValid = false;
                    message = `Minimum ${field.getAttribute('minlength')} characters required`;
                }
                break;
        }
        
        // Check maxlength
        if (field.hasAttribute('maxlength') && field.value.length > field.getAttribute('maxlength')) {
            isValid = false;
            message = `Maximum ${field.getAttribute('maxlength')} characters allowed`;
        }
    }
    
    // Apply validation state
    if (field.value.trim() && isValid) {
        formGroup.classList.add('success');
        messageDiv.textContent = '';
    } else if (!isValid) {
        formGroup.classList.add('error');
        messageDiv.textContent = message;
        messageDiv.classList.add('show', 'error');
    }
    
    // Update character counter for textareas
    if (field.tagName === 'TEXTAREA' && field.hasAttribute('maxlength')) {
        updateCharacterCounter(field);
    }
    
    // Update form progress
    updateFormProgress(field.closest('form'));
    
    return isValid;
}

function updateCharacterCounter(textarea) {
    const counter = document.getElementById(textarea.id + '-counter');
    if (!counter) return;
    
    const current = textarea.value.length;
    const max = textarea.getAttribute('maxlength');
    
    counter.textContent = `${current}/${max}`;
    
    // Update counter styling based on usage
    counter.classList.remove('warning', 'error');
    if (current > max * 0.9) {
        counter.classList.add('warning');
    }
    if (current > max) {
        counter.classList.add('error');
    }
}

function updateFormProgress(form) {
    if (!form) return;
    
    const progressBar = form.querySelector('.form-progress-bar');
    if (!progressBar) return;
    
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
    const validFields = Array.from(requiredFields).filter(field => {
        return field.value.trim() && !field.closest('.form-group').classList.contains('error');
    });
    
    const progress = (validFields.length / requiredFields.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function validateBookingForm(event) {
    const form = event.target;
    let isFormValid = true;
    
    // Validate all fields
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    fields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    // Check if date is selected
    const selectedDate = document.getElementById('selected-date');
    if (!selectedDate || !selectedDate.value) {
        alert('Please select a date from the calendar');
        isFormValid = false;
    }
    
    // If form is invalid, prevent submission
    if (!isFormValid) {
        event.preventDefault();
        
        // Scroll to first error
        const firstError = form.querySelector('.form-group.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        return false;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Re-enable after delay (in case form submission fails)
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Book Session';
        }, 3000);
    }
    
    return true;
}

function validateContactForm(event) {
    const form = event.target;
    let isFormValid = true;
    
    // Validate all required fields
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    fields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        event.preventDefault();
        
        // Scroll to first error
        const firstError = form.querySelector('.form-group.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        return false;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }, 3000);
    }
    
    return true;
}

function validateReviewForm(event) {
    const form = event.target;
    let isFormValid = true;
    
    // Validate all required fields
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    fields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        event.preventDefault();
        
        // Scroll to first error
        const firstError = form.querySelector('.form-group.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        return false;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Review';
        }, 3000);
    }
    
    return true;
}

// Calendar functionality
let currentDate = new Date();
let selectedDate = null;

function initCalendar() {
    generateCalendar();
}

function generateCalendar() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    document.getElementById('currentMonth').textContent = 
        monthNames[currentDate.getMonth()] + ' ' + currentDate.getFullYear();
    
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';
    
    // Add day headers
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.textContent = day;
        dayHeader.style.fontWeight = 'bold';
        dayHeader.style.textAlign = 'center';
        dayHeader.style.padding = '10px 0';
        dayHeader.style.color = '#c9a96e';
        grid.appendChild(dayHeader);
    });
    
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = date.getDate();
        
        if (date.getMonth() !== currentDate.getMonth()) {
            dayElement.style.opacity = '0.3';
        } else if (date >= new Date() && Math.random() > 0.3) {
            dayElement.classList.add('available');
        }
        
        dayElement.onclick = () => selectDate(date, dayElement);
        grid.appendChild(dayElement);
    }
}

function selectDate(date, element) {
    if (element.classList.contains('available')) {
        document.querySelectorAll('.calendar-day.selected').forEach(el => {
            el.classList.remove('selected');
        });
        element.classList.add('selected');
        selectedDate = date;
        
        // Update the hidden form field with selected date
        const dateField = document.getElementById('selected-date-field');
        if (dateField) {
            dateField.value = date.toLocaleDateString();
        }
    }
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar();
}

// Gallery filtering
function filterGallery(category) {
    const items = document.querySelectorAll('.gallery-item');
    const buttons = document.querySelectorAll('.filter-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Update lightbox gallery images when filter changes
    updateGalleryImages();
}

// Form submissions - FIXED FOR NETLIFY
function submitBooking(event) {
    // Check if date is selected BEFORE submission
    if (!selectedDate) {
        event.preventDefault(); // Only prevent if validation fails
        alert('Please select a date from the calendar');
        return false;
    }
    
    // Set the selected date in the hidden field
    const dateField = document.getElementById('selected-date-field');
    if (dateField) {
        dateField.value = selectedDate.toLocaleDateString();
    }
    
    // Show confirmation message but LET THE FORM SUBMIT to Netlify
    setTimeout(() => {
        showModal('Booking Request Sent!', 
            'Thank you! Your booking request has been sent. I\'ll contact you within 24 hours to confirm availability.');
    }, 100);
    
    // Return true to allow form submission to Netlify
    return true;
}

function submitReview(event) {
    // Let the form submit to Netlify, then show confirmation
    setTimeout(() => {
        showModal('Review Submitted!', 
            'Thank you for your feedback! Your review has been submitted and helps others understand the quality of my work.');
    }, 100);
    
    // Return true to allow form submission to Netlify
    return true;
}

function submitContact(event) {
    // Let the form submit to Netlify, then show confirmation
    setTimeout(() => {
        showModal('Message Sent!', 
            'Thank you! Your message has been sent successfully. I\'ll get back to you within 24 hours.');
    }, 100);
    
    // Return true to allow form submission to Netlify
    return true;
}

// Modal functions
function showModal(title, message) {
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('successModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}

// Smooth scrolling
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Enhanced mobile menu functionality
function initMobileMenu() {
    // Add keyboard support for mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        }
    });
}

function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    // Toggle classes for animations
    mobileMenu.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    mobileToggle.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (mobileMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

function closeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    mobileToggle.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('successModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initCalendar();
    initLazyLoading(); // Initialize lazy loading
    initLightbox(); // Initialize lightbox
    initMobileMenu(); // Initialize mobile menu
    initFormValidation(); // Initialize form validation
});

// Add smooth scroll behavior to anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});