<script>
 export let simpleIcon;
 export let color = 'currentColor';
 export let size = 24;
</script>

<svg xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill={color}
    viewBox="0 0 24 24">
    <title>{simpleIcon.title}</title>
    <path d={simpleIcon.path}/>
</svg>
