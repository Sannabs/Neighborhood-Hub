function showEditForm(reviewId, body, rating) {
    // Hide all edit forms
    document.querySelectorAll('.edit-form').forEach(form => form.classList.add('hidden'));

    // Show the selected edit form
    const form = document.getElementById('edit-form-' + reviewId);
    form.classList.remove('hidden');

    // Pre-fill the form fields
    const textarea = form.querySelector('textarea[name="review[body]"]');
    textarea.value = body;

    // Pre-fill the rating radio buttons
    const ratingInputs = form.querySelectorAll('input[name="review[rating]"]');
    ratingInputs.forEach(input => {
        input.checked = input.value == rating;  // Ensure the right rating is checked
    });
}