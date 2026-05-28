import { GameState } from "..";

export const nextPhase = (gameState: GameState): GameState => {
  switch (gameState.phase) {
    case "draw":
      return { ...gameState, phase: "main" };
    case "main":
      return { ...gameState, phase: "attack" };
    case "attack":
      return { ...gameState, phase: "end" };
    case "end":
      return {
        ...gameState,
        phase: "draw",
        energyAttachedThisTurn: false,
        hasSwitchedThisTurn: false,
        turnCount: gameState.turnCount + 1,
      };
    default:
      return gameState;
  }
};
