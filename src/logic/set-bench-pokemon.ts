import { ERROR_MESSAGES } from "..";
import { GameState } from "..";
import { Pokemon } from "..";
import { isPokemonDefeated } from "..";

export const setBenchPokemon = (state: GameState, pokemon: Pokemon): GameState => {
    if(state.bench.length >= 5) {
        throw new Error(ERROR_MESSAGES.BENCH_FULL);
    }
    if(isPokemonDefeated(pokemon)) {
        throw new Error(ERROR_MESSAGES.INACTIVE_POKEMON_HP);
    }
    return {
        ...state,
        bench: [...state.bench, pokemon],
    };
}