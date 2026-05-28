import { describe, it, expect } from "vitest";
import { getGameState, DEFAULT_PRIZE_CARDS } from "../src";

describe('getGameState', () => {
    it('should return the initial game state', () => {
        const gameState = getGameState();
        expect(gameState).toEqual({
            activePokemon: null,
            bench: [],
            prizeCards: DEFAULT_PRIZE_CARDS,
            turnCount: 1,
            phase: 'draw',
            discardPile: [],
            energyAttachedThisTurn: false,
        });
    });
});