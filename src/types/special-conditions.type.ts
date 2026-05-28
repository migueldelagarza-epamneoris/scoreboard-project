export type SpecialCondition = 
  | 'Asleep'    // Dormido: Impide atacar y retirar [4]
  | 'Paralyzed' // Paralizado: Impide atacar y retirar [5]
  | 'Confused'   // Confundido: Requiere lanzar moneda para atacar [7]
  | 'Burned'     // Quemado: Aplica daño entre turnos [4]
  | 'Poisoned';  // Envenenado: Aplica daño entre turnos [5]
