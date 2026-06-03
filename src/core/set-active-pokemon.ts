import {
  Pokemon, GameState, ERROR_MESSAGES,
  isBasicPokemon, validatePokemon,
  hasActivePokemon,
  hasSwitchedThisTurn
} from '..';

/**
 * Transición determinista para asignar el Pokémon Activo.
 * @param state Estado actual de la partida.
 * @param pokemon El Pokémon Básico que se enviará al Puesto Activo.
 * @returns Un nuevo estado inmutable con el Pokémon asignado.
 */
export const setActivePokemon = /* @__PURE__ */ (
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
  if (hasSwitchedThisTurn(state)) {
    throw new Error(ERROR_MESSAGES.SWITCHED_THIS_TURN);
  }
  return {
    ...state,
    activePokemon: pokemon,
  };
};