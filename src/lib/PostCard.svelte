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
        <div class='flex bg-slate-500 p-1.5 content-center items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="#cccccc" class="ionicon" viewBox="0 0 512 512"><path d="M256 370.43L96 279v98.42l160 88.88 160-88.88V279l-160 91.43z"/><path d="M512.25 192L256 45.57-.25 192 256 338.43l208-118.86V384h48V192.14l.25-.14z"/></svg>
        </div>
    {/if}
</a>
