<script>
 import getMD5 from 'md5';

 let gavatarSize = 220;
 let gavatarQueryString = `//en.gravatar.com/avatar/${getMD5("shariff.mfa@outlook.com", {encoding: 'binary'})}?s=${220}&r=pg&d=retro`
    
</script>

<div class='divide-y-4 divide-slate-400/25'>
    <div class='flex flex-col sm:flex-row gap-x-12 m-5 prose dark:prose-invert max-w-none text-justify justify-center'>
        <div class='flex flex-col'>
            <img
                alt='Gravatar for Shariff Faleel'
                src="{gavatarQueryString}"
                height={gavatarSize}
                width={gavatarSize}
            />
            <ul class='list-none w-40 list-outside'>
                <li>
                    Github
                    <!-- <PersonalLinks link="https://github.com/ahmed-shariff" text="Github" iconComponent={<SiGithub />} /> -->
                </li>
                <li>
                    Google scholar
                    <!-- <PersonalLinks link="https://scholar.google.ca/citations?user=wxMtqMMAAAAJ&hl=en" text="Google scholar" iconComponent={<SiGooglescholar />} /> -->
                </li>
                <li>
                    facebook
                    <!-- <PersonalLinks link="https://www.facebook.com/amsha1" text="facebook" iconComponent={<SiFacebook />} /> -->
                </li>
                <li>
                    twitter
                    <!-- <PersonalLinks link="https://twitter.com/_ahmedshariff_" text="Twitter" iconComponent={<SiTwitter />} /> -->
                </li>
                <li>
                    linkedin
                    <!-- <PersonalLinks link="https://www.linkedin.com/in/ahmed-shariff-b2b25496/" text="Linkedin" iconComponent={<SiLinkedin />} /> -->
                </li>
            </ul>
        </div>
        <div>
            <p class="text-xs m-10 bg-gray-900 p-3">
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
