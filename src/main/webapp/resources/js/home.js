/**
 * Homepage Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    // Just a welcome effect or initialization if needed
    console.log("Welcome to Cafeteria Management System");

    // Example: Parallax effect or dynamic greeting could go here
    const hero = document.querySelector('.hero h1');
    if (!hero) return;

    hero.addEventListener('mouseover', () => {
        hero.style.color = '#e67e22'; // subtle interactive color change
        hero.style.transition = 'color 0.5s ease';
    });

    hero.addEventListener('mouseout', () => {
        hero.style.color = '#ffffff';
    });
});
/**
 * Homepage Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    // Just a welcome effect or initialization if needed
    console.log("Welcome to Cafeteria Management System");

    // Example: Parallax effect or dynamic greeting could go here
    const hero = document.querySelector('.hero h1');
    hero.addEventListener('mouseover', () => {
        hero.style.color = '#e67e22'; // subtle interactive color change
        hero.style.transition = 'color 0.5s ease';
    });

    hero.addEventListener('mouseout', () => {
        hero.style.color = '#ffffff';
    });
});
