<script lang="ts">
    import { letters, selected, numTiles } from "../lib/store"
    import { shuffleTiles } from "../lib/util"
    import Icon from "./Icon.svelte"
    import type { BankObject } from "../lib/types"

    const handleSelect = (tile: BankObject) => {
        if (!$selected) {
            selected.set(tile)
        } else if ($selected.id === tile.id) {
            selected.set(null)
        } else {
            selected.set(tile)
        }
    }

    function shuffle() {
        letters.set(shuffleTiles())
    }
</script>

<div class="area">
    <div class="cont">
        {#each $letters as letter}
            <button
                class="tile"
                style="grid-row-start: {Math.ceil(
                    (letter.position + 1) / 5
                )}; grid-row-end: {Math.ceil(
                    (letter.position + 1) / 5 + 1
                )}; grid-column-start: {(letter.position % 5) +
                    1}; grid-column-end: {(letter.position % 5) + 2}"
                on:click={() => handleSelect(letter)}
                class:selected={$selected ? $selected.id === letter.id : false}
                >{letter.value}</button
            >
        {/each}
    </div>
    <button class="iconButton" on:click={() => shuffle()}
        ><Icon name="shuffle" /></button
    >
</div>

<style>
    .area {
        width: 100%;
        aspect-ratio: 5/3;
        background-color: #f8f5ef;
        border-top: 1px solid rgba(0, 0, 0, 0.05);
        position: relative;
    }
    .cont {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(3, 1fr);
        gap: 0.5rem;
        width: 100%;

        padding: 0.5rem;
        max-height: 17rem;
        max-width: 40rem;
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
        font-weight: 500    ;
        box-sizing: border-box;
        transition: border 0.1s;
    }
    .selected {
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
    }
</style>
