# Pokémon TCG Scoreboard

Una librería TypeScript para gestionar el estado del juego Pokémon Trading Card Game (TCG). Proporciona una API funcional y de fácil uso para manejar todas las mecánicas principales del juego.

## 🎮 Características

- ✅ Gestión del estado del juego inmutable
- ✅ Manejo de Pokémon activos y banco
- ✅ Sistema de energía
- ✅ Aplicación de daño
- ✅ Fases del turno (draw, main, attack, end)
- ✅ Validaciones de reglas del juego
- ✅ Generación de IDs únicos
- ✅ Totalmente tipado con TypeScript
- ✅ Sin dependencias externas

## 📦 Instalación

```bash
npm install pkm-tcg-scoreboard
```

## 🚀 Uso Básico

### Inicializar el Juego

```typescript
import { GameState, Pokemon, generateId } from 'pkm-tcg-scoreboard';

// Crear un Pokémon básico
const pikachu: Pokemon = {
  id: generateId(),
  name: 'Pikachu',
  hp: 60,
  type: 'Electric',
  stage: 'Basic'
};

// Inicializar el estado del juego
const initialState: GameState = {
  activePokemon: null,
  bench: [],
  prizeCards: 6,
  discardPile: [],
  turnCount: 0,
  playerName: 'Entrenador 1',
  phase: 'draw',
  energyAttachedThisTurn: false,
  hasSwitchedThisTurn: false
};
```

### Operaciones Principales

#### 1. Establecer Pokémon Activo

```typescript
import { setActivePokemon } from 'pkm-tcg-scoreboard';

const newState = setActivePokemon(initialState, pikachu);
console.log(newState.activePokemon); // { id, name: 'Pikachu', ... }
```

#### 2. Agregar Pokémon al Banco

```typescript
import { setBenchPokemon } from 'pkm-tcg-scoreboard';

const charizard: Pokemon = {
  id: generateId(),
  name: 'Charizard',
  hp: 120,
  type: 'Fire',
  stage: 'Stage 2'
};

const newState = setBenchPokemon(initialState, charizard);
console.log(newState.bench.length); // 1
```

#### 3. Agregar Energía

```typescript
import { AddEnergy } from 'pkm-tcg-scoreboard';

const stateWithEnergy = AddEnergy(newState, 'electric');
console.log(stateWithEnergy.activePokemon?.energy); // ['electric']
console.log(stateWithEnergy.energyAttachedThisTurn); // true
```

#### 4. Aplicar Daño

```typescript
import { applyDamage } from 'pkm-tcg-scoreboard';

const damagedState = applyDamage(stateWithEnergy, 20);
console.log(damagedState.activePokemon?.damageCounters); // 1 (20 damage = 1 counter)
```

#### 5. Cambiar de Fase

```typescript
import { nextPhase } from 'pkm-tcg-scoreboard';

const nextState = nextPhase(stateWithEnergy);
// 'draw' -> 'main' -> 'attack' -> 'end' -> 'draw'
console.log(nextState.phase);
```

## 🔍 Validaciones

La librería incluye validaciones para asegurar que se respeten las reglas del juego:

```typescript
import {
  hasActivePokemon,
  isPokemonDefeated,
  isBasicPokemon,
  isEnergyAttachedThisTurn,
  hasEnergyAttachedThisTurn,
  hasSwitchedThisTurn,
  isKnockoutPokemon,
  validatePokemon
} from 'pkm-tcg-scoreboard';

// Verificar si hay un Pokémon activo
if (!hasActivePokemon(gameState)) {
  console.log('No hay Pokémon activo');
}

// Verificar si un Pokémon está derrotado
if (isPokemonDefeated(pikachu)) {
  console.log('Pikachu está derrotado');
}

// Verificar si es un Pokémon básico
if (isBasicPokemon(pikachu)) {
  console.log('Es un Pokémon básico');
}

// Verificar si ya se adjuntó energía este turno
if (isEnergyAttachedThisTurn(gameState)) {
  console.log('Ya se adjuntó energía este turno');
}

// Validar un Pokémon completo
const errors = validatePokemon(pikachu);
if (errors.length > 0) {
  console.error('Errores de validación:', errors);
}
```

## 🔗 Tipos Disponibles

### GameState

```typescript
interface GameState {
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
```

### Pokemon

```typescript
interface Pokemon {
  readonly id: string;
  readonly name: string;
  readonly hp: number;
  readonly type: string;
  readonly damageCounters?: number;
  readonly energy?: EnergyType[];
  readonly stage: 'Basic' | 'Stage 1' | 'Stage 2';
}
```

### EnergyType

```typescript
type EnergyType = 'fire' | 'water' | 'grass' | 'lightning' | 'psychic' | 
                  'fighting' | 'darkness' | 'metal' | 'fairy' | 'dragon' | 'colorless';
```

## 📚 Ejemplos de Integración

### React

Ver [ejemplos de React](./examples/react/README.md)

```typescript
import useGameState from './hooks/useGameState';

export function GameBoard() {
  const { state, addEnergy, applyDamage, nextPhase } = useGameState();
  
  return (
    <div>
      <h1>Turno: {state.turnCount}</h1>
      <p>Fase: {state.phase}</p>
      {state.activePokemon && (
        <div>
          <h2>{state.activePokemon.name}</h2>
          <p>HP: {state.activePokemon.hp}</p>
          <button onClick={() => addEnergy('electric')}>Agregar Energía</button>
          <button onClick={() => applyDamage(20)}>Aplicar Daño</button>
        </div>
      )}
      <button onClick={nextPhase}>Siguiente Fase</button>
    </div>
  );
}
```

### Angular

Ver [ejemplos de Angular](./examples/angular/README.md)

```typescript
import { Component } from '@angular/core';
import { GameStateService } from './services/game-state.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html'
})
export class GameBoardComponent {
  gameState$ = this.gameService.state$;

  constructor(private gameService: GameStateService) {}

  addEnergy(energyType: string) {
    this.gameService.addEnergy(energyType);
  }

  applyDamage(damage: number) {
    this.gameService.applyDamage(damage);
  }

  nextPhase() {
    this.gameService.nextPhase();
  }
}
```

## 🏗️ Arquitectura

La librería sigue principios de programación funcional:

- **Inmutabilidad**: Todos los cambios de estado devuelven un nuevo objeto GameState
- **Pure Functions**: Todas las funciones son puras (no tienen efectos secundarios)
- **Type Safety**: Totalmente tipada con TypeScript

```typescript
// ✅ Bien - Retorna nuevo estado
const newState = AddEnergy(currentState, 'electric');

// ❌ Mal - Mutación directa (no hacer)
currentState.activePokemon?.energy?.push('electric');
```

## 🧪 Testing

La librería incluye tests con Vitest:

```bash
npm test
```

Ver ejemplos de tests en [tests/](./tests/)

```typescript
import { describe, it, expect } from 'vitest';
import { AddEnergy, GameState } from '..';

describe('AddEnergy', () => {
  it('should add energy to active pokemon', () => {
    const state: GameState = { /* ... */ };
    const newState = AddEnergy(state, 'electric');
    
    expect(newState.activePokemon?.energy).toContain('electric');
    expect(newState.energyAttachedThisTurn).toBe(true);
  });
});
```

## 📖 Constantes

La librería proporciona constantes útiles:

```typescript
import { DEFAULT_PRIZE_CARDS, ERROR_MESSAGES } from 'pkm-tcg-scoreboard';

console.log(DEFAULT_PRIZE_CARDS); // 6

// Mensajes de error predefinidos
console.log(ERROR_MESSAGES.ENERGY_ALREADY_ATTACHED);
console.log(ERROR_MESSAGES.NO_ACTIVE_POKEMON);
console.log(ERROR_MESSAGES.INVALID_POKEMON);
```

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

ISC

## 🔗 Enlaces Útiles

- [Guía de React](./examples/react/README.md)
- [Guía de Angular](./examples/angular/README.md)
- [Documentación de Reglas del Pokémon TCG](https://www.pokemon.com/en-us/trading-card-game/rules/)
