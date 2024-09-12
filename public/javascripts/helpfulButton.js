$(document).ready(function () {
    $('.helpful-button').on('click', function (e) {
        e.preventDefault();
        const reviewId = $(this).data('review-id');  // Get the reviewId from the button
        const neighborhoodId = $(this).data('neighborhood-id');  // Ensure you have neighborhoodId

        $.ajax({
            url: `/neighborhoods/${neighborhoodId}/reviews/${reviewId}/update-helpful`,
            type: 'POST',
            success: function (response) {
                if (response.success) {
                    const countSpan = $(this).siblings('.helpful-count');
                    countSpan.text(`${response.newCount} found this helpful`);
                } else {
                    alert('Error marking as helpful');
                }
            },
            error: function (error) {
                console.error('Error:', error);
            }
        });
    });
});
