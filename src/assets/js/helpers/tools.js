// src/assets/js/helpers/tools.js

/**
 * Trunca un text a una longitud màxima afegint punts suspensius si cal
 * @param {string} text - Text a truncar
 * @param {number} max - Longitud màxima permesa (sense incloure els punts suspensius)
 * @returns {string} - Text truncat amb '...' si supera la longitud, o el text original si no
 */
export function truncate(text, max) {
    return text.length > max
        ? text.slice(0, max) + '...'
        : text;
}