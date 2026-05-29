import { describe, it, expect } from 'vitest';
import { GameState, Pokemon } from '../src';
import { setActivePokemon } from '../src';
import { ERROR_MESSAGES } from '../src';
import { DEFAULT_PRIZE_CARDS } from '../src';
import { mockPokemon } from '../mocks/pokemon.mock';
import { mockedInitialState } from '../mocks/initial-state.mock';
import { getGameState } from '../src';

describe('setActivePokemon', () => {
  it('should set active pokemon and not mutate original state', () => {
    const initialState: GameState = getGameState();

    const pokemon: Pokemon = mockPokemon.pikachu;

    const newState = setActivePokemon(initialState, pokemon);
    
    expect(newState.activePokemon).toEqual(pokemon);
    expect(initialState.activePokemon).toBeNull();
  });

    it('Should not set active pokemon if there is already one active', () => {
      const initialStateWithActive: GameState = {
        activePokemon: mockPokemon.bulbasaur,
        bench: [],
        discardPile: [],
        prizeCards: DEFAULT_PRIZE_CARDS,
        turnCount: 1,
        phase: 'draw',
      };

      const newPokemon: Pokemon = mockPokemon.pikachu;

      expect(() => setActivePokemon(initialStateWithActive, newPokemon)).toThrow(
        ERROR_MESSAGES.ACTIVE_POKEMON_EXISTS
      );
    });

    it('Should not set active pokemon if the pokemon has 0 HP', () => {
      const initialState: GameState = mockedInitialState;
      const faintedPokemon: Pokemon = mockPokemon.faintedCharmander;

      expect(() => setActivePokemon(initialState, faintedPokemon)).toThrow(
        ERROR_MESSAGES.INACTIVE_POKEMON_HP
      );
    });

    it('Should not set active pokemon if the pokemon has stage 1 or stage 2', () => {
      const initialState: GameState = mockedInitialState;
      const stage1Pokemon: Pokemon = mockPokemon.charmeleon;
      
      expect(() => setActivePokemon(initialState, stage1Pokemon)).toThrow(
        ERROR_MESSAGES.NOT_BASIC_POKEMON
      );
    });
});
