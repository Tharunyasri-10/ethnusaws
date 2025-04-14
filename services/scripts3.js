document.addEventListener('DOMContentLoaded', function() {
    // Initialize landscaping-specific functionality
    initLandscapingPage();
});

function initLandscapingPage() {
    // Service type pricing
    const serviceType = document.getElementById('landscaping-service');
    const propertySize = document.getElementById('property-size');
    const frequency = document.getElementById('landscaping-frequency');
    const totalDisplay = document.getElementById('landscaping-total');
    
    // Base pricing matrix
    const pricing = {
        'mowing': 35,
        'trimming': 45,
        'garden': 50,
        'irrigation': 60,
        'full': 55
    };
    
    // Size multipliers
    const sizeMultipliers = {
        'small': 1,
        'medium': 1.5,
        'large': 2,
        'xlarge': 3
    };
    
    // Calculate total when inputs change
    function calculateTotal() {
        const rate = pricing[serviceType.value] || 35;
        const multiplier = sizeMultipliers[propertySize.value] || 1;
        const isRecurring = frequency.value !== 'once';
        
        let total = rate * multiplier;
        if (isRecurring) total = total * 0.9; // 10% discount
        
        totalDisplay.textContent = `$${total.toFixed(0)}`;
        return total;
    }
    
    serviceType.addEventListener('change', calculateTotal);
    propertySize.addEventListener('change', calculateTotal);
    frequency.addEventListener('change', calculateTotal);
    
    // Initialize booking form
    const bookingForm = document.getElementById('landscaping-booking');
    
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
            const service = serviceType.options[serviceType.selectedIndex].text;
            const freq = frequency.options[frequency.selectedIndex].text;
            alert(`Booked ${service} (${freq})! We'll contact you to confirm details.`);
            
            // Reset form
            bookingForm.reset();
            calculateTotal();
        } catch (error) {
            console.error('Booking error:', error);
            alert('Error submitting booking. Please try again.');
        } finally {
            submitBtn.disabled = false;
            spinner.classList.add('hidden');
        }
    });
    
    // Initialize portfolio lightbox
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const caption = this.querySelector('p').textContent;
            
            // In a real app, this would open a lightbox/modal
            alert(`Viewing: ${caption}\nImage: ${imgSrc}`);
        });
    });
}