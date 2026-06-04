import { DEFEATED_POKEMON_HP_THRESHOLD, generateId } from '../../src';
import { Pokemon } from '../../src';

export const mockPokemon: Record<string, Pokemon> = {
    pikachu: {
        id: generateId(),
        name: 'Pikachu',
        hp: 60,
        type: 'Electric',
        stage: 'Basic',
    },
    bulbasaur: {
        id: generateId(),
        name: 'Bulbasaur',
        hp: 70,
        type: 'Grass',
        stage: 'Basic',
    },
    charmander: {
        id: generateId(),
        name: 'Charmander',
        hp: 80,
        type: 'Fire',
        stage: 'Basic',
    },
    charmeleon: {
        id: generateId(),
        name: 'Charmeleon',
        hp: 90,
        type: 'Fire',
        stage: 'Stage 1',
    },

    squirtle: {
        id: generateId(),
        name: 'Squirtle',
        hp: 50,
        type: 'Water',
        stage: 'Basic',
    },
    jigglypuff: {
        id: generateId(),
        name: 'Jigglypuff',
        hp: 90,
        type: 'Normal',
        stage: 'Basic',
    },
    faintedCharmander: {
        id: generateId(),
        name: 'Charmander',
        hp: DEFEATED_POKEMON_HP_THRESHOLD,
        type: 'Fire',
        stage: 'Basic',
    },
}