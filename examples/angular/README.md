# Integración con Angular

Guía completa para integrar `pkm-tcg-scoreboard` en aplicaciones Angular.

## 📦 Instalación

```bash
npm install pkm-tcg-scoreboard
ng new pokemon-tcg-angular
cd pokemon-tcg-angular
npm install
```

## 🏗️ Servicio: GameStateService

```typescript
// services/game-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  GameState,
  Pokemon,
  AddEnergy,
  applyDamage,
  setActivePokemon,
  setBenchPokemon,
  nextPhase,
  EnergyType,
  getGameState
} from 'pkm-tcg-scoreboard';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private initialState: GameState = {
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

  private stateSubject = new BehaviorSubject<GameState>(this.initialState);
  public state$ = this.stateSubject.asObservable();

  constructor() {}

  get currentState(): GameState {
    return this.stateSubject.value;
  }

  addEnergy(energy: EnergyType): void {
    try {
      const newState = AddEnergy(this.currentState, energy);
      this.stateSubject.next(newState);
    } catch (error) {
      console.error('Error al agregar energía:', error);
    }
  }

  applyDamage(damage: number): void {
    const newState = applyDamage(this.currentState, damage);
    this.stateSubject.next(newState);
  }

  setActivePokemon(pokemon: Pokemon): void {
    const newState = setActivePokemon(this.currentState, pokemon);
    this.stateSubject.next(newState);
  }

  setBenchPokemon(pokemon: Pokemon): void {
    const newState = setBenchPokemon(this.currentState, pokemon);
    this.stateSubject.next(newState);
  }

  nextPhase(): void {
    const newState = nextPhase(this.currentState);
    this.stateSubject.next(newState);
  }

  switchPokemon(benchIndex: number): void {
    const state = this.currentState;
    if (benchIndex >= state.bench.length) return;

    const benchPokemon = state.bench[benchIndex];
    const newBench = [...state.bench];

    if (state.activePokemon) {
      newBench[benchIndex] = state.activePokemon;
    }

    this.stateSubject.next({
      ...state,
      activePokemon: benchPokemon,
      bench: newBench,
      hasSwitchedThisTurn: true
    });
  }

  getState(): GameState {
    return getGameState(this.currentState);
  }

  resetGame(): void {
    this.stateSubject.next(this.initialState);
  }
}
```

## 🧩 Componentes Angular

### Componente: PokemonCardComponent

```typescript
// components/pokemon-card/pokemon-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pokemon } from 'pkm-tcg-scoreboard';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.css']
})
export class PokemonCardComponent {
  @Input() pokemon!: Pokemon;
  @Input() isActive: boolean = false;
  @Output() onClick = new EventEmitter<void>();

  get healthPercentage(): number {
    const maxHP = this.pokemon.hp;
    const damageCounters = this.pokemon.damageCounters || 0;
    return Math.max(0, ((maxHP - damageCounters * 10) / maxHP) * 100);
  }

  get currentHP(): number {
    return Math.max(0, this.pokemon.hp - (this.pokemon.damageCounters || 0) * 10);
  }

  handleClick(): void {
    this.onClick.emit();
  }
}
```

```html
<!-- pokemon-card.component.html -->
<div class="pokemon-card" [class.active]="isActive" (click)="handleClick()">
  <div class="pokemon-header">
    <h3>{{ pokemon.name }}</h3>
    <span class="type-badge" [ngClass]="pokemon.type.toLowerCase()">
      {{ pokemon.type }}
    </span>
  </div>

  <div class="pokemon-info">
    <p class="stage">Etapa: {{ pokemon.stage }}</p>
    <div class="hp-bar">
      <div class="hp-fill" [style.width.%]="healthPercentage"></div>
    </div>
    <p class="hp-text">
      HP: {{ currentHP }}/{{ pokemon.hp }}
    </p>
  </div>

  <div *ngIf="pokemon.energy && pokemon.energy.length > 0" class="energy-display">
    <p>Energía adjunta:</p>
    <div class="energy-list">
      <span *ngFor="let energy of pokemon.energy" 
            class="energy-icon" 
            [ngClass]="energy">
        {{ energy }}
      </span>
    </div>
  </div>

  <div *ngIf="isActive" class="active-indicator">
    ⚡ ACTIVO ⚡
  </div>
</div>
```

```css
/* pokemon-card.component.css */
.pokemon-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 2px solid #ffd700;
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s;
  color: white;
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

.energy-display {
  margin-top: 10px;
}

.energy-display p {
  margin: 5px 0;
  font-size: 0.9em;
}

.energy-list {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.energy-icon {
  display: inline-block;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-size: 0.8em;
}

.active-indicator {
  margin-top: 10px;
  padding: 10px;
  background: rgba(255, 107, 107, 0.3);
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
  color: #ff6b6b;
}
```

### Componente: GameBoardComponent

```typescript
// components/game-board/game-board.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameStateService } from '../../services/game-state.service';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { Pokemon, EnergyType, generateId, GameState } from 'pkm-tcg-scoreboard';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule, PokemonCardComponent],
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit, OnDestroy {
  gameState!: GameState;
  private destroy$ = new Subject<void>();

  energyTypes: EnergyType[] = [
    'electric',
    'fire',
    'water',
    'grass',
    'fighting',
    'psychic'
  ];

  mockPokemons: Pokemon[] = [
    {
      id: generateId(),
      name: 'Pikachu',
      hp: 60,
      type: 'Electric',
      stage: 'Basic',
      damageCounters: 0
    },
    {
      id: generateId(),
      name: 'Charizard',
      hp: 120,
      type: 'Fire',
      stage: 'Stage 2',
      damageCounters: 0
    },
    {
      id: generateId(),
      name: 'Blastoise',
      hp: 110,
      type: 'Water',
      stage: 'Stage 2',
      damageCounters: 0
    },
    {
      id: generateId(),
      name: 'Venusaur',
      hp: 100,
      type: 'Grass',
      stage: 'Stage 2',
      damageCounters: 0
    }
  ];

  constructor(private gameStateService: GameStateService) {}

  ngOnInit(): void {
    this.gameStateService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.gameState = state;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addEnergy(energy: EnergyType): void {
    this.gameStateService.addEnergy(energy);
  }

  applyDamage(damage: number): void {
    this.gameStateService.applyDamage(damage);
  }

  setActivePokemon(pokemon: Pokemon): void {
    this.gameStateService.setActivePokemon(pokemon);
  }

  setBenchPokemon(pokemon: Pokemon): void {
    this.gameStateService.setBenchPokemon(pokemon);
  }

  nextPhase(): void {
    this.gameStateService.nextPhase();
  }

  switchPokemon(benchIndex: number): void {
    this.gameStateService.switchPokemon(benchIndex);
  }

  addRandomPokemon(): void {
    const randomPokemon = 
      this.mockPokemons[Math.floor(Math.random() * this.mockPokemons.length)];
    
    if (!this.gameState.activePokemon) {
      this.setActivePokemon(randomPokemon);
    } else {
      this.setBenchPokemon(randomPokemon);
    }
  }

  resetGame(): void {
    this.gameStateService.resetGame();
  }
}
```

```html
<!-- game-board.component.html -->
<div class="game-board">
  <header class="game-header">
    <h1>Pokémon TCG Scoreboard</h1>
    <div class="game-info">
      <span>Turno: {{ gameState.turnCount }}</span>
      <span class="phase-badge">{{ gameState.phase.toUpperCase() }}</span>
    </div>
  </header>

  <main class="game-container">
    <!-- Área de Pokémon Activo -->
    <section class="active-area">
      <h2>Pokémon Activo</h2>
      
      <div *ngIf="gameState.activePokemon; else emptyActive" 
           class="active-pokemon-container">
        <app-pokemon-card
          [pokemon]="gameState.activePokemon"
          [isActive]="true">
        </app-pokemon-card>

        <div class="action-buttons">
          <button (click)="applyDamage(20)" class="btn btn-danger">
            Aplicar 20 Daño
          </button>
          <button (click)="applyDamage(50)" class="btn btn-danger">
            Aplicar 50 Daño
          </button>
        </div>

        <div class="energy-controls">
          <h3>Agregar Energía</h3>
          <div class="energy-buttons">
            <button
              *ngFor="let energy of energyTypes"
              (click)="addEnergy(energy)"
              class="btn btn-energy"
              [disabled]="gameState.energyAttachedThisTurn">
              {{ energy }}
            </button>
          </div>
          <p *ngIf="gameState.energyAttachedThisTurn" class="info-text">
            ✓ Energía adjunta este turno
          </p>
        </div>
      </div>

      <ng-template #emptyActive>
        <div class="empty-state">
          <p>No hay Pokémon activo</p>
          <button (click)="addRandomPokemon()" class="btn btn-primary">
            Agregar Pokémon
          </button>
        </div>
      </ng-template>
    </section>

    <!-- Banco de Pokémon -->
    <section class="bench-area">
      <h2>Banco ({{ gameState.bench.length }}/5)</h2>
      
      <div *ngIf="gameState.bench.length > 0; else emptyBench" 
           class="bench-container">
        <div
          *ngFor="let pokemon of gameState.bench; let index = index"
          class="bench-pokemon"
          (click)="switchPokemon(index)">
          <app-pokemon-card [pokemon]="pokemon"></app-pokemon-card>
          <button class="switch-btn">Cambiar</button>
        </div>
      </div>

      <ng-template #emptyBench>
        <div class="empty-bench">
          <p>Banco vacío</p>
          <button
            (click)="addRandomPokemon()"
            class="btn btn-secondary">
            Agregar al Banco
          </button>
        </div>
      </ng-template>
    </section>

    <!-- Cartas de Premio -->
    <section class="prize-area">
      <h2>Cartas de Premio</h2>
      <div class="prize-display">
        <div *ngFor="let i of [].constructor(gameState.prizeCards); 
                       let idx = index"
             class="prize-card">
          <span>{{ gameState.prizeCards - idx }}</span>
        </div>
      </div>
    </section>

    <!-- Pila de Descarte -->
    <section class="discard-area">
      <h2>Descarte ({{ gameState.discardPile.length }})</h2>
      <div class="discard-display">
        <div *ngIf="gameState.discardPile.length > 0; else emptyDiscard">
          <p class="discard-count">{{ gameState.discardPile.length }} cartas</p>
          <p class="last-discard">
            Última: {{ gameState.discardPile[gameState.discardPile.length - 1].name }}
          </p>
        </div>
      </div>

      <ng-template #emptyDiscard>
        <p>Pila vacía</p>
      </ng-template>
    </section>
  </main>

  <footer class="game-footer">
    <button (click)="nextPhase()" class="btn btn-primary btn-large">
      Siguiente Fase
    </button>
    <button (click)="resetGame()" class="btn btn-secondary btn-large">
      Reiniciar Juego
    </button>
  </footer>
</div>
```

```css
/* game-board.component.css */
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
  margin-bottom: 10px;
}

.empty-state,
.empty-bench {
  text-align: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
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
  padding: 5px 10px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.bench-pokemon:hover .switch-btn {
  opacity: 1;
}

/* Premio */
.prize-area {
  background: rgba(0, 0, 0, 0.4);
  padding: 20px;
  border-radius: 10px;
}

.prize-display {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
}

.prize-card {
  aspect-ratio: 1;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border: 2px solid #cc6600;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #cc6600;
  font-size: 1.2em;
}

/* Descarte */
.discard-area {
  background: rgba(0, 0, 0, 0.4);
  padding: 20px;
  border-radius: 10px;
}

.discard-display {
  text-align: center;
}

.discard-count {
  font-size: 1.5em;
  font-weight: bold;
}

.last-discard {
  font-size: 0.9em;
  opacity: 0.8;
}

/* Botones */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  color: white;
}

.btn-primary {
  background: #4caf50;
}

.btn-primary:hover {
  background: #45a049;
}

.btn-danger {
  background: #f44336;
  width: 100%;
  text-align: left;
}

.btn-danger:hover {
  background: #da190b;
}

.btn-secondary {
  background: #2196f3;
}

.btn-secondary:hover {
  background: #0b7dda;
}

.btn-energy {
  background: rgba(255, 255, 255, 0.2);
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
  margin: 0 10px;
}

.game-footer {
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-top: 3px solid #ffd700;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.info-text {
  color: #4caf50;
  font-size: 0.9em;
  margin-top: 10px;
}
```

## 📱 Componente: BenchDisplayComponent

```typescript
// components/bench-display/bench-display.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pokemon } from 'pkm-tcg-scoreboard';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';

@Component({
  selector: 'app-bench-display',
  standalone: true,
  imports: [CommonModule, PokemonCardComponent],
  template: `
    <div class="bench-display">
      <h2>Banco ({{ bench.length }}/5)</h2>
      <div class="bench-grid">
        <div *ngFor="let pokemon of bench; let i = index"
             class="bench-slot"
             (click)="onSwitch.emit(i)">
          <app-pokemon-card [pokemon]="pokemon"></app-pokemon-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bench-display h2 {
      margin-top: 0;
    }
    .bench-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 10px;
    }
    .bench-slot {
      cursor: pointer;
      transition: transform 0.2s;
    }
    .bench-slot:hover {
      transform: scale(1.05);
    }
  `]
})
export class BenchDisplayComponent {
  @Input() bench: Pokemon[] = [];
  @Output() onSwitch = new EventEmitter<number>();
}
```

## 🚀 Configuración de la Aplicación

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)
  ]
};
```

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { GameBoardComponent } from './components/game-board/game-board.component';

export const routes: Routes = [
  {
    path: '',
    component: GameBoardComponent
  }
];
```

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

## 🎯 Mejores Prácticas

### 1. Inyección de Dependencias

```typescript
constructor(private gameService: GameStateService) {}
```

### 2. RxJS Subscriptions

```typescript
ngOnInit(): void {
  this.gameService.state$
    .pipe(
      takeUntil(this.destroy$),
      debounceTime(300)
    )
    .subscribe(state => {
      this.gameState = state;
    });
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
```

### 3. Change Detection

```typescript
@Component({
  selector: 'app-game-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
```

## 📋 Checklist de Implementación

- [ ] Instalar pkm-tcg-scoreboard
- [ ] Crear GameStateService
- [ ] Crear PokemonCardComponent
- [ ] Crear GameBoardComponent
- [ ] Configurar rutas
- [ ] Agregar estilos globales
- [ ] Implementar RxJS subscriptions
- [ ] Agregar tests con Jasmine
- [ ] Optimizar Change Detection
- [ ] Desplegar aplicación

## 🧪 Testing con Jasmine

```typescript
// game-board.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameBoardComponent } from './game-board.component';
import { GameStateService } from '../../services/game-state.service';

describe('GameBoardComponent', () => {
  let component: GameBoardComponent;
  let fixture: ComponentFixture<GameBoardComponent>;
  let gameService: GameStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameBoardComponent],
      providers: [GameStateService]
    }).compileComponents();

    fixture = TestBed.createComponent(GameBoardComponent);
    component = fixture.componentInstance;
    gameService = TestBed.inject(GameStateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add energy', (done) => {
    gameService.addEnergy('electric');
    gameService.state$.subscribe(state => {
      expect(state.energyAttachedThisTurn).toBe(true);
      done();
    });
  });
});
```

## 📚 Recursos Adicionales

- [Angular Documentation](https://angular.dev)
- [RxJS Documentation](https://rxjs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [pkm-tcg-scoreboard Docs](../README.md)

## 🔗 Angular CLI Comandos Útiles

```bash
# Crear componente
ng generate component components/pokemon-card

# Crear servicio
ng generate service services/game-state

# Ejecutar tests
ng test

# Construir para producción
ng build

# Servir en desarrollo
ng serve
```
