# API Reference - pkm-tcg-scoreboard

Documentación completa de todas las funciones, interfaces y tipos disponibles en la librería.

## 📦 Importaciones

```typescript
import {
  // Interfaces
  GameState,
  Pokemon,
  
  // Types
  EnergyType,
  SpecialCondition,
  
  // Core Functions
  AddEnergy,
  applyDamage,
  setActivePokemon,
  setBenchPokemon,
  nextPhase,
  getGameState,
  
  // Validations
  hasActivePokemon,
  isPokemonDefeated,
  isBasicPokemon,
  isEnergyAttachedThisTurn,
  hasEnergyAttachedThisTurn,
  hasSwitchedThisTurn,
  isKnockoutPokemon,
  validatePokemon,
  
  // Constants
  DEFAULT_PRIZE_CARDS,
  ERROR_MESSAGES,
  GAME_CONSTANTS,
  VALIDATION_MESSAGES,
  
  // Utils
  generateId
} from 'pkm-tcg-scoreboard';
```

## 🔷 Interfaces

### GameState

Estado inmutable del juego Pokémon TCG.

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

**Propiedades:**

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `activePokemon` | `Pokemon \| null` | Pokémon actualmente en juego |
| `bench` | `Pokemon[]` | Array de Pokémon en el banco (máx 5) |
| `prizeCards` | `number` | Cantidad de cartas de premio |
| `discardPile` | `Pokemon[]` | Pila de descarte |
| `turnCount` | `number` | Número del turno actual |
| `playerName` | `string` | Nombre del jugador (opcional) |
| `phase` | `'draw' \| 'main' \| 'attack' \| 'end'` | Fase actual del turno |
| `energyAttachedThisTurn` | `boolean` | ¿Se adjuntó energía en este turno? |
| `hasSwitchedThisTurn` | `boolean` | ¿Se cambió de Pokémon en este turno? |

---

### Pokemon

Representa un Pokémon en juego.

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

**Propiedades:**

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `id` | `string` | ID único del Pokémon |
| `name` | `string` | Nombre del Pokémon |
| `hp` | `number` | Puntos de salud máximos |
| `type` | `string` | Tipo de Pokémon (Fire, Water, etc.) |
| `damageCounters` | `number` | Cantidad de contadores de daño |
| `energy` | `EnergyType[]` | Energía adjunta |
| `stage` | `'Basic' \| 'Stage 1' \| 'Stage 2'` | Etapa del Pokémon |

---

## 🔶 Types

### EnergyType

Tipos de energía disponibles en el juego.

```typescript
type EnergyType = 
  | 'fire' 
  | 'water' 
  | 'grass' 
  | 'lightning' 
  | 'psychic' 
  | 'fighting' 
  | 'darkness' 
  | 'metal' 
  | 'fairy' 
  | 'dragon' 
  | 'colorless';
```

---

### SpecialCondition

Condiciones especiales que pueden afectar a un Pokémon.

```typescript
type SpecialCondition = 
  | 'sleep' 
  | 'paralysis' 
  | 'poison' 
  | 'burn' 
  | 'confusion';
```

---

## 🎮 Core Functions

### AddEnergy

```typescript
function AddEnergy(state: GameState, energy: EnergyType): GameState
```

Agrega energía al Pokémon activo.

**Parámetros:**
- `state`: Estado actual del juego
- `energy`: Tipo de energía a agregar

**Retorna:** Nuevo estado con energía adjunta

**Lanza:**
- Error si ya se adjuntó energía en este turno
- Error si no hay Pokémon activo

**Ejemplo:**
```typescript
const newState = AddEnergy(gameState, 'electric');
console.log(newState.activePokemon?.energy); // ['electric']
```

---

### applyDamage

```typescript
function applyDamage(state: GameState, damage: number): GameState
```

Aplica daño al Pokémon activo.

**Parámetros:**
- `state`: Estado actual del juego
- `damage`: Cantidad de daño a aplicar

**Retorna:** Nuevo estado con daño aplicado

**Nota:** 10 puntos de daño = 1 contador de daño

**Ejemplo:**
```typescript
const damagedState = applyDamage(gameState, 20);
// Aplica 2 contadores de daño
```

---

### setActivePokemon

```typescript
function setActivePokemon(state: GameState, pokemon: Pokemon): GameState
```

Establece un Pokémon como activo.

**Parámetros:**
- `state`: Estado actual del juego
- `pokemon`: Pokémon a activar

**Retorna:** Nuevo estado con Pokémon activo

**Ejemplo:**
```typescript
const newState = setActivePokemon(gameState, pikachu);
```

---

### setBenchPokemon

```typescript
function setBenchPokemon(state: GameState, pokemon: Pokemon): GameState
```

Agrega un Pokémon al banco.

**Parámetros:**
- `state`: Estado actual del juego
- `pokemon`: Pokémon a agregar al banco

**Retorna:** Nuevo estado con Pokémon en el banco

**Lanza:** Error si el banco está lleno (máx 5)

**Ejemplo:**
```typescript
const newState = setBenchPokemon(gameState, charizard);
```

---

### nextPhase

```typescript
function nextPhase(state: GameState): GameState
```

Avanza a la siguiente fase del turno.

**Parámetros:**
- `state`: Estado actual del juego

**Retorna:** Nuevo estado con siguiente fase

**Ciclo de fases:** draw → main → attack → end → draw

**Ejemplo:**
```typescript
const newState = nextPhase(gameState);
// Si estaba en 'draw', ahora está en 'main'
```

---

### getGameState

```typescript
function getGameState(state: GameState): GameState
```

Obtiene una copia del estado actual.

**Parámetros:**
- `state`: Estado del juego

**Retorna:** Copia del estado

---

## ✅ Validation Functions

### hasActivePokemon

```typescript
function hasActivePokemon(state: GameState): boolean
```

Verifica si hay un Pokémon activo.

```typescript
if (hasActivePokemon(gameState)) {
  console.log('Hay un Pokémon activo');
}
```

---

### isPokemonDefeated

```typescript
function isPokemonDefeated(pokemon: Pokemon): boolean
```

Verifica si un Pokémon está derrotado (HP ≤ 0).

```typescript
if (isPokemonDefeated(pikachu)) {
  console.log('Pikachu está derrotado');
}
```

---

### isBasicPokemon

```typescript
function isBasicPokemon(pokemon: Pokemon): boolean
```

Verifica si un Pokémon es de tipo básico.

```typescript
if (isBasicPokemon(pikachu)) {
  console.log('Es un Pokémon básico');
}
```

---

### isEnergyAttachedThisTurn

```typescript
function isEnergyAttachedThisTurn(state: GameState): boolean
```

Verifica si ya se adjuntó energía en este turno.

```typescript
if (isEnergyAttachedThisTurn(gameState)) {
  console.log('Ya se adjuntó energía este turno');
}
```

---

### hasEnergyAttachedThisTurn

```typescript
function hasEnergyAttachedThisTurn(state: GameState): boolean
```

Alias de `isEnergyAttachedThisTurn`.

---

### hasSwitchedThisTurn

```typescript
function hasSwitchedThisTurn(state: GameState): boolean
```

Verifica si se cambió de Pokémon en este turno.

```typescript
if (hasSwitchedThisTurn(gameState)) {
  console.log('Se cambió de Pokémon este turno');
}
```

---

### isKnockoutPokemon

```typescript
function isKnockoutPokemon(pokemon: Pokemon): boolean
```

Verifica si un Pokémon puede ser derrotado (su HP es vulnerable).

---

### validatePokemon

```typescript
function validatePokemon(pokemon: Pokemon): string[]
```

Valida un Pokémon y retorna un array de errores.

**Retorna:** Array de mensajes de error (vacío si es válido)

```typescript
const errors = validatePokemon(pikachu);
if (errors.length > 0) {
  console.error('Errores:', errors);
}
```

---

## 📍 Constants

### DEFAULT_PRIZE_CARDS

```typescript
export const DEFAULT_PRIZE_CARDS = 6;
```

Cantidad por defecto de cartas de premio.

---

### ERROR_MESSAGES

```typescript
export const ERROR_MESSAGES = {
  ENERGY_ALREADY_ATTACHED: "Ya se adjuntó energía este turno",
  NO_ACTIVE_POKEMON: "No hay Pokémon activo",
  INVALID_POKEMON: "Pokémon inválido",
  INVALID_BENCH_SIZE: "El banco está lleno",
  // ... más mensajes
};
```

---

### GAME_CONSTANTS

```typescript
export const GAME_CONSTANTS = {
  MAX_BENCH_SIZE: 5,
  DAMAGE_PER_COUNTER: 10,
  // ... más constantes
};
```

---

### VALIDATION_MESSAGES

```typescript
export const VALIDATION_MESSAGES = {
  // Mensajes de validación personalizados
};
```

---

## 🛠️ Utility Functions

### generateId

```typescript
function generateId(): string
```

Genera un ID único para una entidad.

**Retorna:** String con ID único

```typescript
const pokemonId = generateId();
const pokemon: Pokemon = {
  id: pokemonId,
  name: 'Pikachu',
  hp: 60,
  type: 'Electric',
  stage: 'Basic'
};
```

---

## 🔄 Patrones de Uso

### Pattern 1: Composición de Funciones

```typescript
let state: GameState = initialState;

state = setActivePokemon(state, pikachu);
state = AddEnergy(state, 'electric');
state = AddEnergy(state, 'electric'); // ❌ Error: ya se adjuntó energía
state = applyDamage(state, 20);
state = nextPhase(state);
```

### Pattern 2: Validación Antes de Operación

```typescript
if (!hasActivePokemon(gameState)) {
  console.error('No hay Pokémon activo');
  return;
}

if (isEnergyAttachedThisTurn(gameState)) {
  console.error('Ya se adjuntó energía este turno');
  return;
}

const newState = AddEnergy(gameState, 'water');
```

### Pattern 3: Manejo de Errores

```typescript
try {
  let state = setActivePokemon(gameState, pokemon);
  state = AddEnergy(state, 'fire');
  // Continuar...
} catch (error) {
  console.error('Error en operación:', error.message);
}
```

---

## 📋 Resumen de Cambios de Estado

| Operación | Cambia | Preserva |
|-----------|--------|----------|
| `setActivePokemon` | `activePokemon`, `bench` | Resto del estado |
| `setBenchPokemon` | `bench` | Resto del estado |
| `AddEnergy` | `activePokemon.energy`, `energyAttachedThisTurn` | Resto |
| `applyDamage` | `activePokemon.damageCounters` | Resto |
| `nextPhase` | `phase`, `turnCount` | Resto |

---

## 🎓 Best Practices

1. **Siempre validar** antes de operaciones
2. **No mutar** el estado directamente
3. **Usar las funciones** proporcionadas
4. **Manejar errores** apropiadamente
5. **Generar IDs** con `generateId()`
6. **Imprimir estado** para debugging
7. **Usar TypeScript** para seguridad de tipos

---

## ⚠️ Limitaciones

- Máximo 5 Pokémon en el banco
- Solo 1 energía por turno
- Solo 1 cambio de Pokémon por turno
- Las operaciones son inmutables (nuevo objeto)

---

## 🔗 Enlaces Relacionados

- [Guía de React](../examples/react/README.md)
- [Guía de Angular](../examples/angular/README.md)
- [Guía de Migración](MIGRATION_GUIDE.md)
- [README Principal](../README.md)
