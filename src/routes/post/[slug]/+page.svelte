<script>
 import Information from "$lib/Information.svelte";
 import Tag from "$lib/Tag.svelte";
 import Giscus from '@giscus/svelte';
 import FilePdf from "$lib/icons/FilePDF.svelte";

 export let data;
</script>

<article class="p-5 md:p-0 prose dark:prose-invert mx-auto max-w-screen-xl prose-img:block prose-img:m-auto prose-img:max-h-96 prose-p:w-full prose-h1:text-left">

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
        <Information keyStr="Venue">{data.meta.venue}</Information>
        <Information keyStr="Date of publication">{data.date}</Information>
        <Information keyStr="URL"><a href={data.meta.paperurl}>{data.meta.doi}</a></Information>
        <Information keyStr="pdf download"><a href={data.meta.pdf} class=""><FilePdf /></a></Information>
        <Information keyStr="Abstract">{data.meta.abstract}</Information>
        <Information keyStr="Citation">{data.meta.citation}</Information>
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
