// Handle logout
document.getElementById('logout')?.addEventListener('click', function(e) {
    e.preventDefault();
    logout();
    window.location.href = '../../auth/login.html';
});

// Provider availability toggle
const availabilityToggle = document.getElementById('availability-toggle');
if (availabilityToggle) {
    let isAvailable = true;
    
    availabilityToggle.addEventListener('click', function() {
        isAvailable = !isAvailable;
        this.textContent = isAvailable ? 'Available' : 'Unavailable';
        this.style.background = isAvailable ? '#4CAF50' : '#e74c3c';
        
        // In real app, would update provider status via API
        console.log(`Provider availability set to: ${isAvailable}`);
    });
}

// Load dashboard data (simulated)
function loadDashboardData() {
    // In a real app, this would fetch from your backend
    console.log('Loading dashboard data...');
    
    // Simulate loading customer/provider specific data
    if (document.body.classList.contains('customer-dashboard')) {
        console.log('Loading customer data');
    } else if (document.body.classList.contains('provider-dashboard')) {
        console.log('Loading provider data');
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status (in real app, verify JWT)
    if (!localStorage.getItem('accessToken')) {
        window.location.href = '../../auth/login.html';
        return;
    }
    
    loadDashboardData();
});