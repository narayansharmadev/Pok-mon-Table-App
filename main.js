// main.js
const tableBody = document.querySelector('#pokemonTable tbody');
const loader = document.getElementById('loader');

async function fetchPokemonList() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=5');
  const data = await res.json();
  return data.results; // Array of { name, url }
}

async function fetchPokemonDetails(url) {
  const res = await fetch(url);
  const data = await res.json();
  return {
    name: data.name,
    image: data.sprites.front_default,
    types: data.types.map(t => t.type.name).join(', '),
    xp: data.base_experience,
    abilities: data.abilities.map(a => a.ability.name).join(', ')
  };
}

async function renderPokemonTable() {
  try {
    const list = await fetchPokemonList();
    const allDetails = await Promise.all(list.map(p => fetchPokemonDetails(p.url)));

    allDetails.forEach(pokemon => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td><img src="${pokemon.image}" alt="${pokemon.name}" /></td>
        <td>${pokemon.name}</td>
        <td>${pokemon.types}</td>
        <td>${pokemon.xp}</td>
        <td>${pokemon.abilities}</td>
      `;

      tableBody.appendChild(row);
    });

    loader.style.display = 'none';
  } catch (err) {
    loader.textContent = '❌ Failed to load Pokémon data';
    console.error(err);
  }
}

renderPokemonTable();
