import { GameState } from "..";

export const isEnergyAttachedThisTurn = (state: GameState): boolean => (!!state.energyAttachedThisTurn);
