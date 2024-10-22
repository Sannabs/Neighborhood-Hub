document.querySelector('.show-map-button').addEventListener('click', () => {
    window.location.href = `https://www.google.com/maps/dir/?api=1&origin=current+location&destination=${neighborhood.location}&travelmode=driving`;
});
