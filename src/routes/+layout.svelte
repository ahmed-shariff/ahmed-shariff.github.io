<script>
 import "../app.css";
 import { siGithub, siRss } from 'simple-icons';
 import IoCevronUpCircleArrow from "$lib/icons/ioCevronUpCircleArrow.svelte";
 import Icon from "../lib/icons/Icon.svelte";
</script>

<svelte:head>
    <meta name="robots" content="index, follow"/>
    <meta name="googlebot" content="index, follow"/>
</svelte:head>

<div class='flex flex-col min-h-screen bg-slate-700'>
    <header class='bg-gray-800 mb-0 md:mb-8 py-1 text-gray-300 md:sticky top-0 left-0 right-0 drop-shadow-lg shadow-gray-900 z-10'>
        <div class='container mx-auto flex flex-col md:flex-row gap-x-12 items-center justify-center'>
            <a class="nav-btn font-semibold text-lg" href="/">Shariff Faleel</a>
            <a class="nav-btn" href="/posts" data-sveltekit-reload>Posts</a>
            <a class="nav-btn" href="/posts?pub=true" data-sveltekit-reload>Publications</a>
            <button class="nav-btn group" href="/">
                <div>
                            Quick links
                    <svg fill="currentColor"
                        viewBox="0 0 20 20"
                        class="inline w-4 h-4 mt-1 ml-1 transition-transform duration-200 transform md:-mt-1 rotate-0 group-hover:rotate-180">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                </div>
                <div
                    class="absolute mt-2 origin-top-right rounded-md shadow-lg transition-transform transition-opacity ease-in-out duration-200 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100" >
                    <div class="p-2 bg-gray-900 rounded-md shadow dark-mode:bg-gray-700">
                        <a href="https://gist.github.com/ahmed-shariff" class="flex space-x-2 nav-btn w-100">
                            <div><Icon title="github" size="18"><path d={siGithub.path}/></Icon></div><div>github-gists</div>
                        </a>
                        <a href="/posts.xml" class="flex space-x-2 nav-btn w-100">
                            <Icon title="rss" size="18"><path d={siRss.path}/></Icon><span>RSS feed</span>
                        </a>
                    </div>
                </div>
            </button>
        </div >
    </header >
    <main class='container mx-auto flex-1'>
        <slot/>
    </main>
    <div class="fixed bottom-4 right-4 drop-shadow-lg z-50 shadow-gray-900" >
        <button on:click={() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
            <IoCevronUpCircleArrow class="fill-slate-800 hover:fill-slate-500 stroke-slate-200"/>
        </button>
    </div>
    <footer class='bg-gray-800 mt-8 py-4 text-gray-300 drop-shadow-lg shadow-gray-900'>
        <div class='container mx-auto flex justify-center text-sm'>
                    &copy; 2023 Shariff Faleel
        </div>
    </footer>
</div >
