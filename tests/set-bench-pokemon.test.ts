import { describe, it, expect } from 'vitest';
import { setBenchPokemon } from '../src/logic/set-bench-pokemon';
import { ERROR_MESSAGES, GameState, Pokemon } from '../src';
import { mockPokemon } from '../mocks/pokemon.mock';

describe('setBenchPokemon', () => {
  const createGameState = (bench: any[] = []): GameState => ({
    activePokemon: null,
    bench,
    prizeCards: 6,
    discardPile: [],
    turnCount: 1,
    phase: 'main',
  });

  describe('Error Cases - Invalid Pokemon', () => {
    it('should throw error when pokemon is null', () => {
      const gameState = createGameState();

      expect(() => setBenchPokemon(gameState, null as any)).toThrow(
        ERROR_MESSAGES.INVALID_POKEMON
      );
    });

    it('should throw error when pokemon is undefined', () => {
      const gameState = createGameState();

      expect(() => setBenchPokemon(gameState, undefined as any)).toThrow(
        ERROR_MESSAGES.INVALID_POKEMON
      );
    });

    it('should throw error when pokemon is not an object', () => {
      const gameState = createGameState();

      expect(() => setBenchPokemon(gameState, 'pikachu' as any)).toThrow(
        ERROR_MESSAGES.INVALID_POKEMON
      );
    });

    it('should throw error when pokemon is a number', () => {
      const gameState = createGameState();

      expect(() => setBenchPokemon(gameState, 123 as any)).toThrow(
        ERROR_MESSAGES.INVALID_POKEMON
      );
    });

    it('should throw error when pokemon is an array (treated as defeated)', () => {
      const gameState = createGameState();

      // Arrays are objects in JavaScript, so they pass the object check
      // but fail on HP validation (undefined HP = defeated pokemon)
      expect(() => setBenchPokemon(gameState, [] as any)).toThrow(
        ERROR_MESSAGES.DEFEATED_POKEMON
      );
    });
  });

  describe('Error Cases - Defeated Pokemon', () => {
    it('should throw error when pokemon has 0 HP', () => {
      const gameState = createGameState();
      const defeatedPokemon = { ...mockPokemon.pikachu, hp: 0 };

      expect(() => setBenchPokemon(gameState, defeatedPokemon)).toThrow(
        ERROR_MESSAGES.DEFEATED_POKEMON
      );
    });

    it('should throw error when pokemon has negative HP', () => {
      const gameState = createGameState();
      const defeatedPokemon = { ...mockPokemon.pikachu, hp: -10 };

      expect(() => setBenchPokemon(gameState, defeatedPokemon)).toThrow(
        ERROR_MESSAGES.DEFEATED_POKEMON
      );
    });

    it('should throw error when pokemon HP is undefined', () => {
      const gameState = createGameState();
      const invalidPokemon = { ...mockPokemon.pikachu, hp: undefined } as any;

      expect(() => setBenchPokemon(gameState, invalidPokemon)).toThrow(
        ERROR_MESSAGES.DEFEATED_POKEMON
      );
    });

    it('should throw error when pokemon HP is not a number', () => {
      const gameState = createGameState();
      const invalidPokemon = { ...mockPokemon.pikachu, hp: 'high' } as any;

      expect(() => setBenchPokemon(gameState, invalidPokemon)).toThrow(
        ERROR_MESSAGES.DEFEATED_POKEMON
      );
    });
  });

  describe('Error Cases - Not Basic Pokemon', () => {
    it('should throw error when pokemon is Stage 1', () => {
      const gameState = createGameState();
      const stage1Pokemon = { ...mockPokemon.charmeleon };

      expect(() => setBenchPokemon(gameState, stage1Pokemon)).toThrow(
        ERROR_MESSAGES.NOT_BASIC_POKEMON
      );
    });

    it('should throw error when pokemon is Stage 2', () => {
      const gameState = createGameState();
      const stage2Pokemon = { ...mockPokemon.pikachu, stage: 'Stage 2' as const };

      expect(() => setBenchPokemon(gameState, stage2Pokemon)).toThrow(
        ERROR_MESSAGES.NOT_BASIC_POKEMON
      );
    });

    it('should throw error when pokemon stage is invalid', () => {
      const gameState = createGameState();
      const invalidStagePokemon = { ...mockPokemon.pikachu, stage: 'Invalid' } as any;

      expect(() => setBenchPokemon(gameState, invalidStagePokemon)).toThrow(
        ERROR_MESSAGES.NOT_BASIC_POKEMON
      );
    });
  });

  describe('Error Cases - Bench Full', () => {
    it('should throw error when bench has 5 pokemon', () => {
      const bench = [
        mockPokemon.pikachu,
        mockPokemon.bulbasaur,
        mockPokemon.charmander,
        mockPokemon.squirtle,
        mockPokemon.jigglypuff,
      ];
      const gameState = createGameState(bench);

      expect(() => setBenchPokemon(gameState, mockPokemon.pikachu)).toThrow(
        ERROR_MESSAGES.BENCH_FULL
      );
    });

    it('should throw error when trying to add 6th pokemon', () => {
      const bench = [
        { ...mockPokemon.pikachu, id: '1' },
        { ...mockPokemon.bulbasaur, id: '2' },
        { ...mockPokemon.charmander, id: '3' },
        { ...mockPokemon.squirtle, id: '4' },
        { ...mockPokemon.jigglypuff, id: '5' },
      ];
      const gameState = createGameState(bench);
      const newPokemon = { ...mockPokemon.pikachu, id: '6' };

      expect(() => setBenchPokemon(gameState, newPokemon)).toThrow(
        ERROR_MESSAGES.BENCH_FULL
      );
    });

    it('should throw error when trying to add 7th pokemon to a full bench', () => {
      const bench = Array.from({ length: 5 }, (_, i) => ({
        ...mockPokemon.pikachu,
        id: `pika-${i}`,
      }));
      const gameState = createGameState(bench);
      const newPokemon = { ...mockPokemon.bulbasaur, id: 'extra' };

      expect(() => setBenchPokemon(gameState, newPokemon)).toThrow(
        ERROR_MESSAGES.BENCH_FULL
      );
    });
  });

  describe('Successful Cases - Adding to Empty Bench', () => {
    it('should add pokemon to empty bench', () => {
      const gameState = createGameState();

      const result = setBenchPokemon(gameState, mockPokemon.pikachu);

      expect(result.bench).toHaveLength(1);
      expect(result.bench[0]).toEqual(mockPokemon.pikachu);
    });

    it('should add basic pokemon Bulbasaur to empty bench', () => {
      const gameState = createGameState();

      const result = setBenchPokemon(gameState, mockPokemon.bulbasaur);

      expect(result.bench).toHaveLength(1);
      expect(result.bench[0].name).toBe('Bulbasaur');
    });

    it('should add basic pokemon Charmander to empty bench', () => {
      const gameState = createGameState();

      const result = setBenchPokemon(gameState, mockPokemon.charmander);

      expect(result.bench).toHaveLength(1);
      expect(result.bench[0].name).toBe('Charmander');
    });

    it('should add basic pokemon Squirtle to empty bench', () => {
      const gameState = createGameState();

      const result = setBenchPokemon(gameState, mockPokemon.squirtle);

      expect(result.bench).toHaveLength(1);
      expect(result.bench[0].name).toBe('Squirtle');
    });
  });

  describe('Successful Cases - Adding to Non-Empty Bench', () => {
    it('should add pokemon to bench with 1 pokemon', () => {
      const bench = [mockPokemon.pikachu];
      const gameState = createGameState(bench);

      const result = setBenchPokemon(gameState, mockPokemon.bulbasaur);

      expect(result.bench).toHaveLength(2);
      expect(result.bench[0]).toEqual(mockPokemon.pikachu);
      expect(result.bench[1]).toEqual(mockPokemon.bulbasaur);
    });

    it('should add pokemon to bench with 2 pokemon', () => {
      const bench = [mockPokemon.pikachu, mockPokemon.bulbasaur];
      const gameState = createGameState(bench);

      const result = setBenchPokemon(gameState, mockPokemon.charmander);

      expect(result.bench).toHaveLength(3);
      expect(result.bench[2]).toEqual(mockPokemon.charmander);
    });

    it('should add pokemon to bench with 3 pokemon', () => {
      const bench = [mockPokemon.pikachu, mockPokemon.bulbasaur, mockPokemon.charmander];
      const gameState = createGameState(bench);

      const result = setBenchPokemon(gameState, mockPokemon.squirtle);

      expect(result.bench).toHaveLength(4);
      expect(result.bench[3]).toEqual(mockPokemon.squirtle);
    });

    it('should add pokemon to bench with 4 pokemon', () => {
      const bench = [
        mockPokemon.pikachu,
        mockPokemon.bulbasaur,
        mockPokemon.charmander,
        mockPokemon.squirtle,
      ];
      const gameState = createGameState(bench);

      const result = setBenchPokemon(gameState, mockPokemon.jigglypuff);

      expect(result.bench).toHaveLength(5);
      expect(result.bench[4]).toEqual(mockPokemon.jigglypuff);
    });

    it('should reach bench limit of 5 pokemon', () => {
      const bench = [
        mockPokemon.pikachu,
        mockPokemon.bulbasaur,
        mockPokemon.charmander,
        mockPokemon.squirtle,
      ];
      const gameState = createGameState(bench);

      const result = setBenchPokemon(gameState, mockPokemon.jigglypuff);

      expect(result.bench).toHaveLength(5);
    });
  });

  describe('Pokemon with Damage Counters', () => {
    it('should add pokemon with damage counters to bench', () => {
      const gameState = createGameState();
      const pokemonWithDamage = { ...mockPokemon.pikachu, damageCounters: 20 };

      const result = setBenchPokemon(gameState, pokemonWithDamage);

      expect(result.bench[0].damageCounters).toBe(20);
    });

    it('should add pokemon with high damage counters to bench', () => {
      const gameState = createGameState();
      const pokemonWithDamage = { ...mockPokemon.pikachu, damageCounters: 50 };

      const result = setBenchPokemon(gameState, pokemonWithDamage);

      expect(result.bench[0].damageCounters).toBe(50);
    });

    it('should add pokemon with minimal remaining HP but alive', () => {
      const gameState = createGameState();
      const pokemonLowHp = { ...mockPokemon.pikachu, hp: 1, damageCounters: 59 };

      const result = setBenchPokemon(gameState, pokemonLowHp);

      expect(result.bench[0].hp).toBe(1);
      expect(result.bench[0].damageCounters).toBe(59);
    });
  });

  describe('Pokemon with Energy', () => {
    it('should add pokemon with energy to bench', () => {
      const gameState = createGameState();
      const pokemonWithEnergy: Pokemon = { ...mockPokemon.pikachu, energy: ['Lightning'] };

      const result = setBenchPokemon(gameState, pokemonWithEnergy);

      expect(result.bench[0].energy).toEqual(['Lightning']);
    });

    it('should add pokemon with multiple energies to bench', () => {
      const gameState = createGameState();
      const pokemonWithEnergy: Pokemon = {
        ...mockPokemon.pikachu,
        energy: ['Lightning', 'Lightning', 'Lightning'],
      };

      const result = setBenchPokemon(gameState, pokemonWithEnergy);

      expect(result.bench[0].energy).toHaveLength(3);
      expect(result.bench[0].energy).toEqual(['Lightning', 'Lightning', 'Lightning']);
    });

    it('should add pokemon with mixed energy types to bench', () => {
      const gameState = createGameState();
      const pokemonWithEnergy: Pokemon = {
        ...mockPokemon.pikachu,
        energy: ['Lightning', 'Water', 'Grass'],
      };

      const result = setBenchPokemon(gameState, pokemonWithEnergy);

      expect(result.bench[0].energy).toEqual(['Lightning', 'Water', 'Grass']);
    });
  });

  describe('State Preservation', () => {
    it('should preserve active pokemon in game state', () => {
      const gameState = {
        activePokemon: mockPokemon.pikachu,
        bench: [],
        prizeCards: 6,
        discardPile: [],
        turnCount: 1,
        phase: 'main' as const,
      };

      const result = setBenchPokemon(gameState, mockPokemon.bulbasaur);

      expect(result.activePokemon).toEqual(mockPokemon.pikachu);
    });

    it('should preserve prize cards count', () => {
      const gameState = {
        activePokemon: null,
        bench: [],
        prizeCards: 3,
        discardPile: [],
        turnCount: 1,
        phase: 'main' as const,
      };

      const result = setBenchPokemon(gameState, mockPokemon.pikachu);

      expect(result.prizeCards).toBe(3);
    });

    it('should preserve discard pile', () => {
      const discardPile = [mockPokemon.squirtle, mockPokemon.jigglypuff];
      const gameState = {
        activePokemon: null,
        bench: [],
        prizeCards: 6,
        discardPile,
        turnCount: 1,
        phase: 'main' as const,
      };

      const result = setBenchPokemon(gameState, mockPokemon.pikachu);

      expect(result.discardPile).toEqual(discardPile);
      expect(result.discardPile).toHaveLength(2);
    });

    it('should preserve turn count', () => {
      const gameState = {
        activePokemon: null,
        bench: [],
        prizeCards: 6,
        discardPile: [],
        turnCount: 15,
        phase: 'main' as const,
      };

      const result = setBenchPokemon(gameState, mockPokemon.pikachu);

      expect(result.turnCount).toBe(15);
    });

    it('should preserve game phase', () => {
      const gameState = {
        activePokemon: null,
        bench: [],
        prizeCards: 6,
        discardPile: [],
        turnCount: 1,
        phase: 'attack' as const,
      };

      const result = setBenchPokemon(gameState, mockPokemon.pikachu);

      expect(result.phase).toBe('attack');
    });

    it('should preserve all game state properties', () => {
      const gameState = {
        activePokemon: mockPokemon.pikachu,
        bench: [mockPokemon.bulbasaur],
        prizeCards: 4,
        discardPile: [mockPokemon.squirtle],
        turnCount: 7,
        phase: 'end' as const,
        playerName: 'Test Player',
      };

      const result = setBenchPokemon(gameState, mockPokemon.charmander);

      expect(result.activePokemon).toEqual(mockPokemon.pikachu);
      expect(result.prizeCards).toBe(4);
      expect(result.discardPile).toEqual([mockPokemon.squirtle]);
      expect(result.turnCount).toBe(7);
      expect(result.phase).toBe('end');
      expect(result.playerName).toBe('Test Player');
    });
  });

  describe('Immutability', () => {
    it('should not mutate original game state bench array', () => {
      const bench = [mockPokemon.pikachu];
      const gameState = createGameState(bench);
      const originalLength = gameState.bench.length;

      setBenchPokemon(gameState, mockPokemon.bulbasaur);

      expect(gameState.bench).toHaveLength(originalLength);
      expect(gameState.bench[0]).toEqual(mockPokemon.pikachu);
    });

    it('should not mutate original pokemon object', () => {
      const gameState = createGameState();
      const pokemon = { ...mockPokemon.pikachu };
      const originalHp = pokemon.hp;

      setBenchPokemon(gameState, pokemon);

      expect(pokemon.hp).toBe(originalHp);
    });

    it('should return new bench array', () => {
      const bench = [mockPokemon.pikachu];
      const gameState = createGameState(bench);

      const result = setBenchPokemon(gameState, mockPokemon.bulbasaur);

      expect(result.bench).not.toBe(gameState.bench);
      expect(result.bench).toHaveLength(2);
    });

    it('should return new game state object', () => {
      const gameState = createGameState();

      const result = setBenchPokemon(gameState, mockPokemon.pikachu);

      expect(result).not.toBe(gameState);
    });
  });

  describe('Multiple Additions', () => {
    it('should handle multiple sequential additions', () => {
      let gameState = createGameState();

      gameState = setBenchPokemon(gameState, mockPokemon.pikachu);
      expect(gameState.bench).toHaveLength(1);

      gameState = setBenchPokemon(gameState, mockPokemon.bulbasaur);
      expect(gameState.bench).toHaveLength(2);

      gameState = setBenchPokemon(gameState, mockPokemon.charmander);
      expect(gameState.bench).toHaveLength(3);

      gameState = setBenchPokemon(gameState, mockPokemon.squirtle);
      expect(gameState.bench).toHaveLength(4);

      gameState = setBenchPokemon(gameState, mockPokemon.jigglypuff);
      expect(gameState.bench).toHaveLength(5);
    });

    it('should maintain order of pokemon in bench', () => {
      let gameState = createGameState();

      gameState = setBenchPokemon(gameState, mockPokemon.pikachu);
      gameState = setBenchPokemon(gameState, mockPokemon.bulbasaur);
      gameState = setBenchPokemon(gameState, mockPokemon.charmander);

      expect(gameState.bench[0].name).toBe('Pikachu');
      expect(gameState.bench[1].name).toBe('Bulbasaur');
      expect(gameState.bench[2].name).toBe('Charmander');
    });

    it('should allow same pokemon type multiple times on bench', () => {
      let gameState = createGameState();

      const pikachu1 = { ...mockPokemon.pikachu, id: 'pika-1' };
      const pikachu2 = { ...mockPokemon.pikachu, id: 'pika-2' };

      gameState = setBenchPokemon(gameState, pikachu1);
      gameState = setBenchPokemon(gameState, pikachu2);

      expect(gameState.bench).toHaveLength(2);
      expect(gameState.bench[0].id).toBe('pika-1');
      expect(gameState.bench[1].id).toBe('pika-2');
    });
  });

  describe('Boundary Cases', () => {
    it('should handle pokemon with minimum valid HP (1)', () => {
      const gameState = createGameState();
      const minHpPokemon = { ...mockPokemon.pikachu, hp: 1 };

      const result = setBenchPokemon(gameState, minHpPokemon);

      expect(result.bench[0].hp).toBe(1);
    });

    it('should handle pokemon with maximum HP values', () => {
      const gameState = createGameState();
      const maxHpPokemon = { ...mockPokemon.pikachu, hp: 9999 };

      const result = setBenchPokemon(gameState, maxHpPokemon);

      expect(result.bench[0].hp).toBe(9999);
    });

    it('should work when bench is exactly at 4/5 capacity', () => {
      const bench = [
        mockPokemon.pikachu,
        mockPokemon.bulbasaur,
        mockPokemon.charmander,
        mockPokemon.squirtle,
      ];
      const gameState = createGameState(bench);

      const result = setBenchPokemon(gameState, mockPokemon.jigglypuff);

      expect(result.bench).toHaveLength(5);
    });

    it('should fail when bench is exactly at 5/5 capacity', () => {
      const bench = [
        mockPokemon.pikachu,
        mockPokemon.bulbasaur,
        mockPokemon.charmander,
        mockPokemon.squirtle,
        mockPokemon.jigglypuff,
      ];
      const gameState = createGameState(bench);

      expect(() => setBenchPokemon(gameState, mockPokemon.pikachu)).toThrow(
        ERROR_MESSAGES.BENCH_FULL
      );
    });
  });
});
