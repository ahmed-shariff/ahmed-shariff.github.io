<script lang="ts">
 import ffirst from "/src/posts/assets/2026-03-04/ffirst.png";
 import cloe from "/src/posts/assets/2026-03-04/cloe-teaser.png";
 const publications = [
     {
         title: 'HPUI thesis / dissertation',
         desc: 'Shariff Faleel\'s thesis on HPUI.</br>The thesis introduces Hand Proximate User Interfaces (HPUI) for smart glasses, where a virtual smartphone-like interface is projected onto the user’s hand. It enables familiar one-handed interaction that is physically and socially comfortable, and can be used without looking once learned. The thesis studies how to design HPUIs, evaluates them against similar smart-glasses interaction techniques, examines their performance, and presents an HPUI toolkit for future research and design.',
         href: 'https://shariff-faleel.com/post/2025-03-27-pub-shariff-thesis'
     },
     {
         title: 'HPUI: Hand Proximate User Interfaces for One-Handed Interactions on Head Mounted Displays',
         desc: 'Shariff AM Faleel, Michael Gammon, Kevin Fan, Da-Yuan Huang, Wei Li, Pourang Irani. "HPUI: Hand Proximate User Interfaces for One-Handed Interactions on Head Mounted Displays," in IEEE Transactions on Visualization and Computer Graphics, vol. 27, no. 11, pp. 4215-4225, Nov. 2021, doi: 10.1109/TVCG.2021.3106493.',
         href: 'https://shariff-faleel.com/post/2021-08-27-pub-shariff21_hpui'
     },
     {
         title: 'Validating Eyes-free Affordance of On-Finger Hand Proximate User Interfaces in In-situ Scenarios',
         desc: 'Shariff AM Faleel, SoonUk Kwon, David Ahlström, Pourang Irani. "Validating Eyes-free Affordance of On-Finger Hand Proximate User Interfaces in In-situ Scenarios", 2024 IEEE International Symposium on Mixed and Augmented Reality (ISMAR `24)',
         href: 'https://shariff-faleel.com/post/2024-09-01-pub-shariff24-in-situ-comp'
     }
 ];
</script>

<svelte:head>
    <title>HPUI Systems</title>
    <meta
        name="description"
        content="Building the keyboard and mouse for smartglasses."
    />
</svelte:head>

<section class="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
    <div>
        <p class="mb-4 inline-flex rounded-full bg-[#EAF1FF] px-3 py-1 text-sm font-medium text-[#0253F3]">
           Smartglasses input for real work
        </p>

        <h1 class="max-w-3xl text-4xl font-bold tracking-tight text-[#00132B] sm:text-5xl">
           We want to build the keyboard and mouse for smartglasses.
        </h1>

        <p class="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
           HPUI Systems is developing a practical input layer for smartglasses: a way to make
           interaction fast, intuitive, and usable in hands-busy workflows.
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
            <a
                href="#newsletter"
                class="rounded-xl bg-[#0253F3] px-5 py-3 font-medium text-white shadow-sm transition hover:bg-[#0047d1]"
            >
            Join the newsletter
            </a>
            <a
                href="#publications"
                class="rounded-xl border border-[#C9D8F7] bg-white px-5 py-3 font-medium text-[#00132B] transition hover:border-[#0253F3]"
            >
            View publications
            </a>
        </div>
    </div>

    
    <div class="aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#EAF1FF] to-[#DDE8FF] p-1">
        <div class="flex h-full flex-col justify-between rounded-2xl border border-dashed border-[#87A9FF] bg-white/70 p-2">
            <figure class="flex h-full flex-col items-center justify-center text-center">
                <img src={ffirst} alt="my alt text" class="max-h-full max-w-full object-contain" />
            </figure>
        </div>
    </div>

</section>

<section id="about" class="mt-16 grid gap-6 md:grid-cols-3">
    <div class="rounded-2xl border border-[#C9D8F7] bg-white p-6">
        <h2 class="text-lg font-semibold text-[#00132B]">What we are building</h2>
        <p class="mt-3 text-slate-700">
        A practical one-handed input layer for smartglasses, designed to reduce friction in
        task-focused work.
        </p>
    </div>

    <div class="rounded-2xl border border-[#C9D8F7] bg-white p-6">
        <h2 class="text-lg font-semibold text-[#00132B]">Who it is for</h2>
        <p class="mt-3 text-slate-700">
            Frontline workers, technical teams, and organizations exploring smartglasses for real workflows.
        </p>
    </div>

    <div class="rounded-2xl border border-[#C9D8F7] bg-white p-6">
        <h2 class="text-lg font-semibold text-[#00132B]">Our focus</h2>
        <p class="mt-3 text-slate-700">
            We focus on hands-busy workflows where input friction blocks adoption.
        </p>
    </div>
</section>

<section id="publications" class="mt-16">
    <div class="flex items-end justify-between gap-4">
        <div>
            <h2 class="text-2xl font-bold tracking-tight text-[#00132B]">Publications</h2>
            <p class="mt-2 text-slate-600">Selected research and related writing.</p>
        </div>
    </div>

    <div class="mt-6 grid gap-4">
    {#each publications as pub}
        <a
            href={pub.href}
            class="block rounded-2xl border border-[#C9D8F7] bg-white p-5 transition hover:border-[#0253F3] hover:shadow-sm"
        >
            <h3 class="font-semibold text-[#00132B]">{pub.title}</h3>
            <p class="mt-1 text-sm text-slate-600">{@html pub.desc}</p>
        </a>
    {/each}
    </div>

    <div class="mt-6 grid gap-4">
        <a
            href="https://shariff-faleel.com/posts?tag=HPUI"
            class="block rounded-2xl border border-[#C9D8F7] bg-white p-5 transition hover:border-[#0253F3] hover:shadow-sm"
        >
            <p>
        ... For more see full list of publication and articals related to HPUI here.
            </p>
        </a>
    </div>
    <p>
    </p>

    <!-- <p class="mt-4 text-sm text-slate-500">
         Replace the placeholders above with links to your thesis, papers, preprints, or project notes.
         </p> -->
</section>

<!-- <section class="mt-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
     <div>
     <h2 class="text-2xl font-bold tracking-tight text-[#00132B]">What images to add</h2>
     <p class="mt-2 text-slate-600">
     Keep the visuals simple, credible, and close to the actual product story.
     </p>

     <ul class="mt-4 space-y-3 text-slate-700">
     {#each imageGuide as item}
     <li class="rounded-xl border border-[#C9D8F7] bg-white p-4">{item}</li>
     {/each}
     </ul>
     </div>

     <div class="rounded-3xl border border-[#C9D8F7] bg-white p-6">
     <h3 class="text-lg font-semibold text-[#00132B]">Color palette</h3>
     <p class="mt-3 text-slate-700">
     Your logo already gives a strong foundation. This page uses:
     </p>

     <div class="mt-5 space-y-4">
     <div class="flex items-center gap-4">
     <div class="h-10 w-10 rounded-xl bg-[#0253F3]"></div>
     <div>
     <p class="font-medium text-[#00132B]">Primary blue</p>
     <p class="text-sm text-slate-500">#0253F3</p>
     </div>
     </div>

     <div class="flex items-center gap-4">
     <div class="h-10 w-10 rounded-xl bg-[#00132B]"></div>
     <div>
     <p class="font-medium text-[#00132B]">Deep navy</p>
     <p class="text-sm text-slate-500">#00132B</p>
     </div>
     </div>

     <div class="flex items-center gap-4">
     <div class="h-10 w-10 rounded-xl bg-[#F7FAFF] ring-1 ring-[#C9D8F7]"></div>
     <div>
     <p class="font-medium text-[#00132B]">Soft background</p>
     <p class="text-sm text-slate-500">#F7FAFF</p>
     </div>
     </div>

     <div class="flex items-center gap-4">
     <div class="h-10 w-10 rounded-xl bg-[#C9D8F7]"></div>
     <div>
     <p class="font-medium text-[#00132B]">Border / accent tint</p>
     <p class="text-sm text-slate-500">#C9D8F7</p>
     </div>
     </div>
     </div>
     </div>
     </section>
-->
<section id="newsletter" class="mt-16 rounded-3xl border border-[#C9D8F7] bg-white p-6 md:p-8">
    <h2 class="text-2xl font-bold tracking-tight text-[#00132B]">Newsletter</h2>
    <p class="mt-2 max-w-2xl text-slate-600">
                If you want occasional updates on HPUI-Systems, leave your email below.
    </p>

    <form
        action="https://buttondown.com/api/emails/embed-subscribe/hpui-systems"
        method="post"
        class="embeddable-buttondown-form mt-6 max-w-xl space-y-4"
    >
        <label for="bd-email" class="block text-sm font-medium text-[#00132B]">Enter your email</label>
        <input
            type="email"
            name="email"
            id="bd-email"
            class="w-full rounded-xl border border-[#C9D8F7] px-4 py-3 outline-none transition focus:border-[#0253F3]"
        />
        <input
            type="submit"
            value="Subscribe"
            class="cursor-pointer rounded-xl bg-[#0253F3] px-5 py-3 font-medium text-white transition hover:bg-[#0047d1]"
        />
        <p class="text-sm text-slate-500">
            <a
                href="https://buttondown.com/refer/hpui-systems"
                target="_blank"
                rel="noreferrer"
                class="hover:text-[#0253F3]"
            >
                                Powered by Buttondown.
            </a>
        </p>
    </form>
</section>
