import { ERROR_MESSAGES, GameState, validatePokemon } from "..";
import { isKnockoutPokemon } from "..";

export const applyDamage = /* @__PURE__ */ (
  gameState: GameState,
  targetId: string,
  damage: number,
): GameState => {
  if (damage <= 0) {
    throw new Error(ERROR_MESSAGES.INVALID_DAMAGE);
  }

  // Caso: Pokémon Activo
  if (gameState.activePokemon?.id === targetId) {
    const pokemon = validatePokemon(gameState.activePokemon);
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
  }

  // Caso: Pokémon en Banca
  const targetInBench = gameState.bench.find((p) => p.id === targetId);
  if (targetInBench) {
    const pokemon = validatePokemon(targetInBench);
    if (isKnockoutPokemon(pokemon, damage)) {
      return {
        ...gameState,
        bench: gameState.bench.filter((p) => p.id !== targetId),
        discardPile: [...gameState.discardPile, pokemon],
      };
    }

    return {
      ...gameState,
      bench: gameState.bench.map((p) =>
        p.id === targetId
          ? { ...p, damageCounters: (p.damageCounters || 0) + damage }
          : p
      ),
    };
  }

  throw new Error(ERROR_MESSAGES.INVALID_POKEMON);
};
