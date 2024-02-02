<script lang="ts">
	import Grid from '../components/Grid.svelte';
	import TileBank from '../components/TileBank.svelte';
	import '@fontsource/dm-mono/400.css';
	import '@fontsource/dm-mono/500.css';
	import UtilBar from '../components/UtilBar.svelte';
	import { paused, solved } from '$lib/store';
	import { fade } from 'svelte/transition';
	import EndScreen from '../components/EndScreen.svelte';

	$: innerHeight = 0;
	$: innerWidth = 0;

	$: isLandscape = innerWidth > 645;
</script>

<svelte:window bind:innerHeight bind:innerWidth />

<main>
	<div class="wrapper" style="--innerHeight:{innerHeight}">
		{#if !$solved}
			<UtilBar {isLandscape} />
		{/if}

		<Grid {isLandscape} />

		<div class="ui" class:ui-landscape={isLandscape}>
			{#if !$solved}
				<TileBank {isLandscape} />
			{:else}
				<EndScreen {isLandscape} />
			{/if}
		</div>
		{#if $paused}
			<div transition:fade={{ duration: 100 }} class="overlay">paused</div>
		{/if}
	</div>
</main>

<style>
	.wrapper {
		width: 100vw;
		height: calc(var(--innerHeight) * 1px);
		background-color: #f4f0e6;
		display: flex;
		flex-direction: column;
		font-family: 'DM Mono', monospace;
		position: relative;
	}
	.overlay {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background-color: #f4f0e6bb;
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		z-index: 20;

		display: flex;
		align-items: center;
		justify-content: center;

		color: #888;
		font-size: 1.4rem;
	}
	.ui {
		width: 100%;
		aspect-ratio: 5/3;

		border-top: 1px solid rgba(0, 0, 0, 0.05);
		position: relative;
	}
	.ui-landscape {
		aspect-ratio: auto;
		border: none;
		margin-bottom: 8rem;
		display: flex;
		justify-content: center;
	}
</style>
