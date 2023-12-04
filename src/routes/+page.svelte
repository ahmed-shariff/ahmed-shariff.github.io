<script>
 import getMD5 from 'md5';
 import { siGithub, siGooglescholar, siFacebook, siTwitter, siLinkedin } from 'simple-icons';
 import PersonalLink from '$lib/PersonalLink.svelte';

 let gavatarSize = 220;
 let gavatarQueryString = `//en.gravatar.com/avatar/${getMD5("shariff.mfa@outlook.com", {encoding: 'binary'})}?s=${gavatarSize}&r=pg&d=retro`
</script>

<div class='divide-y-4 divide-slate-400/25'>
    <div class='flex flex-col sm:flex-row gap-x-12 m-1 prose dark:prose-invert max-w-none text-justify justify-center'>
        <div class='flex flex-col space-y-1 items-center'>
            <img
                alt='Gravatar for Shariff Faleel'
                src="{gavatarQueryString}"
                height={gavatarSize}
                width={gavatarSize}
            />
            <ul class='list-none w-40 list-outside text-sm pl-3'>
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
                    <PersonalLink link="https://www.linkedin.com/in/ahmed-shariff-b2b25496/" text="Linkedin" icon={siLinkedin} />
                </li>
            </ul>
        </div>
        <div class="p-2">
            <p class="m-4 bg-gray-900 p-3">
        Hey there! Thanks for coming to this obscure corner of the internet to visit my site. This site is work in progress. So be patient, I&apos;ll update here soon.
            </p>

            <h1 class='text-center font-normal text-lg'>Hello there ....</h1>
            <p>I am Ahmed Shariff, in case you didn&apos;t know ;). A tech enthusiast, a believer in the power of technology. My primary interest is on artificial intelligence. Everything about it interests me, from it&apos;s illusive definition, the philosophy behind it, the impact it has and will have on the human race to how it is done and the technicalities of building an intelligence. My current focus is on improving the interactions with immersive technologies.</p>
            <p>Currently, I am a PhD student at the <a href="https://ok.ubc.ca">University of British Columbia - Okanagan</a>, under the supervision of <a href="http://cs.umanitoba.ca/~irani/">Dr Pourang Irani</a> at the Human Computer Interaction Lab.
            </p>
            <p>Previously, I was working at the University of Peradeniya on an industry collaboration project with CodeGen International. The project was started to study and develop AI systems. During my time there I worked on automating various aspects of a restaurant with deep learning and computer vision.</p>
        </div>
    </div>
</div >
