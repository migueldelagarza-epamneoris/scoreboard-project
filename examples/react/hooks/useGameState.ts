import { useState, useCallback } from 'react';
import {
  GameState,
  Pokemon,
  AddEnergy,
  applyDamage,
  setActivePokemon,
  setBenchPokemon,
  nextPhase,
  getGameState,
  EnergyType,
  hasActivePokemon,
  isEnergyAttachedThisTurn
} from 'pkm-tcg-scoreboard';

interface UseGameStateReturn {
  state: GameState;
  addEnergy: (energy: EnergyType) => void;
  applyDamage: (damage: number) => void;
  setActivePokemon: (pokemon: Pokemon) => void;
  setBenchPokemon: (pokemon: Pokemon) => void;
  nextPhase: () => void;
  getState: () => GameState;
  switchPokemon: (benchIndex: number) => void;
  canAddEnergy: () => boolean;
  hasActivePokemon: () => boolean;
  error: string | null;
}

/**
 * Hook personalizado para gestionar el estado del juego Pokémon TCG
 * Proporciona métodos para manipular el estado de forma inmutable
 */
export function useGameState(initialState?: GameState): UseGameStateReturn {
  const defaultState: GameState = {
    activePokemon: null,
    bench: [],
    prizeCards: 6,
    discardPile: [],
    turnCount: 0,
    playerName: 'Jugador',
    phase: 'draw',
    energyAttachedThisTurn: false,
    hasSwitchedThisTurn: false
  };

  const [state, setState] = useState<GameState>(initialState || defaultState);
  const [error, setError] = useState<string | null>(null);

  const handleAddEnergy = useCallback((energy: EnergyType) => {
    setState(prevState => {
      try {
        setError(null);
        return AddEnergy(prevState, energy);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido';
        setError(message);
        console.error('Error al agregar energía:', err);
        return prevState;
      }
    });
  }, []);

  const handleApplyDamage = useCallback((damage: number) => {
    setState(prevState => {
      try {
        setError(null);
        return applyDamage(prevState, damage);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido';
        setError(message);
        return prevState;
      }
    });
  }, []);

  const handleSetActivePokemon = useCallback((pokemon: Pokemon) => {
    setState(prevState => {
      try {
        setError(null);
        return setActivePokemon(prevState, pokemon);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido';
        setError(message);
        return prevState;
      }
    });
  }, []);

  const handleSetBenchPokemon = useCallback((pokemon: Pokemon) => {
    setState(prevState => {
      try {
        setError(null);
        if (prevState.bench.length >= 5) {
          setError('El banco está lleno (máximo 5 Pokémon)');
          return prevState;
        }
        return setBenchPokemon(prevState, pokemon);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido';
        setError(message);
        return prevState;
      }
    });
  }, []);

  const handleNextPhase = useCallback(() => {
    setState(prevState => {
      try {
        setError(null);
        const newState = nextPhase(prevState);
        // Resetear banderas al cambiar de turno
        if (newState.phase === 'draw') {
          return {
            ...newState,
            energyAttachedThisTurn: false,
            hasSwitchedThisTurn: false,
            turnCount: newState.turnCount + 1
          };
        }
        return newState;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido';
        setError(message);
        return prevState;
      }
    });
  }, []);

  const switchPokemon = useCallback((benchIndex: number) => {
    setState(prevState => {
      try {
        setError(null);
        if (benchIndex >= prevState.bench.length) {
          setError('Índice de banco inválido');
          return prevState;
        }
        
        const benchPokemon = prevState.bench[benchIndex];
        const newBench = [...prevState.bench];
        
        if (prevState.activePokemon) {
          newBench[benchIndex] = prevState.activePokemon;
        }
        
        return {
          ...prevState,
          activePokemon: benchPokemon,
          bench: newBench,
          hasSwitchedThisTurn: true
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido';
        setError(message);
        return prevState;
      }
    });
  }, []);

  const canAddEnergy = useCallback(() => {
    return !isEnergyAttachedThisTurn(state) && hasActivePokemon(state);
  }, [state]);

  const hasActivePokeCheck = useCallback(() => {
    return hasActivePokemon(state);
  }, [state]);

  return {
    state,
    addEnergy: handleAddEnergy,
    applyDamage: handleApplyDamage,
    setActivePokemon: handleSetActivePokemon,
    setBenchPokemon: handleSetBenchPokemon,
    nextPhase: handleNextPhase,
    getState: () => getGameState(state),
    switchPokemon,
    canAddEnergy,
    hasActivePokemon: hasActivePokeCheck,
    error
  };
}
