<script>
 import getMD5 from 'md5';
 import { siGithub, siGooglescholar, siFacebook, siTwitter, siLinkedin } from 'simple-icons';
 import PersonalLink from '$lib/PersonalLink.svelte';
 import PostCard from '$lib/PostCard.svelte';
 import ArrowButton from '$lib/ArrowButton.svelte';
 import Meta from '$lib/Meta.svelte';

 export let data;

 let gavatarSize = 220;
 let gavatarQueryString = `//en.gravatar.com/avatar/${getMD5("shariff.mfa@outlook.com", {encoding: 'binary'})}?s=${gavatarSize}&r=pg&d=retro`
</script>

<Meta
    title="Home Page for Shariff Faleel's website."
    desc="Home Page for Shariff Faleel's website. You can see his blog posts, publication and more information about him."
    link="https://shariff-faleel.com/"
/>

<div class='divide-y-4 divide-slate-400/25'>
    <div class='flex flex-col sm:flex-row gap-x-12 m-1 max-w-none text-justify justify-center'>
        <div class='flex flex-col space-y-1 items-center'>
            <img
                alt='Gravatar for Shariff Faleel'
                src="{gavatarQueryString}"
                height={gavatarSize}
                width={gavatarSize}
            />
            <ul class='list-none w-40 list-outside text-sm p-3 prose'>
                <li>
                    <PersonalLink link={"https://github.com/ahmed-shariff"} text={"Github"} icon={siGithub}/>
                </li>
                <li>
                    <PersonalLink link="https://scholar.google.ca/citations?user=wxMtqMMAAAAJ&hl=en" text="Google scholar" icon={siGooglescholar} />
                </li>
                <li>
                    <PersonalLink link="https://www.facebook.com/amsha1" text="facebook" icon={siFacebook} />
                </li>
                <li>
                    <PersonalLink link="https://twitter.com/_ahmedshariff_" text="Twitter" icon={siTwitter} />
                </li>
                <li>
                    <PersonalLink link="https://www.linkedin.com/in/shariff-faleel" text="Linkedin" icon={siLinkedin} />
                </li>
            </ul>
        </div>
        <div class="p-2 divide-y-4 divide-slate-600">
            <div class="prose max-w-none">
                <h1 class='text-center font-normal text-lg'>Hello there ....</h1>
                <p>I am Shariff Faleel, a post-doctoral fellow at the <a href="https://ovi.ok.ubc.ca">OVI Lab</a>. I design and study immersive technologies like AR and VR to improve how people interact with information while they go about their everyday life. I completed my PhD under <a href="https://cmps-people.ok.ubc.ca/pirani/">Prof. Pourang Irani</a>. Currently I focus on translating academic innovation to real-world use, particularly around realizing smart-glases as the next iteration of mobile computing. My overall goal is to develop technology that can meaningfully augment the human experience.
                </p>
            </div>
            <div class="flex flex-col text-center my-4 p-2">
                <h1 class="text-xl text-gray-300 text-xl"><a class="justify-self-center" href="/posts?pub=true">Recent Publications</a></h1>
                <ul>
                {#each data.publications as post}
                    <li>
                        <PostCard {post}/>
                    </li>
                {/each}
                </ul>
                <div class="flex justify-center">
                    <ArrowButton href="/posts?pub=true" text="See More" />
                </div>
            </div>
            <div class="flex flex-col text-center my-4 p-2">
                <h1 class="text-xl text-gray-300 text-xl"><a class="justify-self-center" href="/posts">Recent Posts</a></h1>
                <ul>
                {#each data.posts as post}
                    <li>
                        <PostCard {post}/>
                    </li>
                {/each}
                </ul>
                <div class="flex justify-center">
                    <ArrowButton href="/posts" text="See More" />
                </div>
            </div>
        </div>
    </div>
</div >
