const ContactForm = (() => {
    const init = () => {
        const form = document.getElementById('contact-form');
        if (!form) {
            // console.warn('Contact form (ID: contact-form) not found.');
            return false;
        }

        const formStatusMessage = document.getElementById('form-status-message');
        if (!formStatusMessage) {
            // console.warn('Form status message container (ID: form-status-message) not found.');
            return false;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        if (!submitButton) {
            // console.warn('Submit button not found in contact form.');
            return false;
        }

        const originalButtonHTML = submitButton.innerHTML; // Store the full original HTML of the button

        form.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent default page reload

            const formData = new FormData(form);

            // Update button to loading state
            submitButton.disabled = true;
            const plusIconSVG = submitButton.querySelector('.plus-icon') ? submitButton.querySelector('.plus-icon').outerHTML : '';
            submitButton.innerHTML = `
                Sending...
                <span class="plus" aria-hidden="true">
                    ${plusIconSVG}
                </span>`;
            submitButton.classList.add('is-loading');

            // Clear previous status messages
            formStatusMessage.innerHTML = '';
            formStatusMessage.className = ''; // Clear 'success' or 'error' classes

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Important for Formspree to send JSON response
                    }
                });

                if (response.ok) {
                    formStatusMessage.innerHTML = 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.';
                    formStatusMessage.className = 'success'; // Add only 'success' class
                    form.reset(); // Clear the form fields
                } else {
                    // Try to parse error response from Formspree
                    const data = await response.json();
                    let errorMessage = 'Oops! There was a problem submitting your form. Please try again.';
                    if (data && data.errors && data.errors.length > 0) {
                        errorMessage = data.errors.map(error => error.message || error.field || 'Error').join('<br>');
                    } else if (data && data.error) {
                        errorMessage = data.error;
                    }
                    formStatusMessage.innerHTML = errorMessage;
                    formStatusMessage.className = 'error'; // Add only 'error' class
                }
            } catch (error) {
                console.error('Form submission network error:', error);
                formStatusMessage.innerHTML = 'Oops! There was a network error. Please check your connection and try again.';
                formStatusMessage.className = 'error'; // Add only 'error' class
            } finally {
                // Restore button to original state
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonHTML;
                submitButton.classList.remove('is-loading');
            }
        });
        console.log("Contact Form module initialized successfully.");
        return true;
    };

    return { init };
})();

export default ContactForm;