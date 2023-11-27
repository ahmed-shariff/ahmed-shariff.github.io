<script>
 import PostCard from "$lib/PostCard.svelte";
 import { page } from '$app/stores';

 export let data;
 let isPubOnly, tags;
 $: isPubOnly= $page.url.searchParams.get("pub");
 $: tags = $page.url.searchParams.getAll("tag");
</script>

<div>
    <ul>
    {#await data then postsData}
        {#each postsData.posts as post, i}
            {#if (tags.length == 0 || (post.meta.tags != undefined && post.meta.tags.filter(tag => tags.includes(tag)).length > 0)) && (!isPubOnly || ("doi" in post.meta))}
                <li>
                    <PostCard {post}/>
                </li>
            {/if}
        {/each}
    {/await}
    </ul>
</div>
