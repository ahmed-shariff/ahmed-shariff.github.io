<script>
 import "../../../app.css";
 import IoCevronUpCircleArrow from "$lib/icons/ioCevronUpCircleArrow.svelte";

 let currentYear = new Date().getFullYear();
</script>

<svelte:head>
    <meta name="robots" content="index, follow"/>
    <meta name="googlebot" content="index, follow"/>
</svelte:head>

<div class='flex flex-col min-h-screen bg-slate-700'>
    <header class='bg-gray-800 mb-0 md:mb-8 py-1 text-gray-300 md:sticky top-0 left-0 right-0 drop-shadow-lg shadow-gray-900 z-10'>
        <div class='container mx-auto flex flex-col md:flex-row gap-x-12 items-center justify-center'>
            <a class="nav-btn font-semibold text-lg" href="/">Shariff Faleel</a>
        </div >
    </header >
    <main class='container mx-auto flex-1'>
        <slot />
    </main>
    <div class="fixed bottom-4 right-4 drop-shadow-lg z-50 shadow-gray-900" >
        <button on:click={() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
            <IoCevronUpCircleArrow class="fill-slate-800 hover:fill-slate-500 stroke-slate-200"/>
        </button>
    </div>
    <footer class='bg-gray-800 mt-8 py-4 text-gray-300 drop-shadow-lg shadow-gray-900'>
        <div class='container mx-auto flex justify-center text-sm'>
                    &copy; { currentYear } Shariff Faleel
        </div>
    </footer>
</div >
