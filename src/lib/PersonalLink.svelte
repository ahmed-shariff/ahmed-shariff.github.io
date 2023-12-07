<script>
 import Icon from "$lib/icons/Icon.svelte";

 export let link;
 export let text;
 export let icon;
</script>

<a class='flex items-center space-x-3 text-sky-400 h-4' href={link}>
    <span><Icon title={icon.title} size="18"><path d={icon.path}/></Icon></span>
    <span>{text}</span>
</a>
