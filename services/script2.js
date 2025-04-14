document.addEventListener('DOMContentLoaded', function() {
    // Initialize handyman-specific functionality
    initHandymanPage();
});

function initHandymanPage() {
    // Task type pricing
    const taskType = document.getElementById('task-type');
    const totalDisplay = document.getElementById('handyman-total');
    
    // Pricing matrix (2-hour minimum)
    const pricing = {
        'assembly': 45 * 2,
        'plumbing': 55 * 2,
        'electrical': 65 * 2,
        'drywall': 50 * 2,
        'other': 45 * 2
    };
    
    // Calculate total when task type changes
    function calculateTotal() {
        const total = pricing[taskType.value] || 90;
        totalDisplay.textContent = `$${total}`;
        return total;
    }
    
    taskType.addEventListener('change', calculateTotal);
    
    // Urgent service toggle
    const urgentBtn = document.querySelector('.urgent-btn');
    let isUrgent = false;
    
    urgentBtn.addEventListener('click', function(e) {
        e.preventDefault();
        isUrgent = !isUrgent;
        
        const currentTotal = parseInt(totalDisplay.textContent.replace('$', ''));
        const newTotal = isUrgent ? currentTotal + 30 : currentTotal - 30;
        
        totalDisplay.textContent = `$${newTotal}`;
        urgentBtn.textContent = isUrgent ? 
            '✓ Urgent Service Selected (+$30)' : 
            'Request Urgent Help (+$30 fee)';
    });
    
    // Initialize booking form
    const bookingForm = document.getElementById('handyman-booking');
    
    bookingForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submit-booking');
        const spinner = document.getElementById('spinner');
        
        // Show loading state
        submitBtn.disabled = true;
        spinner.classList.remove('hidden');
        
        try {
            // In a real app, this would call your backend API
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            const task = taskType.options[taskType.selectedIndex].text;
            alert(`${task} booked! Our handyman will contact you to confirm details.`);
            
            // Reset form
            bookingForm.reset();
            calculateTotal();
            isUrgent = false;
            urgentBtn.textContent = 'Request Urgent Help (+$30 fee)';
        } catch (error) {
            console.error('Booking error:', error);
            alert('Error submitting booking. Please try again.');
        } finally {
            submitBtn.disabled = false;
            spinner.classList.add('hidden');
        }
    });
    
    // Initialize provider selection
    const providerCards = document.querySelectorAll('.provider-card');
    
    providerCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove previous selection
            providerCards.forEach(c => c.classList.remove('selected'));
            
            // Add selection to clicked card
            this.classList.add('selected');
            
            // Update booking form with provider info
            const providerName = this.querySelector('h3').textContent;
            const providerRate = this.querySelector('.price').textContent;
            alert(`Selected ${providerName} at ${providerRate}`);
        });
    });
}