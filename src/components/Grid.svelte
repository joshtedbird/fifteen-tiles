<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import { tiles, selected, spaces, letters, words, corners } from '../lib/store';
	import { cubicInOut } from 'svelte/easing';
	import { getArea, scale, genSpaces, findFirstSpace, findWords, genCorners } from '../lib/util';
	import type { GridObject } from '../lib/types';

	export let isLandscape: boolean;

	const area = tweened(
		[...getArea({ topLeft: { x: 0, y: 0 }, bottomRight: { x: 1, y: 1 } }, isLandscape ? 9 : 5)],
		{
			easing: cubicInOut,
			duration: 800
		}
	);

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
			corners.set(genCorners());
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

		corners.set(genCorners());
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

	$: area.set(getArea(boundingBox, isLandscape ? 9 : 5));
</script>

<div class="container">
	<!-- @ts-ignore -->
	<svg class="grid-canvas" viewBox={`${$area[0]} ${$area[1]} ${$area[2]} ${$area[3]}`}>
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
				class={isLandscape ? 'tile' : ''}
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
				class="text"
				font-size="4"
				font-weight="500"
				text-anchor="middle">{tile.value ? tile.value : ''}</text
			>
		{/each}
		{#if $selected}
			<g transition:fade={{ duration: 100 }}>
				{#each $spaces as space}
					<rect
						class={isLandscape ? 'space' : ''}
						x={scale(space.x + 0.1)}
						y={scale(space.y + 0.1)}
						height={scale(0.8)}
						width={scale(0.8)}
						rx={1.5}
						fill="#ece8e0"
						on:click={() => addTile(space.x, space.y)}
					/>
				{/each}
			</g>
		{/if}

		<!-- INSIDE CORNERS -->
		{#each $corners as corner}
			<svg
				x={corner.dir === 'nw' || corner.dir === 'sw'
					? scale(corner.x - 0.004)
					: scale(corner.x + 0.806)}
				y={corner.dir === 'nw' || corner.dir === 'ne'
					? scale(corner.y - 0.004)
					: scale(corner.y + 0.806)}
				width={2}
				height={2}
				viewBox="0 0 15 15"
			>
				<g
					transform={`rotate(${
						corner.dir === 'nw' ? 180 : corner.dir === 'ne' ? -90 : corner.dir === 'sw' ? 90 : 0
					} 7.5 7.5)`}
				>
					<path d="M0 15C8.28427 15 15 8.28427 15 0V15H0Z" fill="#A7D4AA" />
				</g>
			</svg>
		{/each}
	</svg>
</div>

<style>
	.container {
		position: relative;
		overflow: hidden;
		flex: auto;
	}
	.tile {
		cursor: pointer;
		stroke-width: 0;
		transition: stroke-width 0.2s;
	}
	.tile:hover {
		stroke: #ddd;
		stroke-width: 0.4px;
	}
	.space {
		transition: fill 0.2s;
		cursor: pointer;
	}
	.space:hover {
		fill: #e2ddd6;
	}
	.grid-canvas {
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: absolute;
		top: 0;
		left: 0;
	}
	.text {
		pointer-events: none;
		user-select: none;
	}
</style>
