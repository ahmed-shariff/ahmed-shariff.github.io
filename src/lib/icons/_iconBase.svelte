<script>
 export let color = 'currentColor';
 export let size = 24;
 export let title = "abbott";
</script>

<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={color}>
    <title>{title}</title>
    <slot/>
</svg>
