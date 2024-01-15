import type { BankObject, BoundingBox, Coord, Corner, GridObject, Word } from './types';
import { get } from 'svelte/store';
import { tiles, letters, numTiles, spaces, words } from './store';
import { letterDist } from './data';
import dictionary from './dictionary.json';

const GRID_SIZE = 10;
export const scale = (n: number) => n * GRID_SIZE;

export function getArea(bbox: BoundingBox, size: number) {
	let left = 0;
	let top = 0;

	let width = bbox.bottomRight.x - bbox.topLeft.x;
	let height = bbox.bottomRight.y - bbox.topLeft.y;

	if (width < size) {
		left = bbox.topLeft.x - (size - width) / 2;
		width = size;
	} else {
		left = bbox.topLeft.x;
	}

	if (height < size) {
		top = bbox.topLeft.y - (size - height) / 2;
		height = size;
	} else {
		top = bbox.topLeft.y;
	}

	return [left, top, width, height].map((d) => scale(d));
}

function checkForTile(x: number, y: number, spaces: Coord[]) {
	return (
		get(tiles).filter((d) => d.x === x && d.y === y).length +
		spaces.filter((d) => d.x === x && d.y === y).length
	);
}

function getTile(x: number, y: number) {
	return get(tiles).filter((d) => d.x === x && d.y === y);
}

export function genSpaces() {
	let output: Coord[] = [];
	const gridTiles = get(tiles);

	for (let i = 0; i < gridTiles.length; i++) {
		let coords = { x: gridTiles[i].x, y: gridTiles[i].y };

		//LEFT
		if (!checkForTile(coords.x - 1, coords.y, output)) {
			output.push({ x: coords.x - 1, y: coords.y });
		}
		//RIGHT
		if (!checkForTile(coords.x + 1, coords.y, output)) {
			output.push({ x: coords.x + 1, y: coords.y });
		}
		//TOP
		if (!checkForTile(coords.x, coords.y - 1, output)) {
			output.push({ x: coords.x, y: coords.y - 1 });
		}
		//BOTTOM
		if (!checkForTile(coords.x, coords.y + 1, output)) {
			output.push({ x: coords.x, y: coords.y + 1 });
		}
	}

	return output;
}

function findWordTiles() {
	const checkWords = get(words);
	console.log('words list: ', checkWords);
	let output: Coord[] = [];

	checkWords.forEach((word) => {
		if (word.isWord) {
			for (let i = 0; i < word.value.length; i++) {
				output.push(
					word.dir === 'across' ? { x: word.x + i, y: word.y } : { x: word.x, y: word.y + i }
				);
			}
		}
	});

	return output;
}

function checkNeighbour(x: number, y: number, wordTiles: Coord[]) {
	return wordTiles.filter((d) => d.x === x && d.y === y).length;
}

export function genCorners() {
	const checkSpaces = get(spaces);

	const wordTiles: Coord[] = findWordTiles();

	console.log(wordTiles);

	let output: Corner[] = [];

	checkSpaces.forEach((d) => {
		//NW
		if (
			checkNeighbour(d.x - 1, d.y, wordTiles) &&
			checkNeighbour(d.x - 1, d.y - 1, wordTiles) &&
			checkNeighbour(d.x, d.y - 1, wordTiles)
		) {
			output.push({ ...d, dir: 'nw' });
		}

		//NE
		if (
			checkNeighbour(d.x + 1, d.y, wordTiles) &&
			checkNeighbour(d.x + 1, d.y - 1, wordTiles) &&
			checkNeighbour(d.x, d.y - 1, wordTiles)
		) {
			output.push({ ...d, dir: 'ne' });
		}
		//SE
		if (
			checkNeighbour(d.x + 1, d.y, wordTiles) &&
			checkNeighbour(d.x + 1, d.y + 1, wordTiles) &&
			checkNeighbour(d.x, d.y + 1, wordTiles)
		) {
			output.push({ ...d, dir: 'se' });
		}

		//SW
		if (
			checkNeighbour(d.x - 1, d.y, wordTiles) &&
			checkNeighbour(d.x - 1, d.y + 1, wordTiles) &&
			checkNeighbour(d.x, d.y + 1, wordTiles)
		) {
			output.push({ ...d, dir: 'sw' });
		}
	});

	return output;
}

export function genLetters(n: number) {
	let letterBag = [...letterDist];
	let letters: string[] = [];
	let output: BankObject[] = [];

	for (let i = 0; i < n; i++) {
		//Randomly pull a letter from the bag

		let index = Math.floor(Math.random() * letterBag.length);

		// console.log('LETTER: ', letterBag[index]);

		//Check for Q
		if (letterBag[index] === 'Q') {
			//Check if a U already has been added
			if (letters.filter((d) => d === 'U').length === 0) {
				//Check if this is the last tile pulled
				if (i !== n - 1) {
					letters.push(letterBag[index], 'U');
					//Remove said letter from the bag
					letterBag.splice(index, 1);

					//Find a U to remove
					letterBag.splice(letterBag.indexOf('U'), 1);
					i++;
				} else {
					// console.log('skipped because last');
					i--;
				}
			} else {
				// console.log('Q added with prior U existing');
				letters.push(letterBag[index]);
				//Remove said letter from the bag
				letterBag.splice(index, 1);
			}
		} else {
			letters.push(letterBag[index]);
			//Remove said letter from the bag
			letterBag.splice(index, 1);
		}
		// console.log('REMAINING: ', letterBag);
	}

	letters.sort();
	output = letters.map((l, i) => ({ value: l, id: i, position: i }));

	return output;
}

export function shuffleTiles() {
	let currentLetters = get(letters);
	let m = currentLetters.length,
		t,
		i;

	while (m) {
		i = Math.floor(Math.random() * m--);

		t = currentLetters[m];
		currentLetters[m] = currentLetters[i];
		currentLetters[i] = t;
	}

	for (let i = 0; i < currentLetters.length; i++) {
		currentLetters[i].position = i;
	}

	return currentLetters;
}

export function findFirstSpace() {
	let min = 0;
	let l = get(letters);

	for (let i = 0; i < numTiles; i++) {
		if (!l.filter((d) => d.position === i).length) {
			min = i;
			break;
		}
	}

	return min;
}

export function findWords() {
	let words: Word[] = [];
	//Start by finding each tile that is the start of a word
	get(tiles).forEach((t) => {
		//ACROSS
		if (!getTile(t.x - 1, t.y).length && getTile(t.x + 1, t.y).length) {
			let string = t.value;
			let searching = true;

			while (searching) {
				let pos = t.x + string.length;
				let checkTile = getTile(pos, t.y)[0];

				if (checkTile) {
					string += checkTile.value;
				} else {
					searching = false;
				}
			}

			words.push({
				value: string,
				x: t.x,
				y: t.y,
				isWord: dictionary.includes(string),
				dir: 'across'
			});
		}
		//DOWN
		if (!getTile(t.x, t.y - 1).length && getTile(t.x, t.y + 1).length) {
			let string = t.value;
			let searching = true;

			while (searching) {
				let pos = t.y + string.length;
				let checkTile = getTile(t.x, pos)[0];

				if (checkTile) {
					string += checkTile.value;
				} else {
					searching = false;
				}
			}

			words.push({
				value: string,
				x: t.x,
				y: t.y,
				isWord: dictionary.includes(string),
				dir: 'down'
			});
		}
	});

	words.sort(function (x, y) {
		// true values first
		return x.isWord === y.isWord ? 0 : x.isWord ? -1 : 1;
		// false values first
		// return (x === y)? 0 : x? 1 : -1;
	});

	return words;
}
