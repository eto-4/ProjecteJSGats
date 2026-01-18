// src/assets/js/api/catsApi.js

let catsCache = null;
/**
 * 
 * 
 * */ 
/**
 * WorkFlow
 * 1. fetch breeds
 * 2. Slice(limit)
 * 3. map - rawCatObject 
 * - 3.4. fetch images (Promise.all)
 * - 3.5. attach image data
 * - 3.6. store in cache
 * 4. return array
 */ 
export function getCats(limit = 15) {

    if (catsCache) return Promise.resolve(catsCache);

    return fetch("https://api.thecatapi.com/v1/breeds")
        .then(response => response.json())

        // 1. Tenim les raçes
        .then(breeds => {

            // 2. Limit de quantitat de raçes.
            const selected = breeds.slice(0, limit)

            // 💡 Idea de millora de qualitat de dades:
            // Podríem assegurar-nos que tots els gats seleccionats tinguin imatge.
            // 1. Slice inicial per limitar el nombre de gats.
            // 2. Guardar els índexs dels objectes sense imatge en un array temporal.
            // 3. Recórrer l'array complet de races buscant prou gats amb imatge.
            // 4. Reemplaçar els objectes sense imatge només quan tinguem suficients candidats.
            // Això mantindria l'ordre original i evitaria buits, però per a aquest projecte bàsic
            // no és estrictament necessari, i podem deixar els objectes sense imatge com a null.
            // Si sobra temps, es podria implementar com a refinament.
            
            // 3. crear objectes base
            const catsBase = selected.map(cat => ({
                id: cat.id,
                name: cat.name,
                altNames: cat.alt_names || null,

                temperament: cat.temperament,
                origin: cat.origin,
                description: cat.description,

                adaptability: cat.adaptability,
                affection: cat.affection_level,
                intelligence: cat.intelligence,
                childFriendly: cat.child_friendly,
                dogFriendly: cat.dog_friendly,
                healthIssues: cat.health_issues,
                vocalisation: cat.vocalisation,
                energy: cat.energy_level,

                shortLegs: cat.short_legs,
                hairless: cat.hairless,
                life_span: cat.life_span,
                
                image: {
                    id: cat.reference_image_id || null
                }
            }));

            // 4. Preparar fetches de imatges
            const imagePromises = catsBase.map(cat => {

                if (!cat.image.id) return Promise.resolve(cat);

                return fetch(`https://api.thecatapi.com/v1/images/${cat.image.id}`)
                    .then(res => res.json())
                    .then(img => {
                        cat.image = {
                            url: img.url,
                            width: img.width,
                            height: img.height
                        };
                        return cat;
                    })
                    .catch(() => {
                        cat.image = { url: null, width: null, height: null };
                        return cat;
                    });
            });

            // 5. Esperem totes les imatges.
            return Promise.all(imagePromises);
        })

        // 6.guardem el cache i el retornem
        .then(cats => {
            catsCache = cats;
            return catsCache;
        })
}