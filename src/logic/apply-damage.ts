import { GameState } from "..";
import { isKnockoutPokemon } from "..";

export const applyDamage = (
  gameState: GameState,
  damage: number,
): GameState => {
  if (!gameState.activePokemon) {
    throw new Error("No active Pokemon to apply damage to.");
  }
  if (damage <= 0) {
    throw new Error("Damage must be a positive number.");
  }

  if (isKnockoutPokemon(gameState.activePokemon, damage)) {
    return {
      ...gameState,
      discardPile: [...gameState.discardPile, gameState.activePokemon],
      activePokemon: null,
    };
  }

  return {
    ...gameState,
    activePokemon: {
      ...gameState.activePokemon,
      damageCounters: (gameState.activePokemon.damageCounters || 0) + damage,
    },
  };
};
