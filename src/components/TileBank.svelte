<script lang="ts">
	import { letters, selected, solved } from '../lib/store';
	import { checkCompletion, shuffleTiles } from '../lib/util';
	import Icon from './Icon.svelte';
	import type { BankObject } from '../lib/types';

	export let isLandscape: boolean;

	const handleSelect = (tile: BankObject) => {
		if (!$selected) {
			selected.set(tile);
		} else if ($selected.id === tile.id) {
			selected.set(null);
		} else {
			selected.set(tile);
		}
	};

	function shuffle() {
		letters.set(shuffleTiles());
	}

	let isSolved = false;

	$: if (!$letters.length) {
		isSolved = checkCompletion();
	} else {
		isSolved = false;
	}

	const submit = () => {
		if (isSolved) {
			solved.set(true);
		}
	};
</script>

<div class="cont" class:cont-landscape={isLandscape}>
	{#each $letters as letter}
		<button
			class="tile"
			style="grid-row-start: {Math.ceil((letter.position + 1) / 5)}; grid-row-end: {Math.ceil(
				(letter.position + 1) / 5 + 1
			)}; grid-column-start: {(letter.position % 5) + 1}; grid-column-end: {(letter.position % 5) +
				2}"
			on:click={() => handleSelect(letter)}
			class:selected={$selected ? $selected.id === letter.id : false}
			class:tile-landscape={isLandscape}><span class="unselectable">{letter.value}</span></button
		>
	{/each}
	{#if $letters.length}
		<button class="iconButton" class:iconButton-landscape={isLandscape} on:click={() => shuffle()}
			><Icon name="shuffle" /></button
		>
	{/if}
	{#if isSolved}
		<button class="tile submitButton" on:click={() => submit()}>submit</button>
	{/if}
</div>

<style>
	.cont {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-template-rows: repeat(3, 1fr);
		gap: 0.5rem;
		width: 100%;
		height: 100%;
		position: relative;
		background-color: #f8f5ef;

		padding: 0.5rem;
	}
	.cont-landscape {
		width: 24rem;
		aspect-ratio: 5/3;
		border-radius: 1.2rem;
	}
	.tile {
		all: unset;
		width: 100%;
		aspect-ratio: 1/1;
		border-radius: 0.75rem;
		background-color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 25px;
		font-weight: 500;
		box-sizing: border-box;
		transition: border 0.15s;
		cursor: pointer;
		overflow: hidden;
		border-color: rgba(0, 0, 0, 0);
		touch-action: manipulation;
	}
	.tile-landscape:hover {
		border: 3px solid #ddd;
	}
	.unselectable {
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	.selected,
	.selected:hover {
		border: 4px solid #e38156;
	}

	.iconButton {
		all: unset;
		height: 2rem;
		width: 2rem;
		padding: 0.5rem;
		opacity: 0.3;
		border-radius: 0.5rem;

		position: absolute;
		top: -3.5rem;
		right: 1rem;

		display: flex;
		align-items: center;
		justify-content: center;

		cursor: pointer;
	}
	.iconButton-landscape:hover {
		opacity: 0.6;
	}
	.iconButton-landscape {
		top: 1rem;
		right: -3.5rem;
		transition: opacity 0.2s;
	}
	.submitButton {
		grid-row: 2;
		grid-column-start: 2;
		grid-column-end: 5;

		background-color: #a7d4aa;
		aspect-ratio: auto;

		color: white;
		font-size: 1.25rem;
		font-weight: 400;
	}
</style>
