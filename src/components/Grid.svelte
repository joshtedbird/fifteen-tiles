<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { tiles, selected, spaces, letters, words } from '../lib/store';
	import { cubicInOut } from 'svelte/easing';
	import { getArea, scale, genSpaces, findFirstSpace, findWords } from '../lib/util';
	import type { GridObject } from '../lib/types';

	const area = tweened([...getArea({ topLeft: { x: 0, y: 0 }, bottomRight: { x: 1, y: 1 } })], {
		easing: cubicInOut,
		duration: 800
	});

	function addTile(x: number, y: number) {
		if ($selected) {
			tiles.set([
				...$tiles,
				{
					x: x,
					y: y,
					value: $selected.value,
					id: $selected.id
				}
			]);

			//@ts-ignore
			letters.set($letters.filter((d) => d.id !== $selected.id));
			selected.set(null);

			spaces.set(genSpaces());
			words.set(findWords());
		}
	}

	function removeTile(tile: GridObject) {
		tiles.set($tiles.filter((d) => d.id !== tile.id));
		letters.set([...$letters, { id: tile.id, value: tile.value, position: findFirstSpace() }]);

		if ($tiles.length === 0) {
			spaces.set([{ x: tile.x, y: tile.y }]);
		} else {
			spaces.set(genSpaces());
		}

		words.set(findWords());
	}

	$: boundingBox = {
		topLeft: {
			x: Math.min(...$tiles.map((t) => t.x), ...$spaces.map((t) => t.x)),
			y: Math.min(...$tiles.map((t) => t.y), ...$spaces.map((t) => t.y))
		},
		bottomRight: {
			x: Math.max(...$tiles.map((t) => t.x), ...$spaces.map((t) => t.x)) + 1,
			y: Math.max(...$tiles.map((t) => t.y), ...$spaces.map((t) => t.y)) + 1
		}
	};

	$: area.set(getArea(boundingBox));
</script>

<div class="container">
	<!-- @ts-ignore -->
	<svg class="grid-canvas" viewBox={$area}>
		<defs>
			<filter id="blend">
				<feBlend in="SourceGraphic" in2="floodFill" mode="multiply" />
			</filter>
		</defs>
		<!-- WORD BARS -->
		{#each $words as word}
			<rect
				x={scale(word.x)}
				y={scale(word.y)}
				rx={2}
				height={word.dir === 'across' ? scale(1) : scale(word.value.length)}
				width={word.dir === 'down' ? scale(1) : scale(word.value.length)}
				fill={word.isWord ? '#A7D4AA' : '#ece8e0'}
			/>
		{/each}
		<!-- TILES -->
		{#each $tiles as tile}
			<rect
				x={scale(tile.x + 0.05)}
				y={scale(tile.y + 0.05)}
				height={scale(0.9)}
				width={scale(0.9)}
				rx={1.5}
				fill="rgba(255, 255, 255, 1)"
				on:dblclick={() => removeTile(tile)}
			/>
			<text
				x={scale(tile.x + 0.5)}
				y={scale(tile.y + 0.64)}
				pointer-events="none"
				font-size="4"
				font-weight="500"
				text-anchor="middle">{tile.value ? tile.value : ''}</text
			>
		{/each}
		{#if $selected || $tiles.length === 0}
			{#each $spaces as space}
				<rect
					x={scale(space.x + 0.1)}
					y={scale(space.y + 0.1)}
					height={scale(0.8)}
					width={scale(0.8)}
					rx={1.5}
					fill="#ece8e0"
					on:click={() => addTile(space.x, space.y)}
				/>
			{/each}
		{/if}
	</svg>
</div>

<style>
	.container {
		position: relative;
		overflow: hidden;
		flex: auto;
	}
	.grid-canvas {
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: absolute;
		top: 0;
		left: 0;
	}
	.blend {
		mix-blend-mode: soft-light;
	}
</style>
