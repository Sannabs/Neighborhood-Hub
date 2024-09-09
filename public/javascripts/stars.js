document.addEventListener('DOMContentLoaded', () => {
    const starRatings = document.querySelectorAll('.star-rating');


    starRatings.forEach(starRating => {
        const ratingInput = starRating.querySelector('input[name="review[rating]"]');
        const stars = starRating.querySelectorAll('.fa-star');


        starRating.addEventListener('click', (event) => {
            if (event.target.classList.contains('fa-star')) {
                const value = event.target.getAttribute('data-value');
                ratingInput.value = value;
                updateStars(stars, value);
            }
        });


        starRating.addEventListener('mouseover', (event) => {
            if (event.target.classList.contains('fa-star')) {
                const value = event.target.getAttribute('data-value');
                updateStars(stars, value);
            }
        });


        starRating.addEventListener('mouseout', () => {
            const currentRating = ratingInput.value;
            updateStars(stars, currentRating);
        });


        function updateStars(stars, value) {
            stars.forEach(star => {
                const starValue = star.getAttribute('data-value');
                star.classList.toggle('checked', starValue <= value);
            });
        }


        // Initialize stars based on hidden input value
        const initialRating = ratingInput.value || 0;
        updateStars(stars, initialRating);
    });
});


