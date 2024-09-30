<script>
 import { page } from '$app/stores';
 import { goto } from "$app/navigation";
 import PostCard from "$lib/PostCard.svelte";
 import Tag from "$lib/Tag.svelte";
 import { beforeUpdate } from 'svelte';
 import Icon from '$lib/icons/Icon.svelte';
 import { siRss } from 'simple-icons';
 import Meta from '$lib/Meta.svelte';

 export let data;

 let pubVal, tagsVal;
 beforeUpdate(() => {
     pubVal = $page.url.searchParams.get("pub");
     tagsVal = $page.url.searchParams.getAll("tag");
 })

 let isPubOnly, tags, publicationFilterBtnTxt, title;
 $: isPubOnly= pubVal;
 $: publicationFilterBtnTxt = isPubOnly ? "Show all posts" : "Show publications only";
 $: tags = tagsVal;

 $: title = isPubOnly ? "Publications" : "Posts";

 function publicationFilterBtnOnClick() {
     let query = new URLSearchParams($page.url.searchParams.toString());
     if (isPubOnly) {
         query.delete("pub");
     } else {
         query.set("pub", true);
     }
     // NOTE: goto doesn't change the state on static site, but sets the query params
     goto(`?${query.toString()}`);
     isPubOnly = query.get("pub");
 }

 function clearTagsBtnOnClick() {
     let query = new URLSearchParams($page.url.searchParams.toString());
     query.delete("tag");
     // NOTE: goto doesn't change the state on static site, but sets the query params
     goto(`?${query.toString()}`);
     tags = query.getAll("tag");
 }

 function handleTagChange(event) {
     let tag = event.detail.tag;
     if (event.detail.inverseOp) {
         tags = tags.filter(_tag => _tag !== tag);
     }
     else {
         tags = [...tags, tag]
     }
 }
</script>

<Meta
    title="Posts and publications by Shariff AM Faleel"
    desc="The list of posts and publications by Shariff AM Faleel"
    link="https://shariff-faleel.com/posts"
/>

<div>
    <h1 class='text-xl text-center text-slate-100'>{title}</h1>
    <div class="flex mx-1 w-100">
        <div class="flex flex-col sm:flex-row space-x-1 justify-start items-center">
            <button class="rounded-btn w-48 px-2 py-1" on:click={publicationFilterBtnOnClick}>{publicationFilterBtnTxt}</button>
            {#if (tags !== undefined) && (tags !== null) && (tags.length > 0)}
                <button class="rounded-btn w-48 px-2 py-1" on:click={clearTagsBtnOnClick}>Clear all tags</button>
                <div class="flex flex-wrap">
                    <div class="font-semibold pl-4"> Selected tags:</div>
                    {#each tags as tag}
                        <Tag {tag} inverseOp={true} on:change={handleTagChange} />
                    {/each}
                </div>
            {/if}
        </div>
        <div class="grow flex justify-end">
            <a href="/posts.xml" class="p-2 flex space-x-2">
                <span>RSS Feed</span>
                <Icon title="rss" size="20" class="fill-slate-400"><path d={siRss.path}/></Icon>
            </a>
        </div>
    </div>
    {#await data then postsData}
        <div class="flex flex-wrap flex-row px-3 space-x-1">
            <div class="font-semibold">Filter by tag:</div>
            {#each postsData.tags as tag}
                {#if tags === undefined || !tags.includes(tag)}
                    <Tag {tag} on:change={handleTagChange} />
                {/if}
            {/each}
        </div>
        <ul class="pt-2">
        {#each postsData.posts as post, i}
            {#if (tags == null || tags.length == 0 || (post.meta.tags != undefined && post.meta.tags.filter((tag) => tags.includes(tag)).length == tags.length)) && (!isPubOnly || (post.meta.ispub))}
                <li>
                    <PostCard {post}/>
                </li>
            {/if}
        {/each}
        </ul>
    {/await}
</div>
