const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');

  burger.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});






function handleActiveLink(container) { 
  const links = container.querySelectorAll('a');
  
  const currentUrl = window.location.href;
  let isActiveLinkFound = false;

  links.forEach(link => {
    if (link.href === currentUrl) {
      link.classList.add('active');
      isActiveLinkFound = true;
    } else {
      link.classList.remove('active');
    }
  });

  if (!isActiveLinkFound) {
    links.forEach(link => link.classList.remove('active'));
  }

  links.forEach(link => {
    link.addEventListener('click', handleClick);
  });

  function handleClick(e) {
    links.forEach(link => link.classList.remove('active'));

    e.target.classList.add('active');
    localStorage.setItem('activeLink', e.target.href);
  }
}

handleActiveLink(document.querySelector('nav .mobile-links'));
handleActiveLink(document.querySelector('nav .links'));
handleActiveLink(document.querySelector('nav .home-link'));
handleActiveLink(document.querySelector('nav .home-mobile-link'));
