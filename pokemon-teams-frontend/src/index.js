const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

const makePokemonLiString = pokemons => {
  return pokemons.map(poke => `<li>${poke.nickname} (${poke.species}) <button class="release" data-pokemon-id=${poke.id}>Release</button></li>`)
}

const addTrainerCard = trainer => {
  const { pokemons } = trainer
  const stringOfPokemon = makePokemonLiString(pokemons).join("")
  const mainContainer = document.querySelector('main')
  const trainerCardString = `<div class="card" data-id=${trainer.id}><p>${trainer.name}</p>
    <button class='add-pokemon' data-trainer-id=${trainer.id}>Add Pokemon</button>
    <ul id="trainer-${trainer.id}">
      ${stringOfPokemon}
    </ul>
  </div>`
  mainContainer.innerHTML += trainerCardString
}

const addTrainersToDOM = trainers => {
  trainers.forEach(trainer => addTrainerCard(trainer))
}

const getAllTrainers = () => {
  fetch(TRAINERS_URL)
  .then(res => res.json())
  .then(data => {
    console.log("Trainers", data);
    addTrainersToDOM(data)
  })
}


const addNewPokemon = trainer => {
  console.log(trainer.dataset.id);
  return fetch(POKEMONS_URL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accepts': 'application/json'
    },
    body: JSON.stringify({
      'pokemon': {
        "trainer_id": trainer.dataset.id
      }
    })
  })
  .then(res => res.json())
  .then(pokemon => {
    const li = document.createElement('li')
    li.innerHTML = `${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id=${pokemon.id}>Release</button>`
    const ul = document.getElementById(`trainer-${pokemon.trainer_id}`)
    ul.appendChild(li)
  })

}

const releasePokemon = pokemon => {
  console.log(pokemon)
  // send delete fetch with dataset['pokemon-id']
  // debugger
  return fetch(`${POKEMONS_URL}/${pokemon.dataset.pokemonId}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
      'Accepts': 'application/json'
    }
  })
  .then(res => res.json())
  .then(data => {
    console.log(data)
    pokemon.parentNode.remove()
  })

}

document.addEventListener('DOMContentLoaded', () => {
  const mainContainer = document.querySelector('main')
  mainContainer.addEventListener('click', () => {
    if (event.target.classList.contains('add-pokemon')) {
      addNewPokemon(event.target.parentNode)
    } else if (event.target.classList.contains('release')) {
      releasePokemon(event.target)
    }
  })

  getAllTrainers()
  // End of DOMContentLoaded
})
