import { Pokemon } from "..";

export const isBasicPokemon = (pokemon: Pokemon): boolean => (pokemon.stage === 'Basic');
