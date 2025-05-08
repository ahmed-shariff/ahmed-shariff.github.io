<script>
 import { page } from '$app/stores';
 import { goto } from "$app/navigation";
 import { beforeUpdate, createEventDispatcher } from 'svelte';

 export let tag;
 export let inverseOp = false;

 let query = null;
 beforeUpdate(() => {
     query = new URLSearchParams($page.url.searchParams.toString());
 });

 const dispatch = createEventDispatcher();

 // When inverseOp is true, remove the `tag` from the search query,
 // if  not add it on click.
 function onClick()
 {
     if ($page.url.pathname.startsWith("/post/")) {
         goto(`/posts?tag=${tag}`);
     } else {
         let tags = query.getAll("tag");
         query.delete("tag");

         if (inverseOp) {
             tags = tags.filter(_tag => _tag !== tag);
         }
         else {
             tags.push(tag);
         }

         let queryStr = query.toString();

         if (tags.length > 0) {
             if (queryStr.length > 0)
                 queryStr += "&";
             
             queryStr += tags.map(tag => `tag=${tag}`).join("&");
         }

         // NOTE: goto doesn't change the state on static site, but sets the query params
         goto(`?${queryStr}`);
         dispatch('change', { tag: tag, inverseOp: inverseOp });
     }
 }
</script>

<div>
    <button class="hover:underline text-slate-300" on:click={onClick}>#{tag}</button>
</div>
