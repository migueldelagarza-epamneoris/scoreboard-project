import { describe, it, expect } from 'vitest';
import { applyDamage } from '../src/core/apply-damage';
import { ERROR_MESSAGES, GameState } from '../src';
import { mockPokemon } from './mocks/pokemon.mock';

describe('applyDamage', () => {
  const createGameState = (activePokemon: any = null, bench: any[] = []): GameState => ({
    activePokemon,
    bench,
    prizeCards: 6,
    discardPile: [],
    turnCount: 1,
    phase: 'attack',
  });

  describe('Error Cases', () => {
    it('should throw error when targetId is not found', () => {
      const gameState = createGameState(null);
      
      expect(() => applyDamage(gameState, 'non-existent-id', 10)).toThrow(
        ERROR_MESSAGES.INVALID_POKEMON
      );
    });

    it('should throw error when damage is zero', () => {
      const gameState = createGameState(mockPokemon.pikachu);
      
      expect(() => applyDamage(gameState, mockPokemon.pikachu.id, 0)).toThrow(
        ERROR_MESSAGES.INVALID_DAMAGE
      );
    });

    it('should throw error when damage is negative', () => {
      const gameState = createGameState(mockPokemon.pikachu);
      
      expect(() => applyDamage(gameState, mockPokemon.pikachu.id, -10)).toThrow(
        ERROR_MESSAGES.INVALID_DAMAGE
      );
    });
  });

  describe('Active Pokemon - Damage Application without Knockout', () => {
    it('should apply damage to pokemon without existing damage counters', () => {
      const gameState = createGameState(mockPokemon.pikachu);
      const damage = 10;

      const result = applyDamage(gameState, mockPokemon.pikachu.id, damage);

      expect(result.activePokemon?.damageCounters).toBe(damage);
      expect(result.activePokemon?.name).toBe('Pikachu');
      expect(result.activePokemon?.hp).toBe(60);
      expect(result.discardPile).toHaveLength(0);
    });

    it('should add damage to existing damage counters', () => {
      const pokemonWithDamage = {
        ...mockPokemon.pikachu,
        damageCounters: 20,
      };
      const gameState = createGameState(pokemonWithDamage);
      const damage = 10;

      const result = applyDamage(gameState, mockPokemon.pikachu.id, damage);

      expect(result.activePokemon?.damageCounters).toBe(30);
      expect(result.discardPile).toHaveLength(0);
    });

    it('should apply small damage correctly', () => {
      const gameState = createGameState(mockPokemon.charmander);
      const damage = 1;

      const result = applyDamage(gameState, mockPokemon.charmander.id, damage);

      expect(result.activePokemon?.damageCounters).toBe(1);
    });

    it('should apply damage less than remaining HP', () => {
      const gameState = createGameState(mockPokemon.jigglypuff);
      const damage = 40;

      const result = applyDamage(gameState, mockPokemon.jigglypuff.id, damage);

      expect(result.activePokemon?.damageCounters).toBe(40);
      expect(result.activePokemon?.hp).toBe(90);
    });

    it('should preserve other game state properties', () => {
      const gameState = {
        activePokemon: mockPokemon.pikachu,
        bench: [mockPokemon.bulbasaur, mockPokemon.charmander],
        prizeCards: 4,
        discardPile: [mockPokemon.squirtle],
        turnCount: 5,
        phase: 'main' as const,
        playerName: 'Test Player',
      };
      const damage = 15;

      const result = applyDamage(gameState, mockPokemon.pikachu.id, damage);

      expect(result.bench).toEqual(gameState.bench);
      expect(result.prizeCards).toBe(4);
      expect(result.discardPile).toEqual(gameState.discardPile);
      expect(result.turnCount).toBe(5);
      expect(result.phase).toBe('main');
      expect(result.playerName).toBe('Test Player');
    });
  });

  describe('Active Pokemon - Knockout Cases', () => {
    it('should move pokemon to discard pile when damage equals remaining HP', () => {
      const gameState = createGameState(mockPokemon.pikachu);
      const damage = 60; // Pikachu has 60 HP

      const result = applyDamage(gameState, mockPokemon.pikachu.id, damage);

      expect(result.activePokemon).toBeNull();
      expect(result.discardPile).toHaveLength(1);
      expect(result.discardPile[0].name).toBe('Pikachu');
      expect(result.discardPile[0].damageCounters).toBeUndefined();
    });

    it('should move pokemon to discard pile when damage exceeds remaining HP', () => {
      const gameState = createGameState(mockPokemon.pikachu);
      const damage = 100; // More than 60 HP

      const result = applyDamage(gameState, mockPokemon.pikachu.id, damage);

      expect(result.activePokemon).toBeNull();
      expect(result.discardPile).toHaveLength(1);
      expect(result.discardPile[0].name).toBe('Pikachu');
    });

    it('should knockout pokemon with existing damage counters', () => {
      const pokemonWithDamage = {
        ...mockPokemon.pikachu,
        damageCounters: 30,
      };
      const gameState = createGameState(pokemonWithDamage);
      const damage = 30; // 60 - 30 (existing) - 30 (new) = 0

      const result = applyDamage(gameState, mockPokemon.pikachu.id, damage);

      expect(result.activePokemon).toBeNull();
      expect(result.discardPile).toHaveLength(1);
    });

    it('should knockout pokemon that goes below zero HP', () => {
      const pokemonWithDamage = {
        ...mockPokemon.pikachu,
        damageCounters: 40,
      };
      const gameState = createGameState(pokemonWithDamage);
      const damage = 50; // 60 - 40 - 50 = -30

      const result = applyDamage(gameState, mockPokemon.pikachu.id, damage);

      expect(result.activePokemon).toBeNull();
      expect(result.discardPile).toHaveLength(1);
    });

    it('should preserve existing discard pile when adding knockout pokemon', () => {
      const gameState = {
        activePokemon: mockPokemon.pikachu,
        bench: [],
        prizeCards: 5,
        discardPile: [mockPokemon.squirtle, mockPokemon.bulbasaur],
        turnCount: 3,
        phase: 'attack' as const,
      };
      const damage = 60;

      const result = applyDamage(gameState, mockPokemon.pikachu.id, damage);

      expect(result.discardPile).toHaveLength(3);
      expect(result.discardPile[0].name).toBe('Squirtle');
      expect(result.discardPile[1].name).toBe('Bulbasaur');
      expect(result.discardPile[2].name).toBe('Pikachu');
    });

    it('should preserve game state when pokemon is knocked out', () => {
      const gameState = {
        activePokemon: mockPokemon.pikachu,
        bench: [mockPokemon.bulbasaur],
        prizeCards: 3,
        discardPile: [mockPokemon.squirtle],
        turnCount: 8,
        phase: 'attack' as const,
      };
      const damage = 60;

      const result = applyDamage(gameState, mockPokemon.pikachu.id, damage);

      expect(result.bench).toEqual(gameState.bench);
      expect(result.prizeCards).toBe(3);
      expect(result.turnCount).toBe(8);
      expect(result.phase).toBe('attack');
    });
  });

  describe('Bench Pokemon Cases', () => {
    it('should apply damage to a pokemon on the bench', () => {
      const gameState = createGameState(mockPokemon.pikachu, [mockPokemon.bulbasaur]);
      const damage = 20;

      const result = applyDamage(gameState, mockPokemon.bulbasaur.id, damage);

      expect(result.bench[0].damageCounters).toBe(20);
      expect(result.activePokemon?.name).toBe('Pikachu');
    });

    it('should knockout a pokemon on the bench and move it to discard pile', () => {
      const bulbasaur = { ...mockPokemon.bulbasaur, hp: 40 };
      const gameState = createGameState(mockPokemon.pikachu, [bulbasaur]);
      const damage = 40;

      const result = applyDamage(gameState, bulbasaur.id, damage);

      expect(result.bench).toHaveLength(0);
      expect(result.discardPile).toHaveLength(1);
      expect(result.discardPile[0].id).toBe(bulbasaur.id);
      expect(result.activePokemon).not.toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle damage with high HP pokemon', () => {
      const highHpPokemon = {
        ...mockPokemon.charmeleon,
        hp: 200,
      };
      const gameState = createGameState(highHpPokemon);
      const damage = 50;

      const result = applyDamage(gameState, highHpPokemon.id, damage);

      expect(result.activePokemon?.damageCounters).toBe(50);
      expect(result.activePokemon?.hp).toBe(200);
      expect(result.activePokemon).not.toBeNull();
    });

    it('should handle damage with low HP pokemon', () => {
      const lowHpPokemon = {
        ...mockPokemon.squirtle,
        hp: 50,
      };
      const gameState = createGameState(lowHpPokemon);
      const damage = 49; // Just before knockout

      const result = applyDamage(gameState, lowHpPokemon.id, damage);

      expect(result.activePokemon?.damageCounters).toBe(49);
      expect(result.activePokemon).not.toBeNull();
    });

    it('should handle large damage values', () => {
      const gameState = createGameState(mockPokemon.pikachu);
      const damage = 999999;

      const result = applyDamage(gameState, mockPokemon.pikachu.id, damage);

      expect(result.activePokemon).toBeNull();
      expect(result.discardPile).toHaveLength(1);
    });

    it('should handle consecutive damage applications', () => {
      let gameState = createGameState(mockPokemon.charmander);
      
      gameState = applyDamage(gameState, mockPokemon.charmander.id, 20);
      expect(gameState.activePokemon?.damageCounters).toBe(20);

      gameState = applyDamage(gameState, mockPokemon.charmander.id, 30);
      expect(gameState.activePokemon?.damageCounters).toBe(50);

      gameState = applyDamage(gameState, mockPokemon.charmander.id, 30); // 80 - 50 - 30 = 0
      expect(gameState.activePokemon).toBeNull();
      expect(gameState.discardPile).toHaveLength(1);
    });

    it('should not mutate original game state', () => {
      const gameState = createGameState(mockPokemon.pikachu);
      const originalActivePokemon = gameState.activePokemon;
      const damage = 15;

      applyDamage(gameState, mockPokemon.pikachu.id, damage);

      expect(gameState.activePokemon).toBe(originalActivePokemon);
      expect(gameState.activePokemon?.damageCounters).toBeUndefined();
      expect(gameState.discardPile).toHaveLength(0);
    });

    it('should not mutate the pokemon object when applying damage', () => {
      const pokemon = { ...mockPokemon.pikachu };
      const gameState = createGameState(pokemon);
      const damage = 10;

      const result = applyDamage(gameState, pokemon.id, damage);

      expect(pokemon.damageCounters).toBeUndefined();
      expect(result.activePokemon?.damageCounters).toBe(10);
    });

    it('should handle pokemon with existing energy', () => {
      const pokemonWithEnergy = {
        ...mockPokemon.pikachu,
        energy: ['Electric', 'Electric'],
      };
      const gameState = createGameState(pokemonWithEnergy);
      const damage = 20;

      const result = applyDamage(gameState, pokemonWithEnergy.id, damage);

      expect(result.activePokemon?.energy).toEqual(['Electric', 'Electric']);
      expect(result.activePokemon?.damageCounters).toBe(20);
    });
  });
});
