<script>
 import Information from "$lib/Information.svelte";
 import Tag from "$lib/Tag.svelte";
 import Giscus from '@giscus/svelte';
 import FilePdf from "$lib/icons/FilePDF.svelte";
 import Meta from "$lib/Meta.svelte";

 export let data;

 let metaDesc = "";

 if (data.meta.doi !== undefined)
     metaDesc = data.meta.abstract;
 else if (data.meta.tagline !== undefined)
     metaDesc = data.meta.tagline;
 else
     metaDesc = data.title;
</script>

<Meta
    title={data.title}
    desc={metaDesc}
    link={`https://shariff-faleel.com/post/${data.slug}`}
/>

<article class="p-5 md:p-0 prose mx-auto max-w-screen-xl prose-img:block prose-img:m-auto prose-img:max-h-96 prose-p:w-full prose-h1:text-left break-words prose-table:table-auto prose-table:bg-slate-900 prose-td:border prose-td:border-slate-600 prose-td:p-2">

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

    {#if data.meta.ispub === true}
        {#if data.meta.award !== undefined}
            <div class='flex space-x-4 mt-2'>
                <div class='prose-p:m-0'>
                 {"🏆 " + data.meta.award}
                </div>
            </div>
        {/if}
        <Information keyStr="Type">{data.meta.type}</Information>
        <Information keyStr="Authors">{@html data.meta.authors}</Information>
        {#if data.meta.venue !== undefined}
            <Information keyStr="Venue">{data.meta.venue}</Information>
        {/if}
        <Information keyStr="Date of publication">{data.date}</Information>
        {#if data.meta.doi !== undefined}
            <Information keyStr="URL">
                {#if data.meta.paperurl !== undefined}
                    <a href={data.meta.paperurl.trimEnd().trimStart()}>{data.meta.doi}</a>
                {:else}
                    data.meta.doi
                {/if}
            </Information>
        {/if}
        {#if data.meta.pdf !== undefined}
            <Information keyStr="pdf download"><a href={data.meta.pdf.trimEnd().trimStart()} class=""><FilePdf /></a></Information>
        {/if}
        <Information keyStr="Abstract" inCols={true}>{data.meta.abstract}</Information>
        <Information keyStr="Citation" inCols={true}>{data.meta.citation}</Information>
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
