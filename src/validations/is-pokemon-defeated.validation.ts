import { Pokemon } from "..";
import { DEFEATED_POKEMON_HP_THRESHOLD } from "..";

export const isPokemonDefeated = (pokemon: Pokemon): boolean => (pokemon.hp <= DEFEATED_POKEMON_HP_THRESHOLD);
