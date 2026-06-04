import { describe, it, expect } from 'vitest';
import { setActivePokemon } from '../src/';
import { ERROR_MESSAGES, GameState } from '../src';
import { mockPokemon } from './mocks/pokemon.mock';

describe('setActivePokemon', () => {
  const createGameState = (overrides: Partial<GameState> = {}): GameState => ({
    activePokemon: null,
    bench: [],
    prizeCards: 6,
    discardPile: [],
    turnCount: 1,
    phase: 'main',
    ...overrides,
  });

  it('debería asignar el Pokémon como activo exitosamente', () => {
    const state = createGameState();
    const result = setActivePokemon(state, mockPokemon.pikachu);

    expect(result.activePokemon).toEqual(mockPokemon.pikachu);
    expect(result.activePokemon?.name).toBe('Pikachu');
  });

  it('debería lanzar un error si ya existe un Pokémon activo', () => {
    const state = createGameState({ activePokemon: mockPokemon.bulbasaur });
    
    expect(() => setActivePokemon(state, mockPokemon.pikachu)).toThrow(
      ERROR_MESSAGES.ACTIVE_POKEMON_EXISTS
    );
  });

  it('debería lanzar un error si el Pokémon no es básico', () => {
    const state = createGameState();
    
    expect(() => setActivePokemon(state, mockPokemon.charmeleon)).toThrow(
      ERROR_MESSAGES.NOT_BASIC_POKEMON
    );
  });

  it('debería lanzar un error si el Pokémon está derrotado', () => {
    const state = createGameState();
    const defeatedPokemon = { ...mockPokemon.pikachu, hp: 0 };

    expect(() => setActivePokemon(state, defeatedPokemon)).toThrow(
      ERROR_MESSAGES.DEFEATED_POKEMON
    );
  });

  it('debería lanzar un error si se intenta asignar un Pokémon activo cuando ya se ha cambiado en este turno', () => {
    const state = createGameState({ hasSwitchedThisTurn: true });

    expect(() => setActivePokemon(state, mockPokemon.pikachu)).toThrow(
      ERROR_MESSAGES.SWITCHED_THIS_TURN
    );
  });
});
