import { GameState } from "..";

export const hasActivePokemon = (state: GameState): boolean => (state.activePokemon !== null);
