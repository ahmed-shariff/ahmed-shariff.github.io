<script>
 import { page } from '$app/stores';
 import { goto } from "$app/navigation";
 import PostCard from "$lib/PostCard.svelte";
 import Tag from "$lib/Tag.svelte";

 export let data;
 let isPubOnly, tags, publicationFilterBtnTxt;
 $: isPubOnly= $page.url.searchParams.get("pub");
 $: publicationFilterBtnTxt = isPubOnly ? "All posts" : "Publications only";
 $: tags = $page.url.searchParams.getAll("tag");

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
    <button on:click={publicationFilterBtnOnClick}>{publicationFilterBtnTxt}</button>
    {#if tags !== undefined}
        <button on:click={clearTagsBtnOnClick}>Clear all tags</button>
        {#each tags as tag}
            <Tag {tag} inverseOp={true} />
        {/each}
    {/if}
    {#await data then postsData}
        {#each postsData.tags as tag}
            {#if tags === undefined || !tags.includes(tag)}
                <Tag {tag} />
            {/if}
        {/each}
        <ul>
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
