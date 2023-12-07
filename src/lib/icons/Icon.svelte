<script>
 export let color = 'currentColor';
 export let size = "24";
 export let title = "abbott";
 export let viewBox = "0 0 24 24";
</script>

<svg viewBox={viewBox} xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={color} {...$$restProps} >
    <title>{title}</title>
    <slot/>
</svg>
