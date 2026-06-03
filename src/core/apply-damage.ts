import { ERROR_MESSAGES, GameState, hasActivePokemon, validatePokemon } from "..";
import { isKnockoutPokemon } from "..";

export const applyDamage = /* @__PURE__ */ (
  gameState: GameState,
  damage: number,
): GameState => {
  if (!hasActivePokemon(gameState)) {
    throw new Error(ERROR_MESSAGES.NO_ACTIVE_POKEMON);
  }
  const pokemon = validatePokemon(gameState.activePokemon);
  if (damage <= 0) {
    throw new Error(ERROR_MESSAGES.INVALID_DAMAGE);
  }

  if (isKnockoutPokemon(pokemon, damage)) {
    return {
      ...gameState,
      discardPile: [...gameState.discardPile, pokemon],
      activePokemon: null,
    };
  }

  return {
    ...gameState,
    activePokemon: {
      ...pokemon,
      damageCounters: (pokemon.damageCounters || 0) + damage,
    },
  };
};
