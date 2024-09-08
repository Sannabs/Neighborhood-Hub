(() => {
    'use strict'

    const forms = document.querySelectorAll('.validated-form');

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault();
            let allValid = true;  // Track overall form validity

            Array.from(form.elements).forEach(input => {
                const feedback = input.nextElementSibling;  // Feedback element

                // Skip validation for optional fields
                if (input.hasAttribute('required') || input.value.trim() !== '') {
                    if (input.tagName === 'SELECT') {
                        // For <select>, check that a valid option is selected
                        if (input.value === 'Select safety') { // Assuming empty value for "Select safety"
                            input.classList.add('border-red-600');
                            input.classList.remove('border-green-600');

                            if (feedback) {
                                feedback.innerHTML = `<span class="font-medium">Oops!</span> Please select a valid option.`;
                                feedback.className = 'mt-2 text-sm text-red-600 dark:text-red-500';
                            }

                            allValid = false;
                        } else {
                            input.classList.add('border-green-600');
                            input.classList.remove('border-red-600');

                            if (feedback) {
                                feedback.innerHTML = `<span class="font-medium">Alright!</span> Valid selection!`;
                                feedback.className = 'mt-2 text-sm text-green-600 dark:text-green-500';
                            }
                        }
                    } else if (input.checkValidity()) {
                        input.classList.remove('border-red-600');
                        input.classList.add('border-green-600');

                        if (feedback) {
                            feedback.innerHTML = `<span class="font-medium">Alright!</span> Looks good!`;
                            feedback.className = 'feedback mt-2 text-sm text-green-600 dark:text-green-500';
                        }
                    } else {
                        input.classList.remove('border-green-600');
                        input.classList.add('border-red-600');

                        if (feedback) {
                            feedback.innerHTML = `<span class="font-medium">Oops!</span> Please correct this field.`;
                            feedback.className = 'mt-2 text-sm text-red-600 dark:text-red-500';
                        }

                        allValid = false; // Set form as invalid
                    }
                } else {
                    input.classList.remove('border-red-600', 'border-green-600');
                    if (feedback) {
                        feedback.innerHTML = '';
                    }
                }
            });

            if (allValid) {
                form.submit();  // Submit the form if all fields are valid
            }
        }, false);
    });
})();
