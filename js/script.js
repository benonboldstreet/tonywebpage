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
}

// Form submissions
function submitBooking(event) {
    event.preventDefault();
    
    if (!selectedDate) {
        alert('Please select a date from the calendar');
        return;
    }
    
    const formData = {
        date: selectedDate.toLocaleDateString(),
        sessionType: document.getElementById('session-type').value,
        name: document.getElementById('client-name').value,
        email: document.getElementById('client-email').value,
        phone: document.getElementById('client-phone').value,
        details: document.getElementById('session-details').value,
        time: document.getElementById('preferred-time').value
    };
    
    // In a real website, you would send this data to your server
    console.log('Booking request:', formData);
    
    showModal('Booking Request Sent!', 
        `Thank you ${formData.name}! Your booking request for ${formData.date} has been sent. I'll contact you within 24 hours to confirm availability and discuss your vision.`);
    
    event.target.reset();
    selectedDate = null;
    generateCalendar();
}

function submitReview(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('review-name').value,
        rating: document.getElementById('review-rating').value,
        text: document.getElementById('review-text').value,
        type: document.getElementById('review-type').value,
        date: new Date().toLocaleDateString()
    };
    
    // Add new review to the top of the list
    const newReview = document.createElement('div');
    newReview.className = 'testimonial';
    newReview.innerHTML = `
        <div class="testimonial-header">
            <span class="client-name">${formData.name}</span>
            <span class="rating">${'★'.repeat(formData.rating)}${'☆'.repeat(5-formData.rating)}</span>
        </div>
        <p class="testimonial-text">"${formData.text}"</p>
        <div class="testimonial-meta">${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} - ${formData.date}</div>
    `;
    
    const testimonialsGrid = document.querySelector('.testimonials-grid');
    testimonialsGrid.insertBefore(newReview, testimonialsGrid.children[0]);
    
    showModal('Review Submitted!', 'Thank you for your feedback! Your review has been posted and helps others understand the quality of my work.');
    event.target.reset();
}

function submitContact(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('contact-name').value,
        email: document.getElementById('contact-email').value,
        subject: document.getElementById('contact-subject').value,
        message: document.getElementById('contact-message').value
    };
    
    // In a real website, you would send this data to your server
    console.log('Contact form:', formData);
    
    showModal('Message Sent!', 
        `Thank you ${formData.name}! Your message has been sent successfully. I'll get back to you within 24 hours to discuss your photography needs.`);
    
    event.target.reset();
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

// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
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