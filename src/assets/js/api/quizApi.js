// src/assets/js/api/quizApi.js

export async function getQuizQuestions(amount = 10, category = 27) {
    const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&type=multiple`;

    const res = await fetch(url);
    const data = await res.json();

    return data.results;
}
