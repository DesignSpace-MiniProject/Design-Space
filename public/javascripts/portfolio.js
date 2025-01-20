// Carousel functionality
const carousel = document.getElementById('carousel');
const items = document.querySelectorAll('.item');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let activeIndex = 0;
let startX, moveX;

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

function moveCarousel(direction) {
    const totalItems = items.length;
    activeIndex = (activeIndex + direction + totalItems) % totalItems;
    updateCarousel();
}

items.forEach((item, index) => {
    item.addEventListener('click', () => {
        activeIndex = index;
        updateCarousel();
    });
});

prevBtn.addEventListener('click', () => moveCarousel(-1));
nextBtn.addEventListener('click', () => moveCarousel(1));

// Touch events for mobile swipe
carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

carousel.addEventListener('touchmove', (e) => {
    moveX = e.touches[0].clientX;
});

carousel.addEventListener('touchend', () => {
    if (startX - moveX > 50) {
        moveCarousel(1); // Swipe left
    } else if (moveX - startX > 50) {
        moveCarousel(-1); // Swipe right
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        moveCarousel(-1);
    } else if (e.key === 'ArrowRight') {
        moveCarousel(1);
    }
});

// Auto-rotate carousel
let autoRotateInterval = setInterval(() => moveCarousel(1), 5000);

carousel.addEventListener('mouseenter', () => {
    clearInterval(autoRotateInterval);
});

carousel.addEventListener('mouseleave', () => {
    autoRotateInterval = setInterval(() => moveCarousel(1), 5000);
});

// Initial carousel setup
updateCarousel();

// User menu functionality
const userMenu = document.querySelector('.user-menu');
const userDropdown = document.querySelector('.user-dropdown');

if (userMenu) {
    userMenu.addEventListener('click', (event) => {
        event.stopPropagation();
        userDropdown.classList.toggle('active');
    });

    // Close the dropdown when clicking outside
    document.addEventListener('click', () => {
        userDropdown.classList.remove('active');
    });
}

// Wishlist functionality
document.querySelectorAll('.wishlist-btn').forEach(button => {
    button.addEventListener('click', () => {
        const postId = button.getAttribute('data-post-id');

        fetch('/wishlist/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postId }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Added to Wishlist');
                } else {
                    alert('Could not add to Wishlist');
                }
            });
    });
});
