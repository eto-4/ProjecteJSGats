// src/assets/js/model/User.js
/**
 * Classe User que representa un usuari del sistema
 * Gestiona les dades personals d'un usuari amb validació
 */
export default class User 
{
    /**
     * Constructor de la classe User
     * @param {Object} userData - Objecte amb les dades de l'usuari
     * @param {string} userData.name - Nom de l'usuari
     * @param {string} userData.surname - Cognoms de l'usuari
     * @param {string} userData.email - Adreça electrònica de l'usuari
     * @param {string} userData.gender - Gènere de l'usuari
     * @param {string} userData.birthDate - Data de naixement de l'usuari
     * @property {number} userData.age - Edat de l'usuari
     */
    constructor({name, surname, email, gender, birthDate}) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.gender = gender;
        this.birthDate = birthDate;
        this.age = age;
    }
}