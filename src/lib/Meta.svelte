<script>
 let {title, desc, link } = $props(); // link is cannonical
</script>

<svelte:head>
    <meta name="title" content={title}/>
    <meta name="description" content={desc}/>
    <link rel="cannonical" href={link}/>
</svelte:head>
