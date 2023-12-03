<script>
 import Tag from "./Tag.svelte";

 export let post;
 const tags = (post.meta.tags !== undefined) && (post.meta.tags !== null) && (post.meta.tags.length > 0) ? post.meta.tags: null;
</script>

<a href="/post/{post.path}" class="rounded-btn min-h-24 max-h-64 flex flex-row">
    <div class="grow text-left h-full p-3 prose dark:prose-invert prose-sm max-w-none prose-h1:text-base prose-h1:font-normal">
        <div class="text-slate-400">
            {post.date}
        </div>
        <h1 class="-mb-0.5">
        {#if post.meta.published === false}
            <div class='inline text-red-400'>[DRAFT] </div>
        {/if}
        {post.meta.title}
        </h1>
        {#if (tags !== null)}
            <div class="text-xs text-slate-400 flex gap-x-1 flex-wrap">
                {#each tags as tag}
                    <Tag {tag} />
                {/each}
            </div>
        {/if}
        <div class='text-slate-400 flex flex-wrap gap-x-4'>
            {#if post.meta.venue !== undefined}
                <div>{post.meta.venue}</div>
            {/if}
            {#if post.meta.doi !== undefined}
                <div>{post.meta.doi}</div>
            {/if}
        </div>
        {#if post.meta.tagline !== undefined}
            <div class='text-xs'>{post.meta.tagline}</div>
        {/if}
    </div>
    {#if post.meta.doi !== undefined}
        <div class='bg-slate-500 p-3 content-center items-center'>
        </div>
    {/if}
</a>
