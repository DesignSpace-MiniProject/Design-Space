
document.getElementById("menu-toggle").onclick = function() {
    document.getElementById("sidebar").style.width = "300px"; }

document.getElementById("close-menu").onclick = function() {
    document.getElementById("sidebar").style.width = "0"; 
};

document.getElementById("portfolio-link").onclick = function() {
    const submenu = document.getElementById("portfolio-submenu");
    
    if (submenu.style.display === "none" || submenu.style.display === "") {
        submenu.style.display = "block"; 
    } else {
        submenu.style.display = "none"; 
    }
};
window.onscroll = function() {
    const additionalContent = document.getElementById("additionalContent");
    const scrollPosition = window.scrollY || window.pageYOffset;

    // Show the additional content when scrolled 300px down
    if (scrollPosition > 300) {
        additionalContent.classList.add("visible");
    } else {
        additionalContent.classList.remove("visible");
    }
};
document.getElementById('menu-toggle').addEventListener('click', function () {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('active');
});
