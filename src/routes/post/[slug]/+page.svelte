<script>
 export let data;
</script>

<article class="p-5 md:p-0 prose dark:prose-invert text-justify mx-auto max-w-screen-xl prose-img:block prose-img:m-auto prose-img:max-h-96 prose-p:w-full">
    <h1>
        {#if data.published}
            [DRAFT]
        {/if}
        {data.title}
    </h1>
    <svelte:component this={data.content} />
</article>
