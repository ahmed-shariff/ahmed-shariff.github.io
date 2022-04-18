import fs from 'fs';
import matter from 'gray-matter';
/* import excerpt from 'gray-matter/lib/excerpt'; */
import Image from 'next/image';
import Link from 'next/link';
import * as mdOpt from 'markdown-it';
/* const md = import('markdown-it');//.then(m => m({html:true})); */
const md = mdOpt({ html: true });

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
        .reverse()//.slice(0, 4)
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
        .filter(function({ frontmatter }) { return frontmatter.published !== false; });

    return {
        props: {
            posts
        },
    };
}

export default function Home({ posts }) {
    return (
        <div>
            <div className='prose max-w-none p-0 md:px-20 text-justify'>
                <p className="text-sm m-10">
                    Hey there! Thanks for coming to this obscure corner of the internet to visit my site. This site is work in progress. So be patient, I&apos;ll update here soon.
                </p>

                <h1 className='text-center font-normal text-lg'>Hello there ....</h1>
                <p>I am Ahmed Shariff, in case you didn&apos;t know ;). A tech enthusiast, a believer in the power of technology. My primary interest is in artificial intelligence. Everything about it interests me, from it&apos;s illusive definition, the philosophy behind it, the impact it has and will have on the human race to how it is done and the technicalities of building an intelligence. My current focus is on improving the interactions with immersive technologies.</p>
                <p>Currently, I am a PhD student at the <a href="https://ok.ubc.ca">University of British Columbia - Okanagan</a>, under the supervision of <a href="http://cs.umanitoba.ca/~irani/">Dr Pourang Irani</a> at the Human Computer Interaction Lab.
                </p>
                <p>Previously, I was working at the University of Peradeniya on a industry collaboration project with CodeGen International. The project was started to study and develop AI systems. The focus of my work there was on using deep learning and computer vision technologies to automate various aspects of a restaurant.</p>

                <h4> My digital presence:</h4>
                <ul>
                    <li> <a href="https://github.com/ahmed-shariff">Github </a></li>
                    <li> <a href="https://www.facebook.com/amsha1">Facebook </a></li>
                    <li> <a href="https://twitter.com/_ahmedshariff_">Twitter </a></li>
                    <li> <a href="https://www.linkedin.com/in/ahmed-shariff-b2b25496/">Linkedin </a></li>
                </ul>
            </div>
            <div className='grid grid-cols-1 p-0 md:px-20 mt-10'>
                <h1 className='text-xl text-center'>Blog posts</h1>
                {posts.map(({ slug, frontmatter, excerpt }) => (
                    <div
                        key={slug}
                        className='border border-gray-200 m-2 rounded-xl shadow-lg overflow-hidden flex flex-col text-ellipsis h-500'
                    >
                        <Link href={`/post/${slug}`} className="min-h-full">
                            <a className='min-h-full prose p-3 prose-sm max-w-none prose-h1:text-base prose-h1:font-normal'>
                                {/* {"socialImage" in frontmatter &&
                                <Image
                                    width={650}
                                    height={340}
                                    alt={frontmatter.title}
                                    src={`/${frontmatter.socialImage}`}
                                />
                            } */}
                                <h1>{frontmatter.title}</h1>
                                <div className='text-xs '>{frontmatter.tagline}</div>
                                {
                                    excerpt.length > 0 &&
                                    <div
                                        dangerouslySetInnerHTML={{ __html: md.render(excerpt) }}></div>
                                }
                            </a>
                        </Link>
                    </div>
                ))
                }
            </div >
        </div>
    );
}
