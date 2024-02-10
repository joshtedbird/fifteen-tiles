import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import {
	type GridObject,
	type BankObject,
	type Coord,
	type Word,
	type Corner,
	type BoundingBox
} from './types';
import { findWords, genCorners, genLetters, genSpaces } from './util';
import { createRand, genSeed } from './rand';

const loadDate = window.localStorage.getItem('date');
const currentDate = new Date().toISOString().slice(0, 10);

let date = '';

if (loadDate === currentDate) {
	date = loadDate;
} else {
	date = currentDate;
	window.localStorage.setItem('date', currentDate);

	window.localStorage.removeItem('letters');
	window.localStorage.removeItem('solved');
	window.localStorage.removeItem('time');
	window.localStorage.removeItem('boundingBox');
	window.localStorage.removeItem('tiles');
}

export const numTiles = 15;

export const spaces = writable<Coord[]>([{ x: 0, y: 0 }]);

export const corners = writable<Corner[]>([]);

export const words = writable<Word[]>([]);

//TILES STORAGE
let loadTiles = window.localStorage.getItem('tiles');
const tilesVal = browser ? (loadTiles ? JSON.parse(loadTiles) : []) : [];

export const tiles = writable<GridObject[]>(tilesVal);

tiles.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('tiles', JSON.stringify(value));
	}
	if (value.length > 0) {
		spaces.set(genSpaces());
	}
	words.set(findWords());
	corners.set(genCorners());
});

//LETTERS STORAGE
let defaultLetters = genLetters(numTiles, createRand(genSeed(date.toString())));
let loadLetters = window.localStorage.getItem('letters');
const lettersVal = browser
	? loadLetters
		? JSON.parse(loadLetters)
		: defaultLetters
	: defaultLetters;

export const letters = writable<BankObject[]>(lettersVal);

letters.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('letters', JSON.stringify(value));
	}
});

//TIME STORAGE
let loadTime = window.localStorage.getItem('time');
const timeVal = browser ? loadTime ?? 0 : 0;

export const time = writable<number>(Number(timeVal));

time.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('time', value.toString());
	}
});

export const selected = writable<BankObject | null>(null);

export const paused = writable<boolean>(false);

let defaultTimes: number[] = [];

let loadTimes = window.localStorage.getItem('times');
let timesVal: number[] = browser
	? loadTimes
		? JSON.parse(loadTimes)
		: defaultTimes
	: defaultTimes;

export const times = writable<number[]>(timesVal);

times.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('times', JSON.stringify(value));
	}
});

//SOLVED STORAGE

let loadSolved = window.localStorage.getItem('solved');
const solvedVal = browser ? (loadSolved ? JSON.parse(loadSolved) : false) : false;

export const solved = writable<boolean>(solvedVal);

solved.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('solved', JSON.stringify(value));
	}
});

//BOUNDING BOX STORAGE
let defaultBounds = { topLeft: { x: 0, y: 0 }, bottomRight: { x: 1, y: 1 } };
let loadBounds = window.localStorage.getItem('boundingBox');
const boundsVal: BoundingBox = browser
	? loadBounds
		? JSON.parse(loadBounds)
		: defaultBounds
	: defaultBounds;

console.log('BOUNDS ARE: ', boundsVal);

export const boundingBox = writable<BoundingBox>(boundsVal);

boundingBox.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('boundingBox', JSON.stringify(value));
	}
});
