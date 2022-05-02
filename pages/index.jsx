import fs from 'fs';
import React from 'react';
import matter from 'gray-matter';
import { useRouter } from 'next/router'
/* import excerpt from 'gray-matter/lib/excerpt'; */
import Image from '../components/image';
import { SiFacebook, SiGithub, SiGooglescholar, SiLinkedin, SiTwitter } from "react-icons/si";
import Gravatar from 'react-gravatar';
import PostsList from '../components/PostsList'
import ArrowButon from '../components/ArrowButon';
/* const md = import('markdown-it');//.then(m => m({html:true})); */

// returns the first 4 lines of the contents
// function firstLine(file, options) {
//     excerpt(file, { excerpt: true })
//     if (file.excerpt.length === 0) {
//         file.excerpt = file.content
//                            .split('\n')
//                            // .filter(line => !(line.trimStart().startsWith("<") || line.trimStart().startsWith("![")))
//                            .slice(0, 1)
//                            .join(' ');
//         console.log("booo");
//     }
//     console.log(file.excerpt)
// }

export async function getStaticProps() {
    const files = fs.readdirSync('posts');

    var posts = files
        .reverse()
        .map((fileName) => {
            const slug = fileName.replace('.md', '');
            const readFile = fs.readFileSync(`posts/${fileName}`, 'utf-8');
            const { data: frontmatter, excerpt } = matter(readFile, { excerpt: false });
            return {
                slug,
                frontmatter,
                excerpt
            };
        })
        .filter(function({ frontmatter }) { return frontmatter.published !== false; })
        .slice(0, 5);

    return {
        props: {
            posts
        },
    };
}

function PersonalLinks({link, text, iconComponent}) {
    return (
        <a className='flex items-center space-x-3 text-sky-400' href={link}>
            <div>
                {iconComponent}
            </div>
            <div>
                {text}
            </div>
        </a>
    )
}

export default function Home({ posts }) {
    const router = useRouter();

    return (
        <React.Fragment>
            <div className='flex flex-row  space-x-12 prose dark:prose-invert max-w-none text-justify'>
                <div className='flex-auto text-sm'>
                    <Gravatar className='rounded-full' email='shariff.mfa@outlook.com' size={400} />
                    <ul className='list-none w-40 list-outside'>
                        <li>
                            <PersonalLinks link="https://github.com/ahmed-shariff" text="Github" iconComponent={<SiGithub />} />
                        </li>
                        <li>
                            <PersonalLinks link="https://scholar.google.ca/citations?user=wxMtqMMAAAAJ&hl=en" text="Google scholar" iconComponent={<SiGooglescholar />} />
                        </li>
                        <li>
                            <PersonalLinks link="https://www.facebook.com/amsha1" text="facebook" iconComponent={<SiFacebook />} />
                        </li>
                        <li>
                            <PersonalLinks link="https://twitter.com/_ahmedshariff_" text="Twitter" iconComponent={<SiTwitter />} />
                        </li>
                        <li>
                            <PersonalLinks link="https://www.linkedin.com/in/ahmed-shariff-b2b25496/" text="Linkedin" iconComponent={<SiLinkedin />} />
                        </li>
                    </ul>
                </div>
                <div className='flex-auto'>
                    <p className="text-sm m-10">
                        Hey there! Thanks for coming to this obscure corner of the internet to visit my site. This site is work in progress. So be patient, I&apos;ll update here soon.
                    </p>

                    <h1 className='text-center font-normal text-lg'>Hello there ....</h1>
                    <p>I am Ahmed Shariff, in case you didn&apos;t know ;). A tech enthusiast, a believer in the power of technology. My primary interest is in artificial intelligence. Everything about it interests me, from it&apos;s illusive definition, the philosophy behind it, the impact it has and will have on the human race to how it is done and the technicalities of building an intelligence. My current focus is on improving the interactions with immersive technologies.</p>
                    <p>Currently, I am a PhD student at the <a href="https://ok.ubc.ca">University of British Columbia - Okanagan</a>, under the supervision of <a href="http://cs.umanitoba.ca/~irani/">Dr Pourang Irani</a> at the Human Computer Interaction Lab.
                    </p>
                    <p>Previously, I was working at the University of Peradeniya on a industry collaboration project with CodeGen International. The project was started to study and develop AI systems. The focus of my work there was on using deep learning and computer vision technologies to automate various aspects of a restaurant.</p>
                </div>
            </div>
            <div className='grid grid-cols-1 mt-10'>
                <h1 className='text-xl text-center text-gray-300'> Recent posts </h1>
                <PostsList posts={posts} />
                <div className="justify-self-center p-2">
                    <ArrowButon text={"See More"} onClick={() => router.push("/posts")} />
                </div>
            </div >
        </React.Fragment>
    );
}
