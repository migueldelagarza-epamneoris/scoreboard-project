import { GameState } from "..";
import { EnergyType } from "..";
import { isEnergyAttachedThisTurn } from "..";
import { ERROR_MESSAGES } from "..";

export const AddEnergy = /* @__PURE__ */ (state: GameState, energy: EnergyType, benchIndex?: number): GameState => {
    if (isEnergyAttachedThisTurn(state)) {
        throw new Error(ERROR_MESSAGES.ENERGY_ALREADY_ATTACHED);
    }

    if (benchIndex !== undefined && state.bench && state.bench[benchIndex]) {
        const newBench = [...state.bench];
        newBench[benchIndex] = {
            ...newBench[benchIndex],
            energy: [...(newBench[benchIndex].energy ?? []), energy]
        };

        return {
            ...state,
            bench: newBench,
            energyAttachedThisTurn: true
        };
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
