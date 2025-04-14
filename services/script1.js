// Main application functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    // Initialize all service pages
    initServicePages();
    
    // Handle search functionality
    const searchBtn = document.querySelector('.search-bar button');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchServices);
    }
});

// Initialize service page functionality
function initServicePages() {
    // Booking form handling
    const bookingForms = document.querySelectorAll('[id$="-booking"]');
    bookingForms.forEach(form => {
        form.addEventListener('submit', handleBookingSubmit);
    });
    
    // Provider selection
    const providerBtns = document.querySelectorAll('.provider-card .btn-outline');
    providerBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const providerName = this.closest('.provider-card').querySelector('h3').textContent;
            selectProvider(providerName);
        });
    });
    
    // Load more reviews
    const loadMoreBtn = document.getElementById('load-more-reviews');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreReviews);
    }
}

// Search services function
function searchServices() {
    const serviceInput = document.querySelector('.search-bar input[type="text"]:first-of-type');
    const locationInput = document.querySelector('.search-bar input[type="text"]:last-of-type');
    
    if (serviceInput.value && locationInput.value) {
        alert(`Searching for ${serviceInput.value} in ${locationInput.value}`);
        // In a real app, this would redirect to search results
    } else {
        alert('Please enter both service and location');
    }
}

// Handle booking form submission
async function handleBookingSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const spinner = form.querySelector('.spinner');
    
    // Show loading state
    submitBtn.disabled = true;
    spinner.classList.remove('hidden');
    
    // Simulate API call
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // In a real app, this would call your backend
        alert('Booking request received! A provider will contact you shortly.');
        form.reset();
    } catch (error) {
        alert('Error submitting booking. Please try again.');
        console.error(error);
    } finally {
        submitBtn.disabled = false;
        spinner.classList.add('hidden');
    }
}

// Select provider function
function selectProvider(providerName) {
    alert(`${providerName} selected! Continue with booking.`);
    // In a real app, this would update the booking form
}

// Load more reviews function
function loadMoreReviews() {
    const reviewsGrid = document.querySelector('.reviews-grid');
    const loadMoreBtn = document.getElementById('load-more-reviews');
    
    // Simulate loading more reviews
    const newReviews = [
        {
            rating: '★★★★★',
            date: 'December 5, 2022',
            text: 'Absolutely fantastic service! My house has never been cleaner.',
            author: '- David M.'
        },
        {
            rating: '★★★★☆',
            date: 'November 20, 2022',
            text: 'Great job overall, just arrived 15 minutes late.',
            author: '- Emily T.'
        }
    ];
    
    newReviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
            <div class="review-header">
                <span class="rating">${review.rating}</span>
                <span class="review-date">${review.date}</span>
            </div>
            <p>"${review.text}"</p>
            <p class="review-author">${review.author}</p>
        `;
        reviewsGrid.appendChild(reviewCard);
    });
    
    loadMoreBtn.textContent = 'No More Reviews';
    loadMoreBtn.disabled = true;
}

// Stripe Payment Integration (for service pages)
let stripe, elements;

async function initializeStripe() {
    // This would be your actual publishable key
    stripe = Stripe('pk_test_your_stripe_publishable_key');
    
    // Create payment intent on your server
    const response = await fetch('/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: calculateTotal() * 100 }) // Amount in cents
    });
    
    const { clientSecret } = await response.json();
    
    // Set up Stripe Elements
    elements = stripe.elements({ clientSecret });
    const paymentElement = elements.create('payment');
    paymentElement.mount('#payment-element');
}

async function handleStripePayment(form) {
    const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
            return_url: window.location.origin + '/booking-confirmed',
        }
    });
    
    if (error) {
        alert(error.message);
    }
}

function calculateTotal() {
    // This would calculate based on service type, duration, etc.
    return 50; // Example amount
}