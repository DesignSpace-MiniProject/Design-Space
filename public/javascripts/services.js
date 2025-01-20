document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenu = document.getElementById('close-menu');
    const sidebar = document.getElementById('sidebar');
    const portfolioLink = document.getElementById('portfolio-link');
    const portfolioSubmenu = document.getElementById('portfolio-submenu');

    menuToggle.addEventListener('click', function() {
        sidebar.style.width = '250px';
    });

    closeMenu.addEventListener('click', function() {
        sidebar.style.width = '0';
    });

    portfolioLink.addEventListener('click', function(e) {
        e.preventDefault();
        portfolioSubmenu.style.display = portfolioSubmenu.style.display === 'block' ? 'none' : 'block';
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && e.target !== menuToggle) {
            sidebar.style.width = '0';
        }
    });

    // Smooth scroll for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
});

