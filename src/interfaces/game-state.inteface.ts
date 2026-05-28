import { Pokemon } from "..";

export interface GameState {
  readonly activePokemon: Pokemon | null;
  readonly bench: Pokemon[];
  readonly prizeCards: number;
  readonly discardPile: Pokemon[];
  readonly turnCount: number;
  readonly playerName?: string;
  readonly phase: 'draw' | 'main' | 'attack' | 'end';
  readonly energyAttachedThisTurn?: boolean;
  readonly hasSwitchedThisTurn?: boolean;
}
