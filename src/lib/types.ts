export type Coord = { x: number; y: number };

export type GridObject = Coord & {
	id: number;
	value: string;
};

export type BankObject = {
	id: number;
	value: string;
	position: number;
};

export type BoundingBox = {
	topLeft: Coord;
	bottomRight: Coord;
};

export type Word = Coord & {
	value: string;

	dir: 'across' | 'down';
	isWord: boolean;
};

// export type Word = GridObject & { dir: "across" | "down" }
