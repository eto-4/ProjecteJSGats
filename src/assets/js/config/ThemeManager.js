// themeManager.js

/**
 * Gestor de temes per a l'aplicació ProjecteJs
 * Gestiona el canvi de temes de color, l'emmagatzematge a localStorage
 * i la sincronització amb les preferències del sistema.
 */
class ThemeManager {
    /**
     * Constructor de la classe ThemeManager
     * Inicialitza les variables i crida al mètode init()
     */
    constructor() {
        this.themeButtons = document.querySelectorAll('.theme-color-btn');
        this.currentTheme = this.getSavedTheme() || 'default';
        this.init();
    }

    /**
     * Inicialitza el gestor de temes
     * Aplica el tema guardat, configura esdeveniments i actualitza l'estat
     */
    init() {
        // Aplicar el tema guardat en carregar
        this.applyTheme(this.currentTheme);
        
        // Afegir esdeveniments als botons
        this.themeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const theme = button.dataset.theme;
                this.changeTheme(theme);
            });
        });
        
        // Actualitzar botó actiu
        this.updateActiveButton();
        
        // Carregar el tema a l'inici (per si hi ha retard en el DOM)
        document.addEventListener('DOMContentLoaded', () => {
            this.applyTheme(this.currentTheme);
        });
    }

    /**
     * Obté el tema guardat a localStorage
     * @returns {string} - El tema guardat o 'default' si no n'hi ha cap
     */
    getSavedTheme() {
        return localStorage.getItem('appTheme') || 'default';
    }

    /**
     * Desa el tema actual a localStorage
     * @param {string} theme - Nom del tema a desar
     */
    saveTheme(theme) {
        localStorage.setItem('appTheme', theme);
    }

    /**
     * Aplica un tema específic a la pàgina
     * @param {string} theme - Nom del tema a aplicar
     */
    applyTheme(theme) {
        // Eliminar totes les classes de tema
        document.body.classList.remove(
            'theme-dark-purple',
            'theme-blue-dark',
            'theme-green-dark',
            'theme-light-mode'
        );
        
        // Si no és el tema per defecte, afegir la classe
        if (theme !== 'default') {
            document.body.classList.add(`theme-${theme}`);
        }
        
        // Guardar tema actual
        this.currentTheme = theme;
        this.saveTheme(theme);
        this.updateActiveButton();
        
        // Disparar esdeveniment personalitzat
        this.dispatchThemeChangeEvent();
    }

    /**
     * Canvia el tema actual i aplica animació de confirmació
     * @param {string} theme - Nom del tema a canviar
     */
    changeTheme(theme) {
        this.applyTheme(theme);
        
        // Animació de confirmació
        const button = document.querySelector(`[data-theme="${theme}"]`);
        if (button) {
            button.classList.add('theme-change-animation');
            setTimeout(() => {
                button.classList.remove('theme-change-animation');
            }, 300);
        }
    }

    /**
     * Actualitza l'aparença dels botons per reflectir el tema actiu
     */
    updateActiveButton() {
        this.themeButtons.forEach(button => {
            button.classList.remove('active');
            if (button.dataset.theme === this.currentTheme) {
                button.classList.add('active');
            }
        });
    }

    /**
     * Dispara un esdeveniment personalitzat quan canvia el tema
     * Permet que altres components reaccionin al canvi
     */
    dispatchThemeChangeEvent() {
        const event = new CustomEvent('themeChanged', {
            detail: { theme: this.currentTheme }
        });
        document.dispatchEvent(event);
    }

    /**
     * Obté el tema actualment actiu
     * @returns {string} - Nom del tema actual
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Alterna entre mode fosc i clar
     * Útil per a un interruptor ràpid de tema
     */
    toggleDarkLight() {
        const isDark = this.currentTheme === 'default' || 
                      this.currentTheme.includes('dark') || 
                      this.currentTheme === 'dark-purple' || 
                      this.currentTheme === 'blue-dark' || 
                      this.currentTheme === 'green-dark';
        
        if (isDark) {
            this.changeTheme('light-mode');
        } else {
            this.changeTheme('default');
        }
    }
}

// Inicialitzar el gestor de temes
const themeManager = new ThemeManager();
themeManager.init();

// Exportar per a ús global si és necessari
window.themeManager = themeManager;

// Escoltar canvis de tema en altres components
document.addEventListener('themeChanged', (e) => {
    console.log(`Tema canviat a: ${e.detail.theme}`);
    
    // Actualitzar metatema per a navegadors i PWA
    const themeColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-bg').trim();
    
    // Actualitzar meta tag theme-color
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = themeColor;
});

/**
 * Detecta el tema del sistema operatiu
 * @returns {string} - 'default' per a mode fosc, 'light-mode' per a mode clar
 */
function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'default';
    } else {
        return 'light-mode';
    }
}

// Opcional: Escoltar canvis en la preferència del sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    // Només canviar si no hi ha un tema guardat explícitament
    if (!localStorage.getItem('appTheme')) {
        themeManager.changeTheme(e.matches ? 'default' : 'light-mode');
    }
});

export { themeManager };