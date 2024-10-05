document.getElementById("menu-toggle").addEventListener("click", function() {
    document.getElementById("sidebar").style.width = "250px"; /* Slide the menu in */
});

document.getElementById("close-menu").addEventListener("click", function() {
    document.getElementById("sidebar").style.width = "0"; /* Slide the menu out */
});
document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll(".section");

    // Function to check if element is in viewport
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    // Function to reveal section when it comes into the viewport
    const revealSection = () => {
        sections.forEach(section => {
            if (isInViewport(section)) {
                section.classList.add("reveal");
            }
        });
    };

    // Trigger the reveal when scrolling
    window.addEventListener("scroll", revealSection);
    revealSection(); // Initial check in case some sections are already visible
});
