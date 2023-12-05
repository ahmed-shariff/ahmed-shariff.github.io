<script>
 import Information from "$lib/Information.svelte";
 import Tag from "$lib/Tag.svelte";
 import Giscus from '@giscus/svelte';

 export let data;
</script>

<article class="p-5 md:p-0 prose dark:prose-invert text-justify mx-auto max-w-screen-xl prose-img:block prose-img:m-auto prose-img:max-h-96 prose-p:w-full">

    <div class='text-xs text-slate-400'>
        {data.date}
        {#if (data.meta.tags !== undefined) && (data.meta.tags !== null)}
            <div class="flex flex-row space-x-3">
            {#each data.meta.tags as tag}
                <Tag {tag} inverseOp={true} />
            {/each}
            </div>
        {/if}
    </div>
    <h1>
        {#if data.published}
            [DRAFT]
        {/if}
        {data.title}
    </h1>

    {#if data.meta.doi !== undefined}
        <Information keyStr="Type" valueStr={data.meta.type} />
        <Information
            keyStr="Authors"
            valueStr={data.meta.authors} />
        <Information keyStr="Venue" valueStr={data.meta.venue} />
        <Information keyStr="Date of publication" valueStr={data.date} />
        <Information keyStr="URL" valueStr={`<a href=${data.meta.paperurl}>${data.meta.doi}</a>`} />
        <Information keyStr="pdf download" valueStr={`<a href=${data.meta.pdf}>${data.meta.pdf}</a>`} />
        <Information
            keyStr="Abstract"
            valueStr={data.meta.abstract} />

        <Information
            keyStr="Citation"
            valueStr={data.meta.citation} />
    {/if}

    <svelte:component this={data.content} />

    <Giscus
        id="comments"
        repo="ahmed-shariff/ahmed-shariff.github.io"
        repoId="MDEwOlJlcG9zaXRvcnkxMjU3MDU3Nzc="
        category="Announcements"
        categoryId="DIC_kwDOB34eMc4COpxh"
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="light"
        lang="en"
        loading="lazy"
        crossorigin="anonymous"
    />
</article>
