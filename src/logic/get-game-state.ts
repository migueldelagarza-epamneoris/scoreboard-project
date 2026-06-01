import { GameState } from "..";

export const getGameState = /* @__PURE__ */ (): GameState => {
    return {
        activePokemon: null,
        bench: [],
        prizeCards: 6,
        discardPile: [],
        energyAttachedThisTurn: false,
        phase: 'draw',
        turnCount: 1,
    };
}
