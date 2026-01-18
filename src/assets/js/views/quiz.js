// src/assets/js/views/quiz.js

import { getQuizQuestions } from "../api/quizApi";
import { shuffleArray } from "../helpers/shuffle";

/**
 * Carrega i renderitza el qüestionari (quiz) en el contenidor especificat
 * @param {HTMLElement} container - Contenidor on es mostrarà el qüestionari
 */
export async function loadQuiz(container) {
    container.innerHTML = "<p>Carregant qüestionari...</p>";

    // Obtenir 10 preguntes de la categoria Animals (27)
    const questions = await getQuizQuestions(10, 27);

    const form = document.createElement("form");
    form.className = "quiz-form";

    // Crear una pregunta per a cada element de l'array
    questions.forEach((q, index) => {
        const fieldset = document.createElement("fieldset");
        fieldset.className = "question";
        fieldset.dataset.correct = q.correct_answer; // Emmagatzemar la resposta correcta

        const legend = document.createElement("legend");
        legend.innerHTML = q.question;

        fieldset.appendChild(legend);

        // Barrejar les respostes (correcta + incorrectes)
        const answers = shuffleArray([
            q.correct_answer,
            ...q.incorrect_answers
        ]);

        // Crear una opció per a cada resposta possible
        answers.forEach(answer => {
            const label = document.createElement("label");

            label.innerHTML = `
                <input type="radio" name="q${index}" value="${answer}">
                ${answer}
            `;

            fieldset.appendChild(label);
        });

        form.appendChild(fieldset);
    });

    // Botó per avaluar les respostes
    const btn = document.createElement("button");
    btn.type = "submit";
    btn.textContent = "Avalua";
    btn.disabled = true; // Inicialment desactivat

    form.appendChild(btn);
    container.innerHTML = "";
    container.appendChild(form);

    // Habilitar el botó només quan totes les preguntes estiguin respostes
    form.addEventListener("change", () => {
        const answered = questions.every((_, i) =>
            form.querySelector(`input[name="q${i}"]:checked`)
        );
        btn.disabled = !answered;
    });

    // Enviar el formulari per avaluar les respostes
    form.addEventListener("submit", e => {
        e.preventDefault();
        evaluateQuiz(form, questions);
        btn.remove(); // Eliminar el botó després d'avaluar
    });
}

/**
 * Avalua les respostes del qüestionari i mostra els resultats
 * @param {HTMLFormElement} form - Formulari amb les respostes seleccionades
 * @param {Array} questions - Array amb les preguntes i les respostes correctes
 */
function evaluateQuiz(form, questions) {
    let score = 0;

    questions.forEach((q, index) => {
        const selected = form.querySelector(`input[name="q${index}"]:checked`);
        const fieldset = selected.closest("fieldset");
        const correct = q.correct_answer;

        // Destacar les respostes correctes i incorrectes
        fieldset.querySelectorAll("label").forEach(label => {
            const input = label.querySelector("input");

            // Marcar la resposta correcta
            if (input.value === correct) {
                label.classList.add("correct");
            }

            // Marcar la resposta incorrecta seleccionada
            if (input.checked && input.value !== correct) {
                label.classList.add("wrong");
            }
        });

        // Incrementar la puntuació si la resposta és correcta
        if (selected.value === correct) score++;
    });

    // Mostrar el resultat final
    const result = document.createElement("p");
    result.className = "quiz-result";
    result.textContent = `Has encertat ${score} de ${questions.length} preguntes!`;

    form.appendChild(result);
}