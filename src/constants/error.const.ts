export const ERROR_MESSAGES = {
  INVALID_POKEMON: 'El objeto proporcionado no es un Pokémon válido.',
  DEFEATED_POKEMON: 'No se puede usar un Pokémon que está derrotado (0 HP o menos).',
  ACTIVE_POKEMON_EXISTS: 'Ya existe un Pokémon Activo. No se puede asignar otro.',
  NO_ACTIVE_POKEMON: 'No hay un Pokémon Activo.',
  BENCH_FULL: 'No se puede agregar más Pokémon al Banco. El Banco ya tiene 5 Pokémon.',
  ENERGY_ALREADY_ATTACHED: 'Ya se ha adjuntado una Energía en este turno.',
  NOT_BASIC_POKEMON: 'Solo se puede asignar un Pokémon Básico.',
  INVALID_DAMAGE: 'El daño debe ser un número positivo.',
} as const;
