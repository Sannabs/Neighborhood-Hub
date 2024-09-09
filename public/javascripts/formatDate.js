function formatDate(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInWeeks / 4);
  const diffInYears = Math.floor(diffInMonths / 12);



  if (diffInSeconds < 60) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
  return `${diffInYears} years ago`;
}

window.formatDate = formatDate;


// add the function to the review dates when the Dom is fully loaded

document.addEventListener('DOMContentLoaded', () => {
  const reviewDates = document.querySelectorAll('.review-date');
  reviewDates.forEach(dateElement => {
      const date = dateElement.getAttribute('data-date');
      dateElement.textContent = formatDate(date);
  });
});