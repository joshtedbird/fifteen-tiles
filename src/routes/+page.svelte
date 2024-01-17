<script lang="ts">
	import Grid from '../components/Grid.svelte';
	import TileBank from '../components/TileBank.svelte';
	import '@fontsource/dm-mono/400.css';
	import '@fontsource/dm-mono/500.css';
	import UtilBar from '../components/UtilBar.svelte';

	$: innerHeight = 0;
	$: innerWidth = 0;

	$: isLandscape = innerWidth > 645;
</script>

<svelte:window bind:innerHeight bind:innerWidth />

<main>
	<div class="wrapper" style="--innerHeight:{innerHeight}">
		<UtilBar {isLandscape} />
		<Grid {isLandscape} />
		<TileBank {isLandscape} />
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
	}
</style>
