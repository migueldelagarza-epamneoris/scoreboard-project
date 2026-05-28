import { GameState } from '../src';
import { DEFAULT_PRIZE_CARDS } from '../src';

export const mockedInitialState: GameState = {
    activePokemon: null,
    bench: [],
    prizeCards: DEFAULT_PRIZE_CARDS,
    turnCount: 1,
    phase: 'draw',
    energyAttachedThisTurn: false,
    
}
