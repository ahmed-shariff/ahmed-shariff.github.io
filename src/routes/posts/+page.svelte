<script>
 import { page } from '$app/stores';
 import { goto } from "$app/navigation";
 import PostCard from "$lib/PostCard.svelte";
 import Tag from "$lib/Tag.svelte";

 export let data;
 let isPubOnly, tags, publicationFilterBtnTxt, title;
 $: isPubOnly= $page.url.searchParams.get("pub");
 $: publicationFilterBtnTxt = isPubOnly ? "Show all posts" : "Show publications only";
 $: tags = $page.url.searchParams.getAll("tag");

 $: title = isPubOnly ? "Publications" : "Posts";

 function publicationFilterBtnOnClick() {
     let query = new URLSearchParams($page.url.searchParams.toString());
     if (isPubOnly) {
         query.delete("pub");
     } else {
         query.set("pub", true);
     }
     goto(`?${query.toString()}`);
 }

 function clearTagsBtnOnClick() {
     let query = new URLSearchParams($page.url.searchParams.toString());
     query.delete("tag");
     goto(`?${query.toString()}`);
 }
</script>

<div>
    <h1 class='text-xl text-center text-slate-100'>{title}</h1>
    <div class="flex px-1 space-x-1 items-center">
        <button class="rounded-btn px-2 py-1" on:click={publicationFilterBtnOnClick}>{publicationFilterBtnTxt}</button>
        {#if (tags !== undefined) && (tags.length > 0)}
            <button class="rounded-btn px-2 py-1" on:click={clearTagsBtnOnClick}>Clear all tags</button>
            <div class="font-semibold pl-4"> Selected tags:</div>
            {#each tags as tag}
                <Tag {tag} inverseOp={true} />
            {/each}
        {/if}
    </div>
    {#await data then postsData}
        <div class="flex flex-wrap flex-row px-3 space-x-1">
            <div class="font-semibold">Filter by tag:</div>
            {#each postsData.tags as tag}
                {#if tags === undefined || !tags.includes(tag)}
                    <Tag {tag} />
                {/if}
            {/each}
        </div>
        <ul class="pt-2">
        {#each postsData.posts as post, i}
            {#if (tags.length == 0 || (post.meta.tags != undefined && post.meta.tags.filter((tag) => tags.includes(tag)).length == tags.length)) && (!isPubOnly || ("doi" in post.meta))}
                <li>
                    <PostCard {post}/>
                </li>
            {/if}
        {/each}
        </ul>
    {/await}
</div>
