import { describe, expect, it } from "vitest";
import { mockPokemon } from "../mocks/pokemon.mock";
import { ERROR_MESSAGES, setBenchPokemon } from "../src";
import { mockedInitialState } from "../mocks/initial-state.mock";

describe('Set Bench Pokemon', () => {
    const initialState = mockedInitialState;
    const benchFullState = {
        ...initialState,
        bench: [
            mockPokemon.pikachu,
            mockPokemon.bulbasaur,
            mockPokemon.charmander,
            mockPokemon.squirtle,
            mockPokemon.jigglypuff
        ]
    };
    const pokemon = mockPokemon.pikachu;
    const bulbasaur = mockPokemon.bulbasaur;
    const faintedCharmander = mockPokemon.faintedCharmander;

    it('should set bench pokemon and not mutate original state', () => {
        const newState = setBenchPokemon(initialState, pokemon);
        expect(newState.bench).toContain(pokemon);
    });

    it('should throw an error if bench is full', () => {
        expect(() => setBenchPokemon(benchFullState, bulbasaur)).toThrow(ERROR_MESSAGES.BENCH_FULL);
    });


    it('should throw an error if pokemon is defeated', () => {
        expect(() => setBenchPokemon(initialState, faintedCharmander)).toThrow(ERROR_MESSAGES.INACTIVE_POKEMON_HP);
    });
});