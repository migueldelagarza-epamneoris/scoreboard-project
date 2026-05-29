import { ERROR_MESSAGES, isPokemonDefeated, Pokemon } from "..";

export const validatePokemon = (pokemon: Pokemon | null): Pokemon => {
    if (typeof pokemon !== 'object' || pokemon === null) {
        throw new Error(ERROR_MESSAGES.INVALID_POKEMON);
    }
    if (isPokemonDefeated(pokemon)) {
        throw new Error(ERROR_MESSAGES.DEFEATED_POKEMON);
    }
    return pokemon;
}