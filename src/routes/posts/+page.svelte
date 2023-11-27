<script>
 import PostCard from "$lib/PostCard.svelte";

 export let data;
</script>

<div>
    <ul>
    {#await data then postsData}
        {#each postsData.posts as post, i}
            <li>
                <PostCard {post}/>
            </li>
        {/each}
    {/await}
    </ul>
</div>
