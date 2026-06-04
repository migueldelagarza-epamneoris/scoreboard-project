# Ejemplos Avanzados - pkm-tcg-scoreboard

Tutoriales y ejemplos avanzados para casos de uso más complejos.

## 🎯 Caso 1: Jugador Multiplayer con Redux (React)

### Configuración de Redux Store

```typescript
// store/gameSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, Pokemon, EnergyType, AddEnergy, applyDamage } from 'pkm-tcg-scoreboard';

interface MultiplayerState {
  player1: GameState;
  player2: GameState;
  currentTurn: 1 | 2;
}

const initialState: MultiplayerState = {
  player1: {
    activePokemon: null,
    bench: [],
    prizeCards: 6,
    discardPile: [],
    turnCount: 0,
    playerName: 'Jugador 1',
    phase: 'draw'
  },
  player2: {
    activePokemon: null,
    bench: [],
    prizeCards: 6,
    discardPile: [],
    turnCount: 0,
    playerName: 'Jugador 2',
    phase: 'draw'
  },
  currentTurn: 1
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    addEnergyToPlayer: (
      state,
      action: PayloadAction<{ player: 1 | 2; energy: EnergyType }>
    ) => {
      const playerState = state[`player${action.payload.player}`];
      try {
        const newState = AddEnergy(playerState, action.payload.energy);
        state[`player${action.payload.player}`] = newState;
      } catch (error) {
        console.error('Error:', error);
      }
    },
    applyDamageToPlayer: (
      state,
      action: PayloadAction<{ player: 1 | 2; damage: number }>
    ) => {
      const playerState = state[`player${action.payload.player}`];
      const newState = applyDamage(playerState, action.payload.damage);
      state[`player${action.payload.player}`] = newState;
    },
    switchTurn: (state) => {
      state.currentTurn = state.currentTurn === 1 ? 2 : 1;
    }
  }
});

export const { addEnergyToPlayer, applyDamageToPlayer, switchTurn } = gameSlice.actions;
export default gameSlice.reducer;
```

### Componente Multiplayer

```typescript
// components/MultiplayerBoard.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addEnergyToPlayer, switchTurn } from '../store/gameSlice';
import { PokemonCard } from './PokemonCard';

export const MultiplayerBoard: React.FC = () => {
  const dispatch = useDispatch();
  const { player1, player2, currentTurn } = useSelector((state: any) => state.game);

  return (
    <div className="multiplayer-board">
      <div className="player-section player2">
        <h2>{player2.playerName}</h2>
        {player2.activePokemon && (
          <PokemonCard pokemon={player2.activePokemon} isActive />
        )}
        <div className="bench">
          {player2.bench.map((poke) => (
            <PokemonCard key={poke.id} pokemon={poke} />
          ))}
        </div>
      </div>

      <div className="turn-indicator">
        Turno de: {currentTurn === 1 ? player1.playerName : player2.playerName}
      </div>

      <div className="player-section player1">
        <h2>{player1.playerName}</h2>
        {player1.activePokemon && (
          <PokemonCard pokemon={player1.activePokemon} isActive />
        )}
        <div className="bench">
          {player1.bench.map((poke) => (
            <PokemonCard key={poke.id} pokemon={poke} />
          ))}
        </div>

        <div className="controls">
          <button
            onClick={() => dispatch(addEnergyToPlayer({ player: 1, energy: 'electric' }))}
            disabled={currentTurn !== 1}
          >
            Agregar Energía
          </button>
          <button onClick={() => dispatch(switchTurn())}>
            Siguiente Turno
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

## 🎯 Caso 2: Sistema de Turnos con State Machine (Angular)

### Service con State Machine

```typescript
// services/turn-manager.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameStateService } from './game-state.service';
import { nextPhase } from 'pkm-tcg-scoreboard';

type TurnPhase = 'draw' | 'main' | 'attack' | 'end';
type TurnState = 'planning' | 'executing' | 'complete';

interface TurnInfo {
  phase: TurnPhase;
  state: TurnState;
  canActionCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class TurnManagerService {
  private phaseHistory: TurnPhase[] = ['draw', 'main', 'attack', 'end'];
  private currentPhaseIndex = 0;

  private turnInfoSubject = new BehaviorSubject<TurnInfo>({
    phase: 'draw',
    state: 'planning',
    canActionCount: 1
  });

  public turnInfo$ = this.turnInfoSubject.asObservable();

  constructor(private gameStateService: GameStateService) {
    this.subscribeToGameChanges();
  }

  private subscribeToGameChanges(): void {
    this.gameStateService.state$.subscribe(state => {
      const turnInfo: TurnInfo = {
        phase: state.phase,
        state: 'executing',
        canActionCount: this.getActionCountForPhase(state.phase)
      };
      this.turnInfoSubject.next(turnInfo);
    });
  }

  private getActionCountForPhase(phase: TurnPhase): number {
    switch (phase) {
      case 'draw':
        return 0;
      case 'main':
        return Infinity; // Acciones ilimitadas
      case 'attack':
        return 1; // Solo 1 ataque por turno
      case 'end':
        return 0;
      default:
        return 0;
    }
  }

  completeTurn(): void {
    this.gameStateService.nextPhase();
    const newTurnInfo: TurnInfo = {
      ...this.turnInfoSubject.value,
      state: 'complete'
    };
    this.turnInfoSubject.next(newTurnInfo);
  }

  getPhaseDescription(phase: TurnPhase): string {
    const descriptions: Record<TurnPhase, string> = {
      draw: 'Fase de Robo: Roba una carta',
      main: 'Fase Principal: Juega cartas libremente',
      attack: 'Fase de Ataque: Realiza tu ataque',
      end: 'Fase Final: Finaliza el turno'
    };
    return descriptions[phase];
  }
}
```

### Componente de Turnos

```typescript
// components/turn-display/turn-display.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnManagerService } from '../../services/turn-manager.service';
import { GameStateService } from '../../services/game-state.service';

interface TurnInfo {
  phase: string;
  state: string;
  canActionCount: number;
}

@Component({
  selector: 'app-turn-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="turn-display">
      <div class="phase-card">
        <h2>{{ (turnInfo$ | async)?.phase.toUpperCase() }}</h2>
        <p class="description">
          {{ getPhaseDescription((turnInfo$ | async)?.phase) }}
        </p>
      </div>

      <div class="turn-progress">
        <div
          *ngFor="let phase of phases"
          [class.active]="phase === (turnInfo$ | async)?.phase"
          class="phase-indicator">
          {{ phase.toUpperCase() }}
        </div>
      </div>

      <button
        (click)="nextPhase()"
        [disabled]="!(gameState$ | async) as state"
        class="next-phase-btn">
        Siguiente Fase
      </button>
    </div>
  `,
  styles: [`
    .turn-display {
      padding: 20px;
      border-radius: 10px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .phase-card {
      text-align: center;
      margin-bottom: 20px;
    }

    .phase-card h2 {
      margin: 0 0 10px 0;
      font-size: 2em;
    }

    .description {
      opacity: 0.8;
      font-size: 0.95em;
    }

    .turn-progress {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      justify-content: space-around;
    }

    .phase-indicator {
      flex: 1;
      padding: 10px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 5px;
      text-align: center;
      font-size: 0.8em;
      transition: all 0.3s;
    }

    .phase-indicator.active {
      background: #ffd700;
      color: #333;
      font-weight: bold;
    }

    .next-phase-btn {
      width: 100%;
      padding: 12px;
      background: #4caf50;
      color: white;
      border: none;
      border-radius: 5px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s;
    }

    .next-phase-btn:hover:not(:disabled) {
      background: #45a049;
    }

    .next-phase-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class TurnDisplayComponent implements OnInit {
  turnInfo$ = this.turnManager.turnInfo$;
  gameState$ = this.gameStateService.state$;
  phases = ['draw', 'main', 'attack', 'end'];

  constructor(
    private turnManager: TurnManagerService,
    private gameStateService: GameStateService
  ) {}

  ngOnInit(): void {}

  nextPhase(): void {
    this.turnManager.completeTurn();
  }

  getPhaseDescription(phase?: string): string {
    if (!phase) return '';
    const phaseLower = phase.toLowerCase();
    return this.turnManager.getPhaseDescription(phaseLower as any);
  }
}
```

---

## 🎯 Caso 3: Sistema de Historial de Movimientos (React)

### Hook para Historial

```typescript
// hooks/useGameHistory.ts
import { useState, useCallback } from 'react';
import { GameState } from 'pkm-tcg-scoreboard';

interface GameAction {
  type: 'ADD_ENERGY' | 'APPLY_DAMAGE' | 'SWITCH_POKEMON' | 'PHASE_CHANGE';
  timestamp: number;
  description: string;
  stateAfter: GameState;
}

interface UseGameHistoryReturn {
  history: GameAction[];
  addAction: (action: GameAction) => void;
  undo: () => GameState | null;
  redo: () => GameState | null;
  canUndo: boolean;
  canRedo: boolean;
  clearHistory: () => void;
}

export function useGameHistory(maxHistorySize: number = 50): UseGameHistoryReturn {
  const [history, setHistory] = useState<GameAction[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const addAction = useCallback((action: GameAction) => {
    setHistory(prevHistory => {
      const newHistory = prevHistory.slice(0, currentIndex + 1);
      newHistory.push(action);
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
      }
      return newHistory;
    });
    setCurrentIndex(prev => Math.min(prev + 1, maxHistorySize - 1));
  }, [currentIndex, maxHistorySize]);

  const undo = useCallback((): GameState | null => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex - 1].stateAfter;
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback((): GameState | null => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return history[currentIndex + 1].stateAfter;
    }
    return null;
  }, [currentIndex, history]);

  return {
    history,
    addAction,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    clearHistory: () => {
      setHistory([]);
      setCurrentIndex(-1);
    }
  };
}
```

### Componente con Historial

```typescript
// components/GameBoardWithHistory.tsx
import React, { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useGameHistory } from '../hooks/useGameHistory';
import { GameState } from 'pkm-tcg-scoreboard';

export const GameBoardWithHistory: React.FC = () => {
  const { state, applyDamage, addEnergy } = useGameState();
  const { history, addAction, undo, redo, canUndo, canRedo, clearHistory } = useGameHistory();

  const handleDamageWithHistory = (damage: number) => {
    applyDamage(damage);
    addAction({
      type: 'APPLY_DAMAGE',
      timestamp: Date.now(),
      description: `Se aplicaron ${damage} de daño`,
      stateAfter: state
    });
  };

  const handleUndo = () => {
    const previousState = undo();
    if (previousState) {
      // Actualizar estado
      console.log('Deshecho:', previousState);
    }
  };

  return (
    <div className="game-with-history">
      <div className="game-controls">
        <button onClick={handleUndo} disabled={!canUndo}>
          ↶ Deshacer
        </button>
        <button onClick={redo} disabled={!canRedo}>
          ↷ Rehacer
        </button>
        <button onClick={clearHistory}>
          Limpiar Historial
        </button>
      </div>

      <div className="history-panel">
        <h3>Historial ({history.length})</h3>
        <div className="history-list">
          {history.map((action, index) => (
            <div key={index} className="history-item">
              <span className="action-type">{action.type}</span>
              <span className="action-desc">{action.description}</span>
              <span className="action-time">
                {new Date(action.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="game-board">
        {/* Contenido del tablero */}
      </div>
    </div>
  );
};
```

---

## 🎯 Caso 4: Persistencia con LocalStorage (Angular)

### Service de Persistencia

```typescript
// services/game-persistence.service.ts
import { Injectable } from '@angular/core';
import { GameState } from 'pkm-tcg-scoreboard';

const STORAGE_KEY = 'pkm-tcg-game-state';

@Injectable({
  providedIn: 'root'
})
export class GamePersistenceService {
  saveGameState(gameState: GameState): void {
    try {
      const serialized = JSON.stringify(gameState);
      localStorage.setItem(STORAGE_KEY, serialized);
      console.log('Juego guardado');
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  }

  loadGameState(): GameState | null {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      return serialized ? JSON.parse(serialized) : null;
    } catch (error) {
      console.error('Error al cargar:', error);
      return null;
    }
  }

  deleteGameState(): void {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Juego eliminado');
  }

  hasGameState(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }
}
```

### Uso en GameBoardComponent

```typescript
export class GameBoardComponent implements OnInit {
  constructor(
    private gameService: GameStateService,
    private persistence: GamePersistenceService
  ) {}

  ngOnInit(): void {
    // Cargar juego guardado si existe
    const savedState = this.persistence.loadGameState();
    if (savedState) {
      this.gameService.loadState(savedState);
    }
  }

  saveGame(): void {
    this.persistence.saveGameState(this.gameService.currentState);
  }

  loadGame(): void {
    const savedState = this.persistence.loadGameState();
    if (savedState) {
      this.gameService.loadState(savedState);
    }
  }
}
```

---

## 📊 Caso 5: Analytics y Statistics (React)

### Hook de Estadísticas

```typescript
// hooks/useGameStatistics.ts
import { useMemo } from 'react';
import { GameState, Pokemon } from 'pkm-tcg-scoreboard';

interface GameStatistics {
  totalTurns: number;
  activePokemonHP: number;
  activePokemonHPPercent: number;
  benchSize: number;
  totalEnergyAttached: number;
  averageDamagePerTurn: number;
  prizeCardsRemaining: number;
  hasWon: boolean;
  hasLost: boolean;
}

export function useGameStatistics(state: GameState): GameStatistics {
  return useMemo(() => {
    const activePokemon = state.activePokemon;
    const activePokemonHP = activePokemon 
      ? Math.max(0, activePokemon.hp - (activePokemon.damageCounters || 0) * 10)
      : 0;
    const activePokemonHPPercent = activePokemon 
      ? (activePokemonHP / activePokemon.hp) * 100
      : 0;

    const totalEnergyAttached = state.activePokemon?.energy?.length || 0;
    const averageDamagePerTurn = state.turnCount > 0
      ? ((state.activePokemon?.damageCounters || 0) * 10) / state.turnCount
      : 0;

    return {
      totalTurns: state.turnCount,
      activePokemonHP,
      activePokemonHPPercent,
      benchSize: state.bench.length,
      totalEnergyAttached,
      averageDamagePerTurn,
      prizeCardsRemaining: state.prizeCards,
      hasWon: state.prizeCards === 0,
      hasLost: !state.activePokemon || activePokemonHP <= 0
    };
  }, [state]);
}
```

### Dashboard de Estadísticas

```typescript
// components/StatisticsDashboard.tsx
import React from 'react';
import { GameState } from 'pkm-tcg-scoreboard';
import { useGameStatistics } from '../hooks/useGameStatistics';

interface StatisticsDashboardProps {
  gameState: GameState;
}

export const StatisticsDashboard: React.FC<StatisticsDashboardProps> = ({ gameState }) => {
  const stats = useGameStatistics(gameState);

  return (
    <div className="statistics-dashboard">
      <div className="stat-card">
        <h3>Turnos</h3>
        <p className="stat-value">{stats.totalTurns}</p>
      </div>

      <div className="stat-card">
        <h3>HP del Activo</h3>
        <p className="stat-value">
          {stats.activePokemonHP}
        </p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${stats.activePokemonHPPercent}%` }}>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <h3>Energía Adjunta</h3>
        <p className="stat-value">{stats.totalEnergyAttached}</p>
      </div>

      <div className="stat-card">
        <h3>Cartas de Premio</h3>
        <p className="stat-value">{stats.prizeCardsRemaining}</p>
      </div>

      <div className="stat-card">
        <h3>Promedio Daño/Turno</h3>
        <p className="stat-value">
          {stats.averageDamagePerTurn.toFixed(2)}
        </p>
      </div>

      {stats.hasWon && (
        <div className="status-card won">
          🎉 ¡HAS GANADO!
        </div>
      )}

      {stats.hasLost && (
        <div className="status-card lost">
          💀 HAS PERDIDO
        </div>
      )}
    </div>
  );
};
```

---

## 📚 Recursos Adicionales

- [Redux Toolkit Documentation](https://redux-toolkit.js.org)
- [Angular Services Guide](https://angular.dev/guide/services)
- [RxJS Operators](https://rxjs.dev/api)
- [React Hooks Best Practices](https://react.dev/reference/react/hooks)
