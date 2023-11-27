<script>
 export let data;
</script>

<article>
    <h1>
        {#if data.published}
            [DRAFT]
        {/if}
        {data.title}
    </h1>
    <svelte:component this={data.content} />
</article>
