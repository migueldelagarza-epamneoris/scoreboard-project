import { describe, expect, it } from "vitest";
import { AddEnergy, ERROR_MESSAGES, GameState } from "../src";
import { mockedInitialState } from "./mocks/initial-state.mock";
import { mockPokemon } from "./mocks/pokemon.mock";

describe('addEnergy', () => {
  it('should add energy to active pokemon and not mutate original state', () => {
    const initialState: GameState = {
        ...mockedInitialState,
        activePokemon: mockPokemon.pikachu
    }
    const energyToAdd = 'Fire';
    const newState = AddEnergy(initialState, energyToAdd);
    expect(newState.activePokemon?.energy).toContain(energyToAdd);
    expect(newState.energyAttachedThisTurn).toBe(true);
  });

  it('should throw an error if energy has already been attached this turn', () => {
    const initialState: GameState = {
      ...mockedInitialState,
      energyAttachedThisTurn: true
    };
    const energyToAdd = 'Fire';
    expect(() => AddEnergy(initialState, energyToAdd)).toThrow(ERROR_MESSAGES.ENERGY_ALREADY_ATTACHED);
  });
});