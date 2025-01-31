document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenu = document.getElementById('close-menu');
    const sidebar = document.getElementById('sidebar');
    const portfolioLink = document.getElementById('portfolio-link');
    const portfolioSubmenu = document.getElementById('portfolio-submenu');

    menuToggle.addEventListener('click', function() {
        sidebar.style.width = '300px';
    });

    closeMenu.addEventListener('click', function() {
        sidebar.style.width = '0';
        portfolioSubmenu.style.display = 'none';
    });

    portfolioLink.addEventListener('click', function(e) {
        e.preventDefault();
        portfolioSubmenu.style.display = portfolioSubmenu.style.display === 'block' ? 'none' : 'block';
    });

    // Close the sidebar when clicking outside of it
    document.addEventListener('click', function(event) {
        if (!sidebar.contains(event.target) && event.target !== menuToggle) {
            sidebar.style.width = '0';
            portfolioSubmenu.style.display = 'none';
        }
    });
});