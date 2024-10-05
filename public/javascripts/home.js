document.getElementById("menu-toggle").addEventListener("click", function() {
    document.getElementById("sidebar").style.width = "250px"; /* Slide the menu in */
});

document.getElementById("close-menu").addEventListener("click", function() {
    document.getElementById("sidebar").style.width = "0"; /* Slide the menu out */
});
