<script lang="ts">
 import "../../../app.css";
 import IoChevronUpCircleArrow from "$lib/icons/ioCevronUpCircleArrow.svelte";

 const currentYear = new Date().getFullYear();
</script>

<svelte:head>
    <meta name="robots" content="index, follow" />
    <meta name="googlebot" content="index, follow" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>HPUI-Systems</title>
    <meta
	name="description"
	content="HPUI Systems is building the keyboard and mouse for smartglasses."
    />

    <meta property="og:title" content="HPUI Systems" />
    <meta
	property="og:description"
	content="Building the keyboard and mouse for smartglasses."
    />
    <meta property="og:type" content="website" />
</svelte:head>

<div class="min-h-screen bg-[#F7FAFF] text-slate-900">
    <header class="sticky top-0 z-20 border-b border-[#C9D8F7] bg-white/90 backdrop-blur">
	<div class="container mx-auto flex items-center justify-between px-4 py-3">
	    <a href="/hpui-systems" class="flex items-center gap-3 font-semibold tracking-tight text-[#00132B]">
		<div class="h-9 w-9 rounded-xl bg-[#0253F3]"></div>
		<span class="text-base sm:text-lg">HPUI-Systems</span>
	    </a>

	    <nav class="hidden items-center gap-6 text-sm text-slate-600 sm:flex">
		<a class="hover:text-[#0253F3]" href="#about">About</a>
		<a class="hover:text-[#0253F3]" href="#publications">Publications</a>
		<a class="hover:text-[#0253F3]" href="#newsletter">Newsletter</a>
	    </nav>
	</div>
    </header>

    <main class="container mx-auto px-4 py-10">
	<slot />
    </main>

    <button
	class="fixed bottom-4 right-4 z-50 rounded-full bg-white shadow-lg ring-1 ring-[#C9D8F7] transition hover:shadow-xl"
	aria-label="Scroll to top"
	on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
	>
	<IoChevronUpCircleArrow class="fill-[#00132B] stroke-white" />
    </button>

    <footer class="border-t border-[#C9D8F7] bg-white">
	<div class="container mx-auto px-4 py-6 text-sm text-slate-500">
			&copy; {currentYear} Shariff Faleel
	</div>
    </footer>
</div>
