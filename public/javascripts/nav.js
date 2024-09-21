const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');

  burger.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});