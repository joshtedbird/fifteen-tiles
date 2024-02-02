import { writable } from 'svelte/store';
import { type GridObject, type BankObject, type Coord, type Word, type Corner } from './types';
import { genLetters } from './util';
import { createRand, genSeed } from './rand';

const date = new Date().toISOString().slice(0, 10);

export const numTiles = 15;

export const tiles = writable<GridObject[]>([]);

export const letters = writable<BankObject[]>(
	genLetters(numTiles, createRand(genSeed(date.toString())))
);

export const spaces = writable<Coord[]>([{ x: 0, y: 0 }]);

export const corners = writable<Corner[]>([]);

export const selected = writable<BankObject | null>(null);

export const words = writable<Word[]>([]);

export const time = writable<number>(0);

export const paused = writable<boolean>(false);

export const solved = writable<boolean>(false);
