<script lang="ts">
	import { formatTime } from '../lib/util';
	import { time } from '../lib/store';
	export let isLandscape: boolean;
</script>

<div class="cont" class:cont-landscape={isLandscape}>
	<div class="stat-cont">
		<div class="stat-row"><h1>{formatTime($time)}</h1></div>
		<div class="stat-row">
			<div class="stat-box">
				<h2>0:00</h2>
				best
			</div>
			<div class="stat-box">
				<h2>0:00</h2>
				avg
			</div>
		</div>
	</div>
	<button>share</button>
</div>

<style>
	.cont {
		display: flex;
		flex-direction: column;
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
	.stat-cont {
		display: flex;
		flex-direction: column;

		align-items: center;
		justify-content: space-evenly;
		margin: 0.5rem 0rem 1.2rem 0rem;
		flex: auto;
	}
	.stat-row {
		display: flex;
		flex: 1;
		width: 100%;

		align-items: center;

		justify-content: space-evenly;
	}
	.stat-box {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;

		color: rgba(0, 0, 0, 0.5);
	}
	h1 {
		font-weight: 400;
		font-size: 1.7rem;
	}
	h2 {
		font-weight: 400;
		font-size: 1.3rem;
	}
	button {
		all: unset;
		background-color: #a7d4aa;
		color: white;

		border-radius: 0.75rem;
		padding: 0.75rem;

		display: flex;
		justify-content: center;

		font-weight: 500;
		font-size: 1.1rem;
	}
</style>
