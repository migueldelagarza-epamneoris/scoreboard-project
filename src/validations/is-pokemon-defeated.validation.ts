import { Pokemon } from "..";
import { DEFEATED_POKEMON_HP_THRESHOLD } from "..";

/**
 * Checks if a Pokémon is defeated based on its HP.
 * @param pokemon - The Pokémon to check.
 * @returns True if the Pokémon is defeated, false otherwise.
 */
export const isPokemonDefeated = (pokemon: Pokemon): boolean =>
  pokemon.hp === undefined ||
  typeof pokemon.hp !== "number" ||
  pokemon.hp <= DEFEATED_POKEMON_HP_THRESHOLD;
