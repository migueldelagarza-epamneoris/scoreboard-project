import { DEFEATED_POKEMON_HP_THRESHOLD } from '../src/constants/validation.const';

export const mockPokemon = {
    pikachu: {
        id: '0025',
        name: 'Pikachu',
        hp: 60,
        type: 'Electric',
        energies: [],
    },
    bulbasaur: {
        id: '0001',
        name: 'Bulbasaur',
        hp: 70,
        type: 'Grass',
    },
    charmander: {
        id: '0004',
        name: 'Charmander',
        hp: 80,
        type: 'Fire',
    },
    squirtle: {
        id: '0007',
        name: 'Squirtle',
        hp: 50,
        type: 'Water',
    },
    jigglypuff: {
        id: '0039',
        name: 'Jigglypuff',
        hp: 90,
        type: 'Normal',
    },
    faintedCharmander: {
        id: '0004',
        name: 'Charmander',
        hp: DEFEATED_POKEMON_HP_THRESHOLD,
        type: 'Fire',
    },
}