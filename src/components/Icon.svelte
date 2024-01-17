<script lang="ts">
	export let name: keyof typeof icons;
	export let width = '2rem';
	export let height = '2rem';
	export let focusable: string | number | null | undefined = undefined;
	let icons = {
		shuffle: {
			box: 48,
			svg: `
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M22.9599 10.9936C15.8033 11.5684 10.4677 17.836 11.0425 24.9927C11.3626 28.9781 13.4485 32.4012 16.4736 34.5518L15.7392 30.2878L19.6811 29.6088L21.4257 39.7378L10.568 41.8009L9.8213 37.8712L13.3493 37.2008C9.83574 34.3753 7.44509 30.1652 7.05534 25.3129C6.30363 15.9542 13.281 7.75812 22.6397 7.00641L22.9599 10.9936Z" fill="currentColor"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M24.9944 36.8425C32.1511 36.2677 37.4867 30 36.9118 22.8434C36.5917 18.858 34.5058 15.4349 31.4807 13.2843L32.2152 17.5483L28.2732 18.2272L26.5286 8.09824L37.3864 6.03518L38.1331 9.96487L34.605 10.6352C38.1186 13.4608 40.5093 17.6708 40.899 22.5231C41.6507 31.8818 34.6734 40.0779 25.3147 40.8297L24.9944 36.8425Z" fill="currentColor"/>
                `
		},
		pause: {
			box: 48,
			svg: `<rect x="12" y="9" width="9" height="30" rx="1" fill="currentColor"/>
                    <rect x="27" y="9" width="9" height="30" rx="1" fill="currentColor"/>`
		},
		play: {
			box: 48,
			svg: `<path d="M12 10.6995C12 9.93703 12.8191 9.45506 13.4856 9.82536L37.4265 23.1258C38.1123 23.5068 38.1123 24.4932 37.4265 24.8742L13.4856 38.1746C12.8191 38.5449 12 38.063 12 37.3005V10.6995Z" fill="currentColor"/>`
		}
	} as const;
	let displayIcon = icons[name];
</script>

<svg
	class={$$props.class}
	{focusable}
	{width}
	{height}
	viewBox="0 0 {displayIcon.box} {displayIcon.box}">{@html displayIcon.svg}</svg
>
