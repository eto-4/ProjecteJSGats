// src/assets/js/helpers/shuffle.js

/**
 * Barreja aleatòriament els elements d'un array
 * @param {Array} arr - L'array a barrejar
 * @returns {Array} - Una nova instància de l'array amb els elements barrejats
 */
export function shuffleArray(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}