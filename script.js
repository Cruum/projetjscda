
let section = document.getElementById('mainSection')
const button = document.getElementById('buttonSubmit');
const form = document.getElementById('form');
const galerie = document.getElementById('galerie');
const filtres = document.getElementById('filtres');
console.log(section);
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

    reponse = new Map();

    formData.forEach((value, key) => {
        reponse.set(key, value);
    });

    console.log(reponse);
    // calcResponseQuestions(reponse)
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
    let scoreActuel = score - local
    console.log(local);
    console.log(score);
    console.log(scoreActuel);


    if (local) {
        let alert = (scoreActuel > 0) ? `Bien joué, tu as été meilleur, ton score est de ${score} au lieu de ${local}`
            : (scoreActuel < 0) ? `T'es encore plus nul, ton score est de ${score} au lieu de ${local}`
                : `Pas ouf, tu es as égalité à ${scoreActuel} points`;
                console.log(alert);
                localStorage.setItem('userScore', score);
                return alert
            }

    else {
        let alert = (score === 3) ? `Bien joué, tu es le meilleur, ton score est de ${score}`
            : (score === 2) ? `Ca passe, ton score est de ${score}`
            : (score === 1) ? `Pas ouf, ton score est de ${score}`
            : `T'es nul, ton score est de ${score}`;
        console.log(score);
        console.log(typeof score);
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
        console.log(types);
        types.forEach((type, index) => {
            filtres.innerHTML += `<label>
            <input type="radio" name="question ${index}" value="${type.name}">
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
        // console.log('calling');
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
            images.push({
                name: pokemon.name,
                url: imageUrl,
                type: types
            });
            console.log(images);
        }


        images.forEach((pokemon, index) => {
            const container = document.createElement('div');

            const nameElement = document.createElement('p');
            nameElement.textContent = pokemon.name;
            nameElement.dataset.type= pokemon.type;

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
    selectedType = event.target.value;

    if (selectedType) {
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

    const filteredImages = images.filter(pokemon => pokemon.type === type);

    filteredImages.forEach((pokemon, index) => {
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