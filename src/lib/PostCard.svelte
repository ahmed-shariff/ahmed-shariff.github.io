<script>
 import Tag from "./Tag.svelte";
 import School from "./icons/school.svelte";

 let { post } = $props();
 const thumbnail = $derived(post.meta.thumbnail ?? null);
 const tags = $derived((post.meta.tags !== undefined) && (post.meta.tags !== null) && (post.meta.tags.length > 0) ? post.meta.tags: null);
</script>

<a href="/post/{post.path}" class="rounded-btn relative flex min-h-24 overflow-hidden lg:flex-row">
    {#if thumbnail}
        <img
            src={thumbnail}
            alt={post.meta.thumbnailDescription ?? ""}
            title={post.meta.thumbnailDescription ?? undefined}
            class="absolute inset-0 h-full w-full scale-105 object-cover blur-sm brightness-50 lg:relative lg:inset-auto lg:h-auto lg:w-32 lg:shrink-0 lg:scale-100 lg:blur-none lg:brightness-100"
        />
        <!-- class="absolute inset-0 h-full w-full scale-105 object-cover blur-sm brightness-50 lg:relative lg:inset-auto lg:h-auto lg:w-32 lg:shrink-0 lg:scale-100 lg:blur-none lg:brightness-100" -->
        <!-- class="absolute inset-0 h-full w-full scale-105 object-cover blur-sm brightness-40" -->
    {/if}
    <div class="relative z-10 grow p-3 text-left prose prose-sm max-w-none prose-h1:text-base prose-h1:font-normal">
        <div class="text-slate-300">
            {post.date}
        </div>
        <h1 class="-mb-0.5">
        {#if post.meta.published === false}
            <div class='inline text-red-300'>[DRAFT] </div>
        {/if}
        {post.meta.title}
        </h1>
        {#if (tags !== null)}
            <div class="text-xs text-slate-300 flex gap-x-1 flex-wrap">
                {#each tags as tag}
                    <Tag {tag} />
                {/each}
            </div>
        {/if}
        {#if (post.meta.ispub)}
        <div class='text-slate-300 flex flex-wrap prose-p:m-0'>
            {@html post.meta.authors}
        </div>
        {/if}
        <div class='text-slate-300 flex flex-wrap gap-x-4'>
            {#if post.meta.venue !== undefined}
                <div>{post.meta.venue}</div>
            {:else if post.meta.type !== undefined}
                <div>{post.meta.type}</div>
            {/if}
            {#if (post.meta.ispub && post.meta.doi !== undefined)}
                <div>{post.meta.doi}</div>
            {/if}
            {#if (post.meta.award !== undefined)}
                <div>{"🏆 " + post.meta.award}</div>
            {/if}
        </div>
        {#if post.meta.tagline !== undefined}
            <div class='text-xs'>{post.meta.tagline}</div>
        {/if}
    </div>
    {#if post.meta.ispub}
        <div class='relative z-10 flex shrink-0 bg-slate-500 p-1.5 content-center items-center'>
            <School size="18" color={"#cccccc"}/>
        </div>
    {/if}
</a>
