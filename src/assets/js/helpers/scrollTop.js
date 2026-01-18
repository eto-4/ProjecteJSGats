// src/assets/js/helpers/scrollTop.js

/**
 * Desplaça la finestra cap a la part superior de la pàgina
 * @param {boolean} smooth - Si és true, el desplaçament serà suau (animat)
 */
export function scrollToTop(smooth = true) {
    window.scrollTo({
        top: 0,
        behavior: smooth ? "smooth" : "auto"
    });
}