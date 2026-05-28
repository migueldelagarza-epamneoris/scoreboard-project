import { GameState } from "..";
import { EnergyType } from "..";
import { isEnergyAttachedThisTurn } from "..";
import { ERROR_MESSAGES } from "..";

export const AddEnergy = (state: GameState, energy: EnergyType): GameState => {
    if (isEnergyAttachedThisTurn(state)) {
        throw new Error(ERROR_MESSAGES.ENERGY_ALREADY_ATTACHED);
    }
    return {
        ...state,
        activePokemon: state.activePokemon ? {
            ...state.activePokemon,
            energy: [...(state.activePokemon.energy ?? []), energy]
        } : null,
        energyAttachedThisTurn: true
    }
}
