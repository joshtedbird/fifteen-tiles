<script lang="ts">
	import Timer from './Timer.svelte';

	export let isLandscape: boolean;
</script>

<div class="container"><Timer {isLandscape} /></div>

<style>
	.container {
		width: 100%;
		height: 3rem;
		display: flex;
		padding: 0.5rem 2rem;

		justify-content: center;
	}
</style>
