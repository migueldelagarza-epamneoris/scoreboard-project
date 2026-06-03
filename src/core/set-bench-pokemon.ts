import { ERROR_MESSAGES, isBasicPokemon, validatePokemon } from "..";
import { GameState } from "..";
import { Pokemon } from "..";
import { isPokemonDefeated } from "..";

export const setBenchPokemon = /* @__PURE__ */ (state: GameState, pokemon: Pokemon): GameState => {
    validatePokemon(pokemon);
    if(!isBasicPokemon(pokemon)) {
        throw new Error(ERROR_MESSAGES.NOT_BASIC_POKEMON);
    }
    if(state.bench.length >= 5) {
        throw new Error(ERROR_MESSAGES.BENCH_FULL);
    }
    
    return {
        ...state,
        bench: [...state.bench, pokemon],
    };
}