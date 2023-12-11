<script>
 export let title;
 export let desc;
 export let link; // cannonical
</script>

<svelte:head>
    <meta name="title" content={title}/>
    <meta name="description" content={desc}/>
    <link rel="cannonical" href={link}/>
</svelte:head>
