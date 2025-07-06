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