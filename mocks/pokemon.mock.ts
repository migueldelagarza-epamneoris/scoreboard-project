import { DEFEATED_POKEMON_HP_THRESHOLD } from '../src';
import { Pokemon } from '../src';

export const mockPokemon: Record<string, Pokemon> = {
    pikachu: {
        id: '0025',
        name: 'Pikachu',
        hp: 60,
        type: 'Electric',
        stage: 'Basic',
    },
    bulbasaur: {
        id: '0001',
        name: 'Bulbasaur',
        hp: 70,
        type: 'Grass',
        stage: 'Basic',
    },
    charmander: {
        id: '0004',
        name: 'Charmander',
        hp: 80,
        type: 'Fire',
        stage: 'Basic',
    },
    charmeleon: {
        id: '0005',
        name: 'Charmeleon',
        hp: 90,
        type: 'Fire',
        stage: 'Stage 1',
    },

    squirtle: {
        id: '0007',
        name: 'Squirtle',
        hp: 50,
        type: 'Water',
        stage: 'Basic',
    },
    jigglypuff: {
        id: '0039',
        name: 'Jigglypuff',
        hp: 90,
        type: 'Normal',
        stage: 'Basic',
    },
    faintedCharmander: {
        id: '0004',
        name: 'Charmander',
        hp: DEFEATED_POKEMON_HP_THRESHOLD,
        type: 'Fire',
        stage: 'Basic',
    },
}