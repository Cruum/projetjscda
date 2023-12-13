
let section = document.getElementById('mainSection')
const button = document.getElementById('buttonSubmit');
const form = document.getElementById('form');
const galerie = document.getElementById('galerie');
const filtres = document.getElementById('filtres');

let arrayQuestions = [
    ["Pika pika?", ["Attaque éclair", "Coup de taser dans sa g****", "pokeball go!", "réponse 42"], ["pokeball go!"]],
    ["Quel est le badge pour utiliser la compétence surf sur la première génération?", ["Pikachu attaque éclair!", "Badge eau", "glouglouglou", "Badge ame"], ["Badge ame"]],
    ["Qui est l'évolution de Qulbutoké", ["Okéoké", "Qulbutokéké", "Pikachu attaque éclair!", "A pas"], ["A pas"]]
]

arrayQuestions.forEach((question, index) => {
    section.innerHTML += `<p>${index + 1}. ${question[0]}</p>`;

    question[1].forEach((option) => {
        section.innerHTML += `<label>
                                <input type="radio" name="question ${index}" value="${option}">
                                ${option}
                              </label>
                              <br>`;
    });
});
let reponse = {}
form.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(form);
console.log(formData);
    reponse = new Map();

    formData.forEach((value, key) => {
        reponse.set(key, value);
    });

    alert(calcResponseQuestions(reponse))
})

function calcResponseQuestions(responses) {
    let score = 0;
    arrayQuestions.forEach((question, index) => {
        const userReponse = responses.get(`question ${index}`);
        const correctReponse = question[2][0];

        (userReponse === correctReponse) ? score++ : score;
    })


    let local = localStorage.getItem('userScore')
    let scoreActuel = score - local;


    if (local) {
        let alert = (scoreActuel > 0) ? `Bien joué, tu as été meilleur, ton score est de ${score} au lieu de ${local}`
            : (scoreActuel < 0) ? `T'es encore plus nul, ton score est de ${score} au lieu de ${local}`
                : `Pas ouf, tu es as égalité à ${scoreActuel} points`;
        localStorage.setItem('userScore', score);
        return alert
    }

    else {
        let alert = (score === 3) ? `Bien joué, tu es le meilleur, ton score est de ${score}`
            : (score === 2) ? `Ca passe, ton score est de ${score}`
                : (score === 1) ? `Pas ouf, ton score est de ${score}`
                    : `T'es nul, ton score est de ${score}`;
        localStorage.setItem('userScore', score);
        return alert
    }



}


async function type() {
    try {
        console.log('calling');
        const response = await fetch('https://pokeapi.co/api/v2/type/');
        const result = await response.json();
        console.log(response);

        const types = result.results;
        types.unshift({ name: 'Tous les Pokemons' });
        console.log(types);
        types.forEach((type, index) => {
            filtres.innerHTML += `<label>
            <input type="checkbox" name="question ${index}" value="${type.name}">
            ${type.name}
          </label>
          <br>`;
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des Pokémon :', error);
    }
}
type()

let pokemonData = [];

async function asyncCall() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon/');
        const result = await response.json();
        console.log(response);

        const pokemons = result.results;
        // console.log(pokemons);
        pokemons.forEach((pokemon, index) => {
            pokemonData.push({
                name: pokemon.name,
                url: pokemon.url
            });
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des Pokémon :', error);
    }
}

let images = [];

async function takeUrlImages() {
    try {
        for (const pokemon of pokemonData) {
            const response = await fetch(pokemon.url);
            const result = await response.json();

            const imageUrl = result.sprites.front_default;
            const types = result.types[0].type.name

            console.log(result.types[1]);

            if (result.types[1]) {
                const types2 = result.types[1].type.name
                console.log(types2);
                images.push({
                    name: pokemon.name,
                    url: imageUrl,
                    type: types,
                    type2: types2
                });
            }
            else {
                images.push({
                    name: pokemon.name,
                    url: imageUrl,
                    type: types,

                });
            }
        }


        images.forEach((pokemon, index) => {
            const container = document.createElement('div');

            const nameElement = document.createElement('p');
            nameElement.textContent = pokemon.name;
            nameElement.dataset.type = pokemon.type;
            console.log(pokemon);
            if (pokemon.type2) {
                nameElement.dataset.type2 = pokemon.type2;
            }
            const imageElement = document.createElement('img');
            imageElement.src = pokemon.url;

            container.appendChild(nameElement);
            container.appendChild(imageElement);

            galerie.appendChild(container);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des images :', error);
    }
}

asyncCall().then(() => {
    takeUrlImages();
});



filtres.addEventListener('change', (event) => {
    console.log(images);
    selectedType = event.target.value;
    console.log(selectedType);
    if (selectedType === "Tous les Pokemons") {
        galerie.innerHTML = '';
        images.forEach((pokemon, index) => {
            const container = document.createElement('div');

            const nameElement = document.createElement('p');
            nameElement.textContent = pokemon.name;

            const imageElement = document.createElement('img');
            imageElement.src = pokemon.url;

            container.appendChild(nameElement);
            container.appendChild(imageElement);

            galerie.appendChild(container);
        });
    }
    else if (selectedType) {
        filterByType(selectedType);
    } else {
        galerie.innerHTML = '';
        images.forEach((pokemon, index) => {
            const container = document.createElement('div');

            const nameElement = document.createElement('p');
            nameElement.textContent = pokemon.name;

            const imageElement = document.createElement('img');
            imageElement.src = pokemon.url;

            container.appendChild(nameElement);
            container.appendChild(imageElement);

            galerie.appendChild(container);
        });
    }

})

let selectedType = null;

function filterByType(type) {
    galerie.innerHTML = '';

    images.forEach((pokemon, index) => {
        if (pokemon.type === type || pokemon.type2 === type) {
            const container = document.createElement('div');

            const nameElement = document.createElement('p');
            nameElement.textContent = pokemon.name;

            const imageElement = document.createElement('img');
            imageElement.src = pokemon.url;

            container.appendChild(nameElement);
            container.appendChild(imageElement);

            galerie.appendChild(container);
        }
    });
}
