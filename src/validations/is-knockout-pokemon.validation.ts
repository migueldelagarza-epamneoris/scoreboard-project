import { Pokemon } from "..";

export const isKnockoutPokemon = (pokemon: Pokemon, damage: number): boolean => {
  return pokemon.hp - (pokemon.damageCounters || 0) - damage <= 0;
};
