# Integración con React

Guía completa para integrar `pkm-tcg-scoreboard` en aplicaciones React.

## 📦 Instalación

```bash
npm install pkm-tcg-scoreboard
npm install react react-dom
```

## 🎣 Hook personalizado: `useGameState`

```typescript
// hooks/useGameState.ts
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
  generateId
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
}

export function useGameState(initialState?: GameState): UseGameStateReturn {
  const [state, setState] = useState<GameState>(
    initialState || {
      activePokemon: null,
      bench: [],
      prizeCards: 6,
      discardPile: [],
      turnCount: 0,
      playerName: 'Jugador',
      phase: 'draw',
      energyAttachedThisTurn: false,
      hasSwitchedThisTurn: false
    }
  );

  const handleAddEnergy = useCallback((energy: EnergyType) => {
    setState(prevState => {
      try {
        return AddEnergy(prevState, energy);
      } catch (error) {
        console.error('Error al agregar energía:', error);
        return prevState;
      }
    });
  }, []);

  const handleApplyDamage = useCallback((damage: number) => {
    setState(prevState => applyDamage(prevState, damage));
  }, []);

  const handleSetActivePokemon = useCallback((pokemon: Pokemon) => {
    setState(prevState => setActivePokemon(prevState, pokemon));
  }, []);

  const handleSetBenchPokemon = useCallback((pokemon: Pokemon) => {
    setState(prevState => setBenchPokemon(prevState, pokemon));
  }, []);

  const handleNextPhase = useCallback(() => {
    setState(prevState => nextPhase(prevState));
  }, []);

  const switchPokemon = useCallback((benchIndex: number) => {
    setState(prevState => {
      if (benchIndex >= prevState.bench.length) return prevState;
      const benchPokemon = prevState.bench[benchIndex];
      // Colocar Pokémon activo en el banco
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
    });
  }, []);

  return {
    state,
    addEnergy: handleAddEnergy,
    applyDamage: handleApplyDamage,
    setActivePokemon: handleSetActivePokemon,
    setBenchPokemon: handleSetBenchPokemon,
    nextPhase: handleNextPhase,
    getState: () => getGameState(state),
    switchPokemon
  };
}
```

## 🎮 Componentes React

### Componente: PokemonCard

```typescript
// components/PokemonCard.tsx
import React from 'react';
import { Pokemon } from 'pkm-tcg-scoreboard';
import './PokemonCard.css';

interface PokemonCardProps {
  pokemon: Pokemon;
  isActive?: boolean;
  onClick?: () => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  isActive = false,
  onClick
}) => {
  const maxHP = pokemon.hp;
  const damageCounters = pokemon.damageCounters || 0;
  const healthPercentage = Math.max(0, ((maxHP - damageCounters * 10) / maxHP) * 100);

  return (
    <div
      className={`pokemon-card ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="pokemon-header">
        <h3>{pokemon.name}</h3>
        <span className={`type-badge ${pokemon.type.toLowerCase()}`}>
          {pokemon.type}
        </span>
      </div>

      <div className="pokemon-info">
        <p className="stage">Etapa: {pokemon.stage}</p>
        <div className="hp-bar">
          <div className="hp-fill" style={{ width: `${healthPercentage}%` }}></div>
        </div>
        <p className="hp-text">
          HP: {Math.max(0, maxHP - damageCounters * 10)}/{maxHP}
        </p>
      </div>

      {pokemon.energy && pokemon.energy.length > 0 && (
        <div className="energy-display">
          <p>Energía adjunta:</p>
          <div className="energy-list">
            {pokemon.energy.map((energy, index) => (
              <span key={index} className={`energy-icon ${energy}`}>
                {energy}
              </span>
            ))}
          </div>
        </div>
      )}

      {isActive && (
        <div className="active-indicator">
          ⚡ ACTIVO ⚡
        </div>
      )}
    </div>
  );
};
```

### Componente: GameBoard

```typescript
// components/GameBoard.tsx
import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { PokemonCard } from './PokemonCard';
import { EnergyType, generateId } from 'pkm-tcg-scoreboard';
import './GameBoard.css';

export const GameBoard: React.FC = () => {
  const {
    state,
    addEnergy,
    applyDamage,
    setActivePokemon,
    setBenchPokemon,
    nextPhase,
    switchPokemon
  } = useGameState();

  const mockPokemons = [
    {
      id: generateId(),
      name: 'Pikachu',
      hp: 60,
      type: 'Electric',
      stage: 'Basic' as const,
      damageCounters: 0
    },
    {
      id: generateId(),
      name: 'Charizard',
      hp: 120,
      type: 'Fire',
      stage: 'Stage 2' as const,
      damageCounters: 0
    },
    {
      id: generateId(),
      name: 'Blastoise',
      hp: 110,
      type: 'Water',
      stage: 'Stage 2' as const,
      damageCounters: 0
    }
  ];

  const energyTypes: EnergyType[] = [
    'electric',
    'fire',
    'water',
    'grass',
    'fighting',
    'psychic'
  ];

  const handleAddRandomPokemon = () => {
    const randomPokemon = mockPokemons[Math.floor(Math.random() * mockPokemons.length)];
    if (!state.activePokemon) {
      setActivePokemon(randomPokemon);
    } else {
      setBenchPokemon(randomPokemon);
    }
  };

  return (
    <div className="game-board">
      <header className="game-header">
        <h1>Pokémon TCG Scoreboard</h1>
        <div className="game-info">
          <span>Turno: {state.turnCount}</span>
          <span className="phase-badge">{state.phase.toUpperCase()}</span>
        </div>
      </header>

      <main className="game-container">
        {/* Área de Pokémon Activo */}
        <section className="active-area">
          <h2>Pokémon Activo</h2>
          {state.activePokemon ? (
            <div className="active-pokemon-container">
              <PokemonCard
                pokemon={state.activePokemon}
                isActive={true}
              />
              <div className="action-buttons">
                <button
                  onClick={() => applyDamage(20)}
                  className="btn btn-danger"
                >
                  Aplicar 20 Daño
                </button>
                <button
                  onClick={() => applyDamage(50)}
                  className="btn btn-danger"
                >
                  Aplicar 50 Daño
                </button>
              </div>

              {/* Controles de Energía */}
              <div className="energy-controls">
                <h3>Agregar Energía</h3>
                <div className="energy-buttons">
                  {energyTypes.map(energy => (
                    <button
                      key={energy}
                      onClick={() => addEnergy(energy)}
                      className="btn btn-energy"
                      disabled={state.energyAttachedThisTurn}
                    >
                      {energy}
                    </button>
                  ))}
                </div>
                {state.energyAttachedThisTurn && (
                  <p className="info-text">✓ Energía adjunta este turno</p>
                )}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p>No hay Pokémon activo</p>
              <button onClick={handleAddRandomPokemon} className="btn btn-primary">
                Agregar Pokémon
              </button>
            </div>
          )}
        </section>

        {/* Banco de Pokémon */}
        <section className="bench-area">
          <h2>Banco ({state.bench.length}/5)</h2>
          <div className="bench-container">
            {state.bench.length > 0 ? (
              state.bench.map((pokemon, index) => (
                <div
                  key={pokemon.id}
                  className="bench-pokemon"
                  onClick={() => switchPokemon(index)}
                >
                  <PokemonCard pokemon={pokemon} />
                  <button className="switch-btn">Cambiar</button>
                </div>
              ))
            ) : (
              <div className="empty-bench">
                <p>Banco vacío</p>
                <button
                  onClick={handleAddRandomPokemon}
                  className="btn btn-secondary"
                >
                  Agregar al Banco
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Cartas de Premio */}
        <section className="prize-area">
          <h2>Cartas de Premio</h2>
          <div className="prize-display">
            {Array.from({ length: state.prizeCards }).map((_, index) => (
              <div key={index} className="prize-card">
                <span>{state.prizeCards - index}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Pila de Descarte */}
        <section className="discard-area">
          <h2>Descarte ({state.discardPile.length})</h2>
          <div className="discard-display">
            {state.discardPile.length > 0 ? (
              <div>
                <p className="discard-count">{state.discardPile.length} cartas</p>
                <p className="last-discard">
                  Última: {state.discardPile[state.discardPile.length - 1].name}
                </p>
              </div>
            ) : (
              <p>Pila vacía</p>
            )}
          </div>
        </section>
      </main>

      {/* Controles de Turno */}
      <footer className="game-footer">
        <button onClick={nextPhase} className="btn btn-primary btn-large">
          Siguiente Fase
        </button>
      </footer>
    </div>
  );
};
```

### Estilos CSS

```css
/* components/GameBoard.css */

.game-board {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-family: 'Arial', sans-serif;
}

.game-header {
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 3px solid #ffd700;
}

.game-header h1 {
  margin: 0 0 10px 0;
  font-size: 2.5em;
}

.game-info {
  display: flex;
  gap: 20px;
  font-size: 1.2em;
}

.phase-badge {
  background: #ffd700;
  color: #000;
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: bold;
}

.game-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* Pokémon Activo */
.active-area {
  grid-column: 1 / -1;
  background: rgba(0, 0, 0, 0.4);
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #ffd700;
}

.active-area h2 {
  margin-top: 0;
  color: #ffd700;
}

.active-pokemon-container {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.energy-controls {
  flex: 1;
}

.energy-controls h3 {
  margin-top: 0;
}

.energy-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

/* Banco */
.bench-area {
  background: rgba(0, 0, 0, 0.4);
  padding: 20px;
  border-radius: 10px;
}

.bench-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.bench-pokemon {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
}

.bench-pokemon:hover {
  transform: scale(1.05);
}

.switch-btn {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.2s;
}

.bench-pokemon:hover .switch-btn {
  opacity: 1;
}

/* Tarjetas de Pokémon */
.pokemon-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 2px solid #ffd700;
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.pokemon-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.pokemon-card.active {
  border-color: #ff6b6b;
  box-shadow: 0 0 20px rgba(255, 107, 107, 0.5);
}

.pokemon-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.pokemon-header h3 {
  margin: 0;
  font-size: 1.3em;
}

.type-badge {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.9em;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.3);
}

.type-badge.electric {
  background: #ffeb3b;
  color: #000;
}

.type-badge.fire {
  background: #ff5722;
}

.type-badge.water {
  background: #2196f3;
}

.hp-bar {
  width: 100%;
  height: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  overflow: hidden;
  margin: 10px 0;
}

.hp-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50 0%, #8bc34a 100%);
  transition: width 0.3s;
}

.hp-text {
  font-size: 0.9em;
  margin: 5px 0;
}

/* Botones */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-primary {
  background: #4caf50;
  color: white;
}

.btn-primary:hover {
  background: #45a049;
}

.btn-danger {
  background: #f44336;
  color: white;
}

.btn-danger:hover {
  background: #da190b;
}

.btn-secondary {
  background: #2196f3;
  color: white;
}

.btn-energy {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 15px;
  font-size: 0.9em;
}

.btn-energy:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.4);
}

.btn-energy:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-large {
  padding: 15px 40px;
  font-size: 1.1em;
}

.game-footer {
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-top: 3px solid #ffd700;
  display: flex;
  justify-content: center;
}
```

## 🚀 Ejemplo Completo de Aplicación

```typescript
// App.tsx
import React from 'react';
import { GameBoard } from './components/GameBoard';
import './App.css';

function App() {
  return (
    <div className="app">
      <GameBoard />
    </div>
  );
}

export default App;
```

```typescript
// main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

## 🔄 Patrón con Context (para aplicaciones más complejas)

```typescript
// context/GameContext.tsx
import React, { createContext, useContext } from 'react';
import { useGameState } from '../hooks/useGameState';

const GameContext = createContext(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const game = useGameState();

  return (
    <GameContext.Provider value={game}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame debe usarse dentro de GameProvider');
  }
  return context;
};
```

```typescript
// Uso en componentes
import { useGame } from '../context/GameContext';

export const PokemonDisplay: React.FC = () => {
  const { state } = useGame();
  
  return (
    <div>
      {state.activePokemon && (
        <h2>{state.activePokemon.name}</h2>
      )}
    </div>
  );
};
```

## 📋 Checklist de Implementación

- [ ] Instalar pkm-tcg-scoreboard
- [ ] Crear hook useGameState
- [ ] Implementar componente PokemonCard
- [ ] Implementar componente GameBoard
- [ ] Agregar estilos CSS
- [ ] Configurar rutas (si aplica)
- [ ] Integrar con Context API (opcional)
- [ ] Agregar tests con Vitest/Testing Library
- [ ] Desplegar aplicación

## 🎓 Recursos Adicionales

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [pkm-tcg-scoreboard Docs](../README.md)
