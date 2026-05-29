import {
  Pokemon, GameState, ERROR_MESSAGES,
  isBasicPokemon, validatePokemon,
  hasActivePokemon
} from '..';

/**
 * Transición determinista para asignar el Pokémon Activo durante los preparativos [12].
 * @param state Estado actual de la partida.
 * @param pokemon El Pokémon Básico que se enviará al Puesto Activo.
 * @returns Un nuevo estado inmutable con el Pokémon asignado.
 */
export const setActivePokemon = (
  state: GameState,
  pokemon: Pokemon
): GameState => {
  validatePokemon(pokemon);
  if (hasActivePokemon(state)) {
    throw new Error(ERROR_MESSAGES.ACTIVE_POKEMON_EXISTS);
  }
  if (!isBasicPokemon(pokemon)) {
    throw new Error(ERROR_MESSAGES.NOT_BASIC_POKEMON);
  }
  return {
    ...state,
    activePokemon: pokemon,
  };
};