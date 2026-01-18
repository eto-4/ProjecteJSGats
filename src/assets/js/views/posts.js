// src/assets/js/views/posts.js
import { getCats } from '../api/catsApi';
import Cat from '../model/Cat';
import { truncate } from '../helpers/tools';
import { openCatModal } from '../helpers/modal';

// Importacions de tiny-slider per al carrusel
import { tns } from "tiny-slider/src/tiny-slider";
import "tiny-slider/dist/tiny-slider.css";

let sliderInstance = null;
let sliderInitialized = false;

/**
 * Carrega i renderitza els posts dels gats en el contenidor especificat
 * @param {HTMLElement} container - Contenidor on es mostraran els posts
 * @param {HTMLElement} sliderContainer - Contenidor per al carrusel de gats
 */
export function loadPosts(container, sliderContainer) {
    getCats().then(rawCats => {
        const cats = rawCats.map(raw => new Cat(raw));

        // NOMÉS INICIALITZAR EL SLIDER LA PRIMERA VEGADA
        if (!sliderInitialized) {
            renderSlider(cats, sliderContainer);

            sliderInstance = tns({
                container: sliderContainer,
                items: 1,
                slideBy: "page",
                autoplay: true,
                controls: false,
                nav: true,
                autoplayButtonOutput: false,
                gutter: 10,
                speed: 400
            });

            sliderInitialized = true;
        }

        renderPosts(cats, container);

        // Afegir esdeveniment per obrir el modal quan es cliqui "Read More"
        container.addEventListener("click", e => {
            const btn = e.target.closest("button[data-id]");
            if (!btn) return;

            const cat = cats.find(c => c.id === btn.dataset.id);
            if (cat) openCatModal(cat);
        });
    });
}

/**
 * Renderitza el carrusel (slider) amb les imatges dels gats
 * @param {Array<Cat>} cats - Array d'objectes Cat
 * @param {HTMLElement} sliderContainer - Contenidor per al slider
 */
function renderSlider(cats, sliderContainer) {
    sliderContainer.innerHTML = cats.map(cat => `
        <div class="slide">
            ${cat.image.url
                ? `<img src="${cat.image.url}" alt="${cat.name ?? 'cat'}-image">`
                : `<div class="no-image">No image</div>`
            }
        </div>`
    ).join("");
}

/**
 * Renderitza els posts individuals dels gats
 * @param {Array<Cat>} cats - Array d'objectes Cat
 * @param {HTMLElement} container - Contenidor on es mostraran els posts
 */
function renderPosts(cats, container) {
    container.innerHTML = cats.map(cat => `
        <article class="post">
            <div class="post-image-container" id="image-${cat.id}">
                ${cat.image.url
                  ? `<img src="${cat.image.url}" alt="${cat.name ?? 'cat'}-image">`
                  : `<div class="no-image">No image</div>`
                }
            </div>
            <div id="cat-${cat.id}-b-info" class="post-info">
                <h3>${cat.name}</h3>
                <p class="origin">${cat.origin}</p>
                <p>${truncate(cat.description, 50)}</p>
                <button data-id="${cat.id}">Read More</button>
            </div>
        </article>
    `).join('');
}