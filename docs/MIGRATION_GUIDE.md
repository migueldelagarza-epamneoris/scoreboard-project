# Guía de Migración de React a Angular (y viceversa)

## 📋 Tabla de Compatibilidad

### Conceptos Equivalentes

| Concepto | React | Angular |
|----------|-------|---------|
| **Estado Reactivo** | `useState` | `BehaviorSubject` / Signal |
| **Efectos** | `useEffect` | `ngOnInit` / `effect` |
| **Componente** | Función | Class / Standalone |
| **Props** | Parámetros | `@Input()` |
| **Eventos** | Callback functions | `@Output() EventEmitter` |
| **Context** | Context API | Services + DI |
| **Listados** | `.map()` | `*ngFor` |
| **Condicionales** | `&&`, ternario | `*ngIf` |
| **Estilos** | CSS Modules, CSS-in-JS | `[ngClass]`, `[ngStyle]` |
| **Observables** | No nativo | RxJS |
| **Formularios** | React Hook Form | Reactive Forms / Template Forms |

## 🔄 Migración de React a Angular

### 1. Hook `useGameState` → Service `GameStateService`

#### React (Hook)
```typescript
const { state, addEnergy, applyDamage } = useGameState();
```

#### Angular (Service)
```typescript
constructor(private gameService: GameStateService) {
  this.state$ = gameService.state$;
}

addEnergy(energy: EnergyType) {
  this.gameService.addEnergy(energy);
}
```

### 2. Componente Funcional React → Componente Angular

#### React
```typescript
export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  isActive = false,
  onClick
}) => {
  return (
    <div className={`card ${isActive ? 'active' : ''}`}>
      <h3>{pokemon.name}</h3>
      <button onClick={onClick}>Seleccionar</button>
    </div>
  );
};
```

#### Angular
```typescript
@Component({
  selector: 'app-pokemon-card',
  template: `...`,
  styles: [`...`]
})
export class PokemonCardComponent {
  @Input() pokemon!: Pokemon;
  @Input() isActive: boolean = false;
  @Output() onClick = new EventEmitter<void>();

  handleClick() {
    this.onClick.emit();
  }
}
```

### 3. useState → BehaviorSubject / Signal

#### React
```typescript
const [gameState, setGameState] = useState<GameState>(initialState);
```

#### Angular
```typescript
private stateSubject = new BehaviorSubject<GameState>(initialState);
public state$ = this.stateSubject.asObservable();

// O con Signals (Angular 16+)
state = signal<GameState>(initialState);
```

### 4. Array Map → ngFor

#### React
```typescript
{pokemon.energy.map((energy, index) => (
  <span key={index} className={`energy ${energy}`}>
    {energy}
  </span>
))}
```

#### Angular
```html
<span *ngFor="let energy of pokemon.energy; let i = index"
      class="energy" [ngClass]="energy">
  {{ energy }}
</span>
```

### 5. Condicional Ternario → *ngIf

#### React
```typescript
{isActive ? (
  <div className="active-badge">Activo</div>
) : (
  <div className="inactive">Inactivo</div>
)}
```

#### Angular
```html
<div *ngIf="isActive" class="active-badge">
  Activo
</div>
<div *ngIf="!isActive" class="inactive">
  Inactivo
</div>

<!-- O con else -->
<div *ngIf="isActive; else inactive" class="active-badge">
  Activo
</div>
<ng-template #inactive>
  <div class="inactive">Inactivo</div>
</ng-template>
```

### 6. Props Destructuring → @Input

#### React
```typescript
const PokemonCard: React.FC<{ pokemon: Pokemon; onClick?: () => void }> = ({
  pokemon,
  onClick
}) => {
  // ...
};
```

#### Angular
```typescript
@Component({...})
export class PokemonCardComponent {
  @Input() pokemon!: Pokemon;
  @Input() onClick?: () => void;
}
```

### 7. Callbacks → @Output EventEmitter

#### React
```typescript
interface Props {
  onSwitch: (index: number) => void;
}

<button onClick={() => onSwitch(0)}>Switch</button>
```

#### Angular
```typescript
@Output() onSwitch = new EventEmitter<number>();

switchPokemon(index: number) {
  this.onSwitch.emit(index);
}

// En template
<button (click)="switchPokemon(0)">Switch</button>
```

## 🔄 Migración de Angular a React

### 1. Service + RxJS → Hook Personalizado

#### Angular
```typescript
@Injectable({ providedIn: 'root' })
export class GameStateService {
  private stateSubject = new BehaviorSubject<GameState>(initialState);
  state$ = this.stateSubject.asObservable();

  addEnergy(energy: EnergyType) {
    const newState = AddEnergy(this.stateSubject.value, energy);
    this.stateSubject.next(newState);
  }
}
```

#### React
```typescript
export function useGameState() {
  const [state, setState] = useState<GameState>(initialState);

  const addEnergy = useCallback((energy: EnergyType) => {
    setState(prev => AddEnergy(prev, energy));
  }, []);

  return { state, addEnergy };
}
```

### 2. @Input/@Output → Props y Callbacks

#### Angular
```typescript
@Component({...})
export class PokemonCardComponent {
  @Input() pokemon!: Pokemon;
  @Output() onClick = new EventEmitter<void>();
}
```

#### React
```typescript
interface PokemonCardProps {
  pokemon: Pokemon;
  onClick?: () => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  onClick
}) => {
  // ...
};
```

### 3. *ngIf → Operadores Lógicos / Ternarios

#### Angular
```html
<div *ngIf="state.activePokemon">
  <p>{{ state.activePokemon.name }}</p>
</div>
```

#### React
```typescript
{state.activePokemon && (
  <div>
    <p>{state.activePokemon.name}</p>
  </div>
)}
```

### 4. *ngFor → Array.map()

#### Angular
```html
<div *ngFor="let pokemon of bench">
  <p>{{ pokemon.name }}</p>
</div>
```

#### React
```typescript
{bench.map(pokemon => (
  <div key={pokemon.id}>
    <p>{pokemon.name}</p>
  </div>
))}
```

### 5. [property] → className Dinámico

#### Angular
```html
<div [class.active]="isActive" [ngClass]="type.toLowerCase()">
  Active
</div>
```

#### React
```typescript
<div className={`card ${isActive ? 'active' : ''} ${type.toLowerCase()}`}>
  Active
</div>

// O con librería classnames
<div className={classNames('card', { active: isActive }, type.toLowerCase())}>
  Active
</div>
```

### 6. (click) → onClick Handler

#### Angular
```html
<button (click)="addEnergy('electric')">
  Agregar Energía
</button>
```

#### React
```typescript
<button onClick={() => addEnergy('electric')}>
  Agregar Energía
</button>
```

### 7. takeUntil + ngOnDestroy → useEffect Cleanup

#### Angular
```typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  this.gameService.state$
    .pipe(takeUntil(this.destroy$))
    .subscribe(state => this.state = state);
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

#### React
```typescript
useEffect(() => {
  const subscription = gameService.state$.subscribe(state => {
    setState(state);
  });

  return () => subscription.unsubscribe();
}, []);
```

## 🎯 Patrones Comunes

### Manejo de Errores

#### React
```typescript
const [error, setError] = useState<string | null>(null);

try {
  setActivePokemon(pokemon);
  setError(null);
} catch (err) {
  setError(err instanceof Error ? err.message : 'Error');
}
```

#### Angular
```typescript
private errorSubject = new BehaviorSubject<string | null>(null);
error$ = this.errorSubject.asObservable();

setActivePokemon(pokemon: Pokemon) {
  try {
    // ...
    this.errorSubject.next(null);
  } catch (error) {
    this.errorSubject.next(error instanceof Error ? error.message : 'Error');
  }
}
```

### Validaciones

#### React
```typescript
const canAddEnergy = useCallback(() => {
  return !state.energyAttachedThisTurn && !!state.activePokemon;
}, [state]);
```

#### Angular
```typescript
canAddEnergy(): boolean {
  const state = this.currentState;
  return !state.energyAttachedThisTurn && !!state.activePokemon;
}
```

## 📊 Comparación de Performance

| Aspecto | React | Angular |
|---------|-------|---------|
| **Tamaño Bundle** | Menor | Mayor |
| **Learning Curve** | Medio | Más pronunciada |
| **Render** | Virtual DOM | Zone.js |
| **Change Detection** | Automático | Manual/Automático |
| **TypeScript** | Opcional | Estándar |

## ✅ Checklist de Migración

### React → Angular
- [ ] Crear servicio para lógica de estado
- [ ] Convertir hooks en observables (RxJS)
- [ ] Implementar componentes como clases
- [ ] Usar @Input/@Output
- [ ] Agregar dependency injection
- [ ] Implementar ngOnDestroy
- [ ] Configurar módulos/rutas
- [ ] Migrar estilos
- [ ] Testing con Jasmine

### Angular → React
- [ ] Crear hooks personalizados
- [ ] Convertir servicios en estados
- [ ] Implementar componentes como funciones
- [ ] Usar props e callbacks
- [ ] Configurar Context API si es necesario
- [ ] Implementar useEffect cleanup
- [ ] Configurar rutas con React Router
- [ ] Migrar estilos CSS
- [ ] Testing con Jest/Vitest

## 🎓 Recursos Recomendados

- [React Official Docs](https://react.dev)
- [Angular Official Docs](https://angular.dev)
- [RxJS Learning Path](https://rxjs.dev/guide/operators)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Compare React and Angular](https://www.freecodecamp.org/news/react-vs-angular/)
