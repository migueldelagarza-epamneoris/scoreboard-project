import { describe, it, expect } from "vitest";
import { GameState, getGameState, nextPhase } from "../src";

describe("nextPhase", () => {
  it("resets energy attached and switched pokemon state when advancing to the next turn", () => {
    const state: GameState = {
      ...getGameState(),
      energyAttachedThisTurn: true,
      hasSwitchedThisTurn: true,
      phase: "end",
      turnCount: 1,
    };
    const next = nextPhase(state);
    expect(next.energyAttachedThisTurn).toBe(false);
    expect(next.hasSwitchedThisTurn).toBe(false);
    expect(next.phase).toBe("draw");
    expect(next.turnCount).toBe(2);
  });

  it("advances through phases in the correct order", () => {
    let state: GameState = getGameState();
    state = nextPhase(state);
    expect(state.phase).toBe("main");
    state = nextPhase(state);
    expect(state.phase).toBe("attack");
    state = nextPhase(state);
    expect(state.phase).toBe("end");
    state = nextPhase(state);
    expect(state.phase).toBe("draw");
  });
});
