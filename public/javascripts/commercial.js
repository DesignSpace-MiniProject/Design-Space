const items = document.querySelectorAll('.item');
let activeIndex = 0;

function updateCarousel() {
    const totalItems = items.length;
    
    items.forEach((item, index) => {
        item.classList.remove('active', 'left', 'right', 'hidden-left', 'hidden-right');
        
        if (index === activeIndex) {
            item.classList.add('active');
        } else if (index === (activeIndex - 1 + totalItems) % totalItems) {
            item.classList.add('left');
        } else if (index === (activeIndex + 1) % totalItems) {
            item.classList.add('right');
        } else if (index < activeIndex) {
            item.classList.add('hidden-left');
        } else {
            item.classList.add('hidden-right');
        }
    });
}

items.forEach((item, index) => {
    item.addEventListener('click', () => {
        activeIndex = index;
        updateCarousel();
    });
});

updateCarousel();