<script>
 let { color = 'currentColor', size = 24, title = "abbott", viewBox = "0 0 24 24", ...rest} = $props();
</script>

<svg viewBox={viewBox} xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={color} {...rest} >
    <title>{title}</title>
    <slot/>
</svg>
