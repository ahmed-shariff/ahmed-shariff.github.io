<script>
 export let data;
</script>

<h1>blog</h1>

<ul>
    {#each data.summaries as { slug, title }}
	<li><a href="/post/{slug}">{title}</a></li>
    {/each}
</ul>
