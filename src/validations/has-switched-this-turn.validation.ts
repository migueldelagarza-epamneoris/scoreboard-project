import { GameState } from "src";

export const hasSwitchedThisTurn = (state: GameState): boolean => (!!state.hasSwitchedThisTurn);
