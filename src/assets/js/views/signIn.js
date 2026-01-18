// src/assets/js/views/signIn.js

import Validator from "../helpers/Validator";
import User from "../model/User";

/**
 * Carrega i gestiona el formulari de registre d'usuari
 * Inclou validació en temps real, càlcul d'edat i enviament a una API
 * @param {HTMLElement} container - Contenidor on es renderitzarà el formulari
 */
export function loadSignIn(container) {
    // Generar l'estructura HTML del formulari
    container.innerHTML = `
        <form id="signInForm" class="signin-form">

            <label for="name">
                Nom
                <input type="text" id="name" placeholder="Introdueix el teu NOM en aquest camp">
                <small class="error"></small>
            </label>

            <label for="surname">
                Cognoms
                <input type="text" id="surname" placeholder="Introdueix el teu COGNOM en aquest camp">
                <small class="error"></small>
            </label>

            <label for="email">
                Email
                <input type="email" id="email" placeholder="Introdueix el teu CORREU en aquest camp">
                <small class="error"></small>
            </label>

            <label for="gender">
                Gènere
                <select id="gender">
                    <option value="">Selecciona</option>
                    <option value="home">Home</option>
                    <option value="dona">Dona</option>
                    <option value="altre">Altre</option>
                </select>
                <small class="error"></small>
            </label>

            <label for="birth">
                Data naixement
                <input type="date" id="birth">
                <small class="error"></small>
            </label>

            <label for="age">
                Edat
                <input type="number" id="age" disabled placeholder="Aquest camp es calcula automàticament.">
            </label>

            <button type="submit" id="submitBtn" disabled>
                Enviar
            </button>

        </form>
    `;

    // Referències als elements del DOM
    const form = document.getElementById("signInForm");
    const submitBtn = document.getElementById("submitBtn");

    // Objecte amb referències a tots els inputs per accés fàcil
    const inputs = {
        name: document.getElementById("name"),
        surname: document.getElementById("surname"),
        email: document.getElementById("email"),
        gender: document.getElementById("gender"),
        birth: document.getElementById("birth"),
        age: document.getElementById("age")
    };

    // Seguiment dels camps que han estat tocats (per mostrar errors només després)
    const touched = {
        name: false,
        surname: false,
        email: false,
        gender: false,
        birth: false
    };

    // Estat de la validació per a cada camp
    const validations = {
        name: false,  // Inicialment no vàlid
        surname: false,
        email: false,
        gender: false,
        birth: false
    };

    // Opcions vàlides per al camp de gènere
    const allowedGenders = ["home", "dona", "altre"];

    /**
     * Calcula l'edat a partir d'una data de naixement
     * @param {string} dateString - Data en format string (YYYY-MM-DD)
     * @returns {number} - Edat calculada en anys
     */
    function calculateAge(dateString) {
        const birth = new Date(dateString);
        const today = new Date();

        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        // Ajustar si encara no ha passat l'aniversari aquest any
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    }

    /**
     * Mostra o amaga missatges d'error en un camp del formulari
     * @param {HTMLInputElement|HTMLSelectElement} inputElement - Element d'input o select
     * @param {string} message - Missatge d'error a mostrar (cadena buida per amagar)
     */
    function showError(inputElement, message = "") {
        const errorElement = inputElement.nextElementSibling;
        if (!errorElement) return;

        if (message) {
            errorElement.textContent = message;
            errorElement.style.display = "block";
            inputElement.classList.add("error");
        } else {
            errorElement.textContent = "";
            errorElement.style.display = "none";
            inputElement.classList.remove("error");
        }
    }

    /**
     * Valida un camp individual del formulari
     * @param {string} fieldName - Nom del camp a validar
     * @param {string} value - Valor del camp
     * @returns {Object} - Objecte amb {isValid, errorMessage}
     */
    function validateField(fieldName, value) {
        let isValid = false;
        let errorMessage = "";

        switch (fieldName) {
            case 'name':
            case 'surname':
                // Validació amb RegExp per nom/cognoms
                isValid = Validator.name(value.trim()) && value.trim().length >= 2;
                if (!isValid) {
                    errorMessage = "Nom invàlid. Permet: lletres, accents, ç, ñ, punts i espais";
                }
                break;

            case 'email':
                // Validació amb RegExp per email
                isValid = Validator.email(value);
                if (!isValid) {
                    errorMessage = "Email invàlid. Ha de tenir format: usuari@domini.com";
                }
                break;

            case 'gender':
                // Validació que sigui una de les opcions permeses
                isValid = allowedGenders.includes(value);
                if (!isValid) {
                    errorMessage = "Selecciona un gènere vàlid";
                }
                break;

            case 'birth':
                // Validació de data no buida i vàlida
                if (!value) {
                    isValid = false;
                    errorMessage = "Data de naixement obligatòria";
                } else {
                    isValid = Validator.validDate(value);
                    if (isValid) {
                        const age = calculateAge(value);
                        inputs.age.value = age;
                        
                        // Validació que la data no sigui futura
                        const birthDate = new Date(value);
                        const today = new Date();
                        if (birthDate > today) {
                            isValid = false;
                            errorMessage = "La data no pot ser futura";
                        } else if (age > 120) {
                            isValid = false;
                            errorMessage = "Edat no vàlida";
                        }
                    } else {
                        errorMessage = "Data de naixement invàlida";
                    }
                }
                break;
        }

        return { isValid, errorMessage };
    }

    /**
     * Actualitza l'estat del botó d'enviar basant-se en la validació
     */
    function updateSubmitState() {
        const allValid = Object.values(validations).every(Boolean);
        submitBtn.disabled = !allValid;
    }

    /**
     * Valida tots els camps del formulari
     * @param {boolean} forceShowErrors - Forçar a mostrar errors encara que no s'hagin tocat
     * @returns {boolean} - True si tots els camps són vàlids
     */
    function validateAllFields(forceShowErrors = false) {
        let allValid = true;

        const fields = ['name', 'surname', 'email', 'gender', 'birth'];
        fields.forEach(field => {
            const input = inputs[field];
            const validation = validateField(field, input.value);
            validations[field] = validation.isValid;

            if (forceShowErrors) {
                touched[field] = true;
                showError(input, validation.errorMessage);
            }

            if (!validation.isValid) {
                allValid = false;
            }
        });

        updateSubmitState();
        return allValid;
    }

    /**
     * Valida un camp i mostra el missatge d'error si cal
     * @param {string} field - Nom del camp a validar
     */
    function validateAndShowError(field) {
        touched[field] = true;

        const input = inputs[field];
        const { isValid, errorMessage } = validateField(field, input.value);

        validations[field] = isValid;

        if (touched[field]) {
            showError(input, errorMessage);

            if (isValid) {
                input.classList.add("valid");
                input.classList.remove("error");
            } else {
                input.classList.remove("valid");
            }
        }

        updateSubmitState();
    }

    // Configurar esdeveniments per als camps

    // Nom - validació en temps real i al perdre focus
    inputs.name.addEventListener('input', () => validateAndShowError('name'));
    inputs.name.addEventListener('blur', () => validateAndShowError('name'));

    // Cognoms - validació en temps real i al perdre focus
    inputs.surname.addEventListener('input', () => validateAndShowError('surname'));
    inputs.surname.addEventListener('blur', () => validateAndShowError('surname'));

    // Email - validació en temps real i al perdre focus
    inputs.email.addEventListener('input', () => validateAndShowError('email'));
    inputs.email.addEventListener('blur', () => validateAndShowError('email'));

    // Gènere - validació en canvi
    inputs.gender.addEventListener('change', () => validateAndShowError('gender'));

    // Data naixement - validació en canvi i al perdre focus
    inputs.birth.addEventListener('change', () => validateAndShowError('birth'));
    inputs.birth.addEventListener('blur', () => validateAndShowError('birth'));

    // Esdeveniment per al submit del formulari
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validar tots els camps abans d'enviar
        if (!validateAllFields()) {
            alert("Si us plau, corregeix els errors abans d'enviar");
            return;
        }

        // Desactivar botó durant l'enviament
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Enviant...";

        try {
            // Crear objecte usuari amb les dades del formulari
            const user = new User({
                name: inputs.name.value.trim(),
                surname: inputs.surname.value.trim(),
                email: inputs.email.value.trim(),
                gender: inputs.gender.value,
                birth: inputs.birth.value,
                age: inputs.age.value
            });

            // Fer petició POST a dummyjson.com
            const response = await fetch('https://dummyjson.com/users/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            });

            // Verificar si la resposta és correcta
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // Mostrar missatge d'èxit
            alert("Usuari donat d'alta correctament");

            // Netejar formulari
            form.reset();
            inputs.age.value = "";

            // Reiniciar estat intern
            Object.keys(validations).forEach(key => validations[key] = false);
            Object.keys(touched).forEach(key => touched[key] = false);

            // Netejar estats visuals
            Object.values(inputs).forEach(input => {
                if (!input) return;
                input.classList.remove("error", "valid");
                showError(input, "");
            });

            updateSubmitState();

        } catch (error) {
            // Mostrar missatge d'error
            console.error("Error en la petició:", error);
            alert("Error en el registre. Si us plau, torna-ho a provar.");
        } finally {
            // Restaurar botó
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            updateSubmitState();
        }
    });
}