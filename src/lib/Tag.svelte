<script>
 import { page } from '$app/stores';
 import { goto } from "$app/navigation";

 export let tag;
 export let inverseOp = false;

 // When inverseOp is true, remove the `tag` from the search query,
 // if  not add it on click.
 function onClick()
 {
     let query = new URLSearchParams($page.url.searchParams.toString());
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

     goto(`?${queryStr}`);

 }
</script>

<button on:click={onClick}>#{tag}</button>
