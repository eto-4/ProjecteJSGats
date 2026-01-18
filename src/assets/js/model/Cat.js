// src/assets/js/model/Cat.js

import Validator from '../helpers/Validator';

/**
 * Classe Cat que representa un gat amb totes les seves dades
 * Utilitza el Validador per assegurar la integritat de les dades entrants
 */
export default class Cat 
{
    /**
     * Constructor de la classe Cat
     * @param {Object} raw - Objecte brut amb les dades del gat de l'API
     */
    constructor(raw) 
    {
        // Identificació bàsica
        this.id = Validator.string(raw.id);
        this.name = Validator.string(raw.name);
        this.altNames = Validator.nullableString(raw.alt_names);

        // Informació descriptiva
        this.temperament = Validator.string(raw.temperament);
        this.origin = Validator.string(raw.origin);
        this.description = Validator.string(raw.description);

        // Trets del gat amb puntuacions de 1 a 5
        this.traits = {
            adaptability:  Validator.range(raw.adaptability , 1 , 5),
            affection:     Validator.range(raw.affection    , 1 , 5),
            intelligence:  Validator.range(raw.intelligence , 1 , 5),
            childFriendly: Validator.range(raw.childFriendly, 1 , 5),
            dogFriendly:   Validator.range(raw.dogFriendly  , 1 , 5),
            healthIssues:  Validator.range(raw.healthIssues , 0 , 5), // 0-5 per a problemes de salut
            vocalisation:  Validator.range(raw.vocalisation , 1 , 5),
            energy:        Validator.range(raw.energy       , 1 , 5),
        };

        // Característiques físiques
        this.physical = {
            shortLegs: Boolean(raw.shortLegs),
            hairless: Boolean(raw.hairless),
        };

        // Informació de la imatge
        this.image = {
            url: Validator.nullableString(raw.image?.url),
            width: Validator.number(raw.image?.width),
            height: Validator.number(raw.image?.height)
        };
    }
}