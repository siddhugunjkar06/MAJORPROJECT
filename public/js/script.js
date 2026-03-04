// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// Star rating functionality
const stars = document.querySelectorAll('.star-rating input');

stars.forEach(star => {
  star.addEventListener('change', async () => {
    const rating = star.value;
    const comment = document.getElementById('comment').value;
    const listingId = window.location.pathname.split('/')[2]; // Assuming URL is /listings/:id
    
    try {
      const response = await fetch(`/listings/${listingId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ review: { rating, comment } }),
      });
      
      if (response.ok) {
        console.log(`User rated this: ${rating} stars`);
        // Optionally reload or update UI
        window.location.reload();
      } else {
        console.error('Failed to save rating');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
});