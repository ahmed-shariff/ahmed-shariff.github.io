<script>
 import Icon from "$lib/icons/Icon.svelte";

 let { link, text, icon } = $props();
</script>

<a class='flex items-center space-x-3 text-sky-400 h-4' href={link}>
    <span>
        {#if icon.path}
            <Icon title={icon.title} size="18"><path d={icon.path}/></Icon>
        {:else}
            {@const IconComponent = icon}
            <IconComponent size="18" />
        {/if}
    </span>
    <span>{text}</span>
</a>
