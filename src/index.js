// src/index.js

/**
 * Punt d'entrada principal de l'aplicació ProjecteJs
 * Gestiona el router, la navegació entre pàgines i els components globals
 */

// Importacions de les pàgines
import { loadPosts } from "./assets/js/views/posts";
import { loadClock, unloadClock } from "./assets/js/views/clock";
import { loadSignIn } from "./assets/js/views/signIn";
import { loadQuiz } from "./assets/js/views/quiz";

// Importació del gestor de temes
import { themeManager } from "./assets/js/config/ThemeManager.js";

// Importació del helper per al desplaçament
import { scrollToTop } from "./assets/js/helpers/scrollTop";

// Referència al botó de desplaçament amunt
const btn = document.getElementById("scrollTopBtn");

// Listener per mostrar/amagar el botó en funció del desplaçament
window.addEventListener("scroll", () => {
    btn.style.display = window.scrollY > 400 ? "block" : "none";
});

// Listener per desplaçar amunt en fer clic
btn.addEventListener("click", () => scrollToTop());

// Objecte que mapeja les rutes amb les seves funcions de càrrega
const routes = {
    posts: loadPosts,
    clock: loadClock,
    signIn: loadSignIn,
    quiz: loadQuiz
};

// Variable per desar la pàgina actual
let currentPage = null;

/**
 * Navega a una pàgina específica i actualitza la interfície
 * @param {string} page - Nom de la pàgina a carregar
 */
function navigate(page) {
    const container = document.getElementById('tabContent');
    const sliderContainer = document.getElementById('slider');
    const sliderOw = document.getElementById('slider-ow');
    const catModal = document.getElementById("catModal");

    // Aturar el rellotge si canviem de pàgina i sortim de 'clock'
    if (currentPage === "clock" && page !== "clock") {
        unloadClock();
    }

    const currentTab = document.getElementById(`${page}`);
    
    // Actualitzar les pestanyes actives
    document.querySelectorAll(".tab").forEach(tab =>
        tab.classList.remove("tab-active")
    );
    currentTab?.classList.add("tab-active");

    // Netejar el contenidor
    container.innerHTML = "";

    // Configurar el layout segons la pàgina
    if (page === "posts") {
        if (sliderContainer) sliderContainer.style.display = "block";
        if (sliderOw) sliderOw.style.display = "block";
        container.style.gridArea = "2 / 1 / 3 / 5";
    } else {
        if (sliderContainer) sliderContainer.style.display = "none";
        if (sliderOw) sliderOw.style.display = "none";
        container.style.gridArea = "2 / 2 / 3 / 5";
    }

    // Carregar la pàgina corresponent
    routes[page]?.(container, sliderContainer);
    currentPage = page;
}

// Listener global per als esdeveniments de clic
document.addEventListener("click", e => {
    // Detectar clic en enllaços de navegació
    const link = e.target.closest("[data-page]");
    if (link) {
        e.preventDefault();
        navigate(link.dataset.page);
        return;
    }

    // Tancar el modal del gat
    if (
        e.target.classList.contains("close-btn") ||
        e.target.id === "catModal"
    ) {
        document.getElementById("catModal")?.classList.remove("show");
    }
});

// Carregar la pàgina principal al iniciar
navigate("posts");