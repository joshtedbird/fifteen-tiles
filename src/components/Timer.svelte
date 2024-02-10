<script lang="ts">
	import { time, paused, solved } from '../lib/store';
	import Icon from './Icon.svelte';
	import { formatTime } from '../lib/util';

	export let isLandscape: boolean;

	let interval: ReturnType<typeof setInterval>;

	const startInterval = () => {
		clearInterval(interval);
		interval = setInterval(() => {
			if (!$paused && !$solved) {
				time.set($time + 1);
			}
		}, 1000);
	};

	startInterval();

	function handleClick() {
		if ($paused) {
			startInterval();
			paused.set(false);
		} else {
			clearInterval(interval);
			paused.set(true);
		}
	}
</script>

<div class="cont">
	<span>
		{formatTime($time)}
	</span>
	<button on:click={() => handleClick()} class:button-landscape={isLandscape}>
		{#if $paused}
			<Icon height={'100%'} width={'100%'} name={'play'} />
		{:else}
			<Icon height={'100%'} width={'100%'} name={'pause'} />
		{/if}
	</button>
</div>

<style>
	.cont {
		display: flex;
		height: 100%;
		color: rgba(0, 0, 0, 0.5);
		align-items: center;
		position: relative;
		z-index: 30;
	}
	span {
		user-select: none;
		min-width: 3rem;
		text-align: end;
		font-size: 1.25rem;
	}
	button {
		all: unset;

		position: absolute;
		right: -2.5rem;
		aspect-ratio: 1/1;
		height: 100%;
		transition: color 0.2s;
		touch-action: manipulation;
	}
	.button-landscape:hover {
		color: rgba(0, 0, 0, 0.7);
	}
</style>
