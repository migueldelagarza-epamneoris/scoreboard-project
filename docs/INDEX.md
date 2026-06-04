# 📚 Documentación - pkm-tcg-scoreboard

Bienvenido a la documentación completa de **pkm-tcg-scoreboard**, una librería TypeScript para gestionar el estado del juego Pokémon Trading Card Game.

## 📖 Índice de Contenidos

### 🚀 Inicio Rápido
- **[README Principal](../README.md)** - Descripción general, instalación y conceptos básicos
- **[Inicio Rápido](#inicio-rpido)** - Tu primer juego en 5 minutos

### 🎮 Guías por Framework

#### React
- **[Guía de React](../examples/react/README.md)** - Integración completa con React
  - Hook `useGameState`
  - Componentes principales
  - Context API
  - Patrones avanzados

#### Angular
- **[Guía de Angular](../examples/angular/README.md)** - Integración completa con Angular
  - Service `GameStateService`
  - Componentes standalone
  - RxJS Observables
  - Dependency Injection

### 📋 Referencia

- **[API Reference](./API_REFERENCE.md)** - Documentación completa de todas las funciones
  - Interfaces (GameState, Pokemon)
  - Tipos (EnergyType, SpecialCondition)
  - Core Functions (AddEnergy, applyDamage, etc.)
  - Validation Functions
  - Constants
  - Utilities

- **[Guía de Migración](./MIGRATION_GUIDE.md)** - Migración entre React y Angular
  - Conceptos equivalentes
  - Patrones de migración
  - Ejemplos lado a lado
  - Comparación de performance

### 💡 Ejemplos Avanzados

- **[Ejemplos Avanzados](./ADVANCED_EXAMPLES.md)** - Casos de uso complejos
  1. **Multiplayer con Redux** (React)
  2. **State Machine para Turnos** (Angular)
  3. **Sistema de Historial** (React)
  4. **Persistencia con LocalStorage** (Angular)
  5. **Analytics y Estadísticas** (React)

### 📁 Estructura de Carpetas

```
pkm-tcg-scoreboard/
├── docs/
│   ├── API_REFERENCE.md          # Referencia completa de la API
│   ├── MIGRATION_GUIDE.md        # Guía de migración React ↔ Angular
│   ├── ADVANCED_EXAMPLES.md      # Ejemplos avanzados
│   └── INDEX.md                  # Este archivo
├── examples/
│   ├── react/
│   │   ├── README.md
│   │   ├── components/
│   │   │   └── PokemonCard.tsx
│   │   └── hooks/
│   │       └── useGameState.ts
│   └── angular/
│       ├── README.md
│       ├── components/
│       │   └── pokemon-card/
│       │       ├── pokemon-card.component.ts
│       │       ├── pokemon-card.component.html
│       │       └── pokemon-card.component.css
│       └── services/
│           └── game-state.service.ts
├── src/
│   ├── index.ts
│   ├── interfaces/
│   ├── types/
│   ├── core/
│   ├── constants/
│   ├── validations/
│   └── utils/
├── tests/
├── README.md
├── package.json
└── tsconfig.json
```

---

## 🚀 Inicio Rápido

### Instalación

```bash
npm install pkm-tcg-scoreboard
```

### Uso Básico

```typescript
import {
  GameState,
  Pokemon,
  AddEnergy,
  applyDamage,
  nextPhase,
  generateId
} from 'pkm-tcg-scoreboard';

// Crear un Pokémon
const pikachu: Pokemon = {
  id: generateId(),
  name: 'Pikachu',
  hp: 60,
  type: 'Electric',
  stage: 'Basic'
};

// Inicializar estado
const gameState: GameState = {
  activePokemon: pikachu,
  bench: [],
  prizeCards: 6,
  discardPile: [],
  turnCount: 0,
  playerName: 'Jugador',
  phase: 'draw'
};

// Realizar acciones
let state = gameState;
state = AddEnergy(state, 'electric');
state = applyDamage(state, 20);
state = nextPhase(state);

console.log(state.phase); // 'main'
```

### React

```typescript
import { useGameState } from './hooks/useGameState';

function App() {
  const { state, addEnergy, applyDamage, nextPhase } = useGameState();

  return (
    <div>
      <h1>Turno: {state.turnCount}</h1>
      <button onClick={() => addEnergy('electric')}>Agregar Energía</button>
      <button onClick={() => applyDamage(20)}>Aplicar Daño</button>
      <button onClick={nextPhase}>Siguiente Fase</button>
    </div>
  );
}
```

### Angular

```typescript
import { Component } from '@angular/core';
import { GameStateService } from './services/game-state.service';

@Component({
  selector: 'app-game',
  template: `
    <div *ngIf="gameState$ | async as state">
      <h1>Turno: {{ state.turnCount }}</h1>
      <button (click)="addEnergy('electric')">Agregar Energía</button>
      <button (click)="applyDamage(20)">Aplicar Daño</button>
      <button (click)="nextPhase()">Siguiente Fase</button>
    </div>
  `
})
export class GameComponent {
  gameState$ = this.gameService.state$;

  constructor(private gameService: GameStateService) {}

  addEnergy(type: string) {
    this.gameService.addEnergy(type as any);
  }

  applyDamage(amount: number) {
    this.gameService.applyDamage(amount);
  }

  nextPhase() {
    this.gameService.nextPhase();
  }
}
```

---

## 🎮 Conceptos Principales

### GameState

El estado del juego es **inmutable**. Todas las operaciones retornan un nuevo estado:

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

### Pokémon

Cada Pokémon es un objeto inmutable:

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

### Fases del Turno

Ciclo: **Draw** → **Main** → **Attack** → **End** → **Draw**

- **Draw**: Roba una carta
- **Main**: Juega cartas y realiza acciones
- **Attack**: Ataca al Pokémon contrario
- **End**: Finaliza el turno

---

## 📊 Comparación: React vs Angular

| Aspecto | React | Angular |
|---------|-------|---------|
| **Patrón** | Hooks | Services + DI |
| **Estado** | useState | BehaviorSubject |
| **Async** | Callbacks | Observables (RxJS) |
| **Componentes** | Funcionales | Clases o Standalone |
| **Props** | Parámetros | @Input/@Output |
| **Curva Aprendizaje** | Baja | Media-Alta |

**Elige React si:**
- Prefieres curva de aprendizaje suave
- Trabajas con pequeños equipos
- Necesitas flexibilidad máxima

**Elige Angular si:**
- Necesitas estructura predefinida
- Trabajas en equipos grandes
- Requieres TypeScript strict

---

## 🔍 Validaciones

La librería incluye validaciones automáticas:

```typescript
import { validatePokemon, hasActivePokemon, isPokemonDefeated } from 'pkm-tcg-scoreboard';

// Validar un Pokémon
const errors = validatePokemon(pikachu);

// Verificar condiciones
if (!hasActivePokemon(gameState)) {
  console.log('No hay Pokémon activo');
}

if (isPokemonDefeated(pikachu)) {
  console.log('Pikachu fue derrotado');
}
```

---

## 🧪 Testing

### React (Vitest)

```typescript
import { renderHook, act } from '@testing-library/react';
import { useGameState } from './hooks/useGameState';

describe('useGameState', () => {
  it('debe agregar energía', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.addEnergy('electric');
    });

    expect(result.current.state.energyAttachedThisTurn).toBe(true);
  });
});
```

### Angular (Jasmine)

```typescript
import { TestBed } from '@angular/core/testing';
import { GameStateService } from './game-state.service';

describe('GameStateService', () => {
  let service: GameStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameStateService);
  });

  it('debe agregar energía', (done) => {
    service.addEnergy('electric');
    service.state$.subscribe(state => {
      expect(state.energyAttachedThisTurn).toBe(true);
      done();
    });
  });
});
```

---

## 🚨 Errores Comunes

### ❌ No: Mutación Directa

```typescript
// MAL - No hacer esto
gameState.activePokemon!.energy!.push('electric');
gameState.activePokemon!.damageCounters = 5;
```

### ✅ Sí: Usar Funciones

```typescript
// BIEN - Usar las funciones de la librería
const newState = AddEnergy(gameState, 'electric');
const damagedState = applyDamage(newState, 50);
```

---

## 🔗 Enlaces Útiles

- [Repositorio GitHub](https://github.com/tu-usuario/pkm-tcg-scoreboard)
- [npm Package](https://www.npmjs.com/package/pkm-tcg-scoreboard)
- [Pokémon TCG Rules](https://www.pokemon.com/us/trading-card-game/rules/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)
- [Angular Documentation](https://angular.dev)

---

## 🤝 Contribuciones

¿Encontraste un error en la documentación? ¿Tienes una sugerencia?

1. Fork el repositorio
2. Crea una rama: `git checkout -b docs/improvement`
3. Commit: `git commit -m 'Improve documentation'`
4. Push: `git push origin docs/improvement`
5. Crea un Pull Request

---

## 📝 Licencia

ISC

---

## 🎓 Roadmap de Aprendizaje

### Nivel Beginner
1. Leer [README.md](../README.md)
2. Seguir [Inicio Rápido](#inicio-rpido)
3. Explorar [Guía de React](../examples/react/README.md) o [Guía de Angular](../examples/angular/README.md)

### Nivel Intermediate
1. Estudiar [API Reference](./API_REFERENCE.md)
2. Revisar ejemplos en `examples/`
3. Implementar un pequeño proyecto

### Nivel Advanced
1. Leer [Ejemplos Avanzados](./ADVANCED_EXAMPLES.md)
2. Implementar features complejas
3. Contribuir a la librería

---

**¡Gracias por usar pkm-tcg-scoreboard! 🎮**
