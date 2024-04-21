import React, { useState, useEffect } from 'react';
import './App.css'; // Import custom styles

function App() {
  const [page, setPage] = useState(0);
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pokemonDetails, setPokemonDetails] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    fetchPokemons();
  }, [page]);

  const fetchPokemons = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${page * 20}`);
      const data = await response.json();
      setPokemonList(data.results);
      const details = await Promise.all(data.results.map(pokemon => fetchPokemonDetails(pokemon.url)));
      setPokemonDetails(details);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching Pokemons:', error);
      setIsLoading(false);
    }
  };

  const fetchPokemonDetails = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      const abilities = data.abilities.map(ability => ability.ability.name);
      return {
        name: data.name,
        imageUrl: data.sprites.front_default,
        stats: data.stats,
        abilities: abilities,
        height: data.height,
        weight: data.weight
      };
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
      return null;
    }
  };

  const next = () => {
    setPage(page + 1);
  };

  const prev = () => {
    if (page !== 0) {
      setPage(page - 1);
    }
  };

  const handlePokemonClick = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  return (
    <div className="layout-container">
      <header>
        {selectedPokemon ? (
          <div className="pokemon-details">
            <h1>{selectedPokemon.name}</h1>
            <img src={selectedPokemon.imageUrl} alt={selectedPokemon.name} />
            <div className="details-container">
              <div className="stats">
                <h2>Stats:</h2>
                <ul>
                  {selectedPokemon.stats.map((stat, index) => (
                    <li key={index}>
                      {stat.stat.name}: {stat.base_stat}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="abilities">
                <h2>Abilities:</h2>
                <ul>
                  {selectedPokemon.abilities.map((ability, index) => (
                    <li key={index}>{ability}</li>
                  ))}
                </ul>
              </div>
              <div className="additional-info">
                <p>Height: {selectedPokemon.height}</p>
                <p>Weight: {selectedPokemon.weight}</p>
              </div>
            </div>
            <button className="back-button" onClick={() => setSelectedPokemon(null)}>Go Back</button>
          </div>
        ) : (
          <div className="pokemon-list">
            <h1>POKEDEX</h1>
            <div className="grid-container">
              {pokemonDetails.map((pokemon, index) => (
                <div key={index} className="pokemon-item" onClick={() => handlePokemonClick(pokemon)}>
                  <img src={pokemon.imageUrl} alt={pokemon.name} />
                  <p>{pokemon.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
      <footer>
        <button onClick={prev} disabled={page === 0 || selectedPokemon}>Previous</button>
        <button onClick={next} disabled={selectedPokemon}>Next</button>
      </footer>
    </div>
  );
}

export default App;
