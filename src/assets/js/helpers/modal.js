// src/assets/js/helpers/modal.js

/**
 * Mòdul per a la gestió del modal de detalls del gat
 * Conté funcions per obrir el modal i construir el contingut dinàmicament
 */

const modal = document.getElementById("catModal");

/**
 * Construeix una descripció personalitzada per al gat
 * @param {Object} cat - Objecte amb les dades del gat
 * @param {string} cat.name - Nom del gat
 * @param {string} cat.altNames - Noms alternatius del gat
 * @param {string} cat.origin - Origen del gat
 * @param {string} cat.temperament - Temperament del gat
 * @param {Object} cat.physical - Característiques físiques del gat
 * @param {boolean} cat.physical.hairless - Si el gat és sense pèl
 * @param {boolean} cat.physical.shortLegs - Si el gat té cames curtes
 * @returns {string} - Descripció HTML formatejada del gat
 */
function buildCustomDescription(cat) {
    const altNames = cat.altNames
        ? `, també conegut com a ${cat.altNames}`
        : "";

    const hairlessText = cat.physical.hairless
        ? "És una raça sense pèl"
        : "Té un pelatge tradicional";

    const legsText = cat.physical.shortLegs
        ? "i cames curtes"
        : "i un cos ben proporcionat";

    return `
        <p>
            El gat <strong>${cat.name}</strong>${altNames} és una raça originària de 
            <strong>${cat.origin}</strong>. És conegut pel seu temperament 
            <em>${cat.temperament}</em>.
        </p>

        <p>
            ${hairlessText} ${legsText}, cosa que influeix directament en la seva aparença
            i cura. Destaca especialment pel seu nivell d'intel·ligència
            i adaptabilitat a l'entorn familiar.
        </p>
    `;
}

/**
 * Construeix una llista HTML de trets del gat
 * @param {Object} traits - Objecte amb els trets del gat i les seves puntuacions
 * @returns {string} - Llista HTML dels trets
 */
function buildTraitsList(traits) {
    return Object.entries(traits)
        .map(([key, value]) => {
            // Formatejar el nom del tret (ex: 'dogFriendly' → 'Dog Friendly')
            const label = key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, c => c.toUpperCase());

            return `<li>${label}: ${value}/5</li>`;
        })
        .join("");
}

/**
 * Obre el modal amb les dades del gat
 * @param {Object} cat - Objecte amb totes les dades del gat
 */
export function openCatModal(cat) {
    document.getElementById("modal-cat-name").textContent = cat.name;
    document.getElementById("modal-cat-origin").textContent = cat.origin;

    const descriptionEl = document.getElementById("modal-cat-description");
    descriptionEl.innerHTML = buildCustomDescription(cat);

    const img = document.getElementById("modal-cat-image");
    if (cat.image.url) {
        img.src = cat.image.url;
        img.style.display = "block";
    } else {
        img.style.display = "none";
    }

    const traits = document.getElementById("modal-cat-traits");
    traits.innerHTML = buildTraitsList(cat.traits);

    modal.classList.add("show");
}

/**
 * Tanca el modal
 */
export function closeCatModal() {
    modal.classList.remove("show");
}