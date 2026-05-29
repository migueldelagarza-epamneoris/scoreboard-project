import { Pokemon, validatePokemon } from "..";

export const isKnockoutPokemon = (pokemon: Pokemon, damage: number): boolean => {
  validatePokemon(pokemon);
  return pokemon.hp - (pokemon.damageCounters || 0) - damage <= 0;
};
