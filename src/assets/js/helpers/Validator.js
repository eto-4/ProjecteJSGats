// src/assets/js/helpers/Validator.js

/**
 * Classe Validator
 * Conté mètodes estàtics per a validar diferents tipus de dades
 * Utilitza expressions regulars i verificacions per assegurar la qualitat de les dades
 */
export default class Validator {

    /**
     * Valida que un valor sigui una cadena de text no buida
     * @param {*} value - Valor a validar
     * @returns {string} - Text netejat o cadena buida si no és vàlid
     */
    static string(value) {
        return typeof value === "string" && value.trim() !== ""
            ? value.trim()
            : "";
    }

    /**
     * Valida que un valor sigui una cadena de text o retorna null
     * @param {*} value - Valor a validar
     * @returns {string|null} - Text netejat o null si no és vàlid
     */
    static nullableString(value) {
        return typeof value === "string" && value.trim() !== ""
            ? value.trim()
            : null;
    }

    /**
     * Valida que un valor sigui un número vàlid
     * @param {*} value - Valor a validar
     * @returns {number|null} - Número vàlid o null si no ho és
     */
    static number(value) {
        const n = Number(value);
        return Number.isFinite(n) 
            ? n 
            : null;
    }

    /**
     * Assegura que un número estigui dins d'un rang específic
     * @param {*} value - Valor a validar
     * @param {number} min - Valor mínim permès
     * @param {number} max - Valor màxim permès
     * @returns {number} - Número dins del rang [min, max]
     */
    static range(value, min, max) {
        const n = Number(value);
        if (!Number.isFinite(n)) return min;
        return Math.min(Math.max(n, min), max);
    }

    /**
     * Valida que un text coincideixi amb una expressió regular
     * @param {string} value - Text a validar
     * @param {RegExp} regex - Expressió regular a utilitzar
     * @returns {boolean} - True si coincideix, false si no
     */
    static match(value, regex) {
        return this.string(value) && regex.test(value);
    }

    /**
     * Valida una adreça de correu electrònic
     * @param {string} value - Adreça de correu a validar
     * @returns {boolean} - True si és vàlid, false si no
     */
    static email(value) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return this.match(value, emailRegex);
    }

    /**
     * Valida un nom o cognoms (accepta lletres, accents, dièresis, punts i espais)
     * @param {string} value - Nom o cognoms a validar
     * @returns {boolean} - True si és vàlid, false si no
     */
    static name(value) {
        const nameRegex = /^[a-zA-ZàèìòùÀÈÌÒÙáéíóúÁÉÍÓÚäëïöüÄËÏÖÜñÑçÇ\s·\.]+$/u;
        return this.match(value, nameRegex);
    }

    /**
     * Valida que un valor estigui dins d'una llista de valors permesos
     * @param {*} value - Valor a validar
     * @param {Array} allowed - Array de valors permesos
     * @returns {boolean} - True si està a la llista, false si no
     */
    static oneOf(value, allowed) {
        return allowed.includes(value);
    }

    /**
     * Valida que una data sigui vàlida
     * @param {string} value - Data a validar
     * @returns {boolean} - True si és una data vàlida, false si no
     */
    static validDate(value) {
        return !isNaN(Date.parse(value));
    }
}