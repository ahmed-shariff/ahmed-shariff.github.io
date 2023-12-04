<script>
 import Icon from "./Icon.svelte";

 export let link;
 export let text;
 export let icon;
</script>

<a class='flex items-center space-x-3 text-sky-400 h-4' href={link}>
    <span><Icon simpleIcon={icon} size="18" /></span>
    <span>{text}</span>
</a>
