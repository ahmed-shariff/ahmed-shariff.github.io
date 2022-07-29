import { Feed } from 'feed';
import fs from 'fs';
import matter from 'gray-matter';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SiRss } from "react-icons/si";
/* import excerpt from 'gray-matter/lib/excerpt'; */
import PostsList from '../../components/PostsList'
import { slugToDate } from '../../components/SlugToDate';
import { AllTagsList } from '../../components/Tags';

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
        .filter(function ({ frontmatter }) {
            if (process.env.NODE_ENV === "production" && frontmatter.published === false) {
                return false;
            }
            else
                return true;
        });

    // Generate RSS feed
    const feed = new Feed({
        title: "Shariff Faleel",
        description: "My personal feed.",
        id: process.env.SITE_URL,
        link: process.env.SITE_URL,
        language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
        image: "https://s.gravatar.com/avatar/5ebdf4aac1cb0791ce87210238ec9919?s=600",
        favicon: `${process.env.SITE_URL}favicon.ico`,
        copyright: "All rights reserved 2022, John Doe",
        generator: "awesome", // optional, default = 'Feed for Node.js'
        feedLinks: {
            json: `${process.env.SITE_URL}json`,
            atom: `${process.env.SITE_URL}atom`
        },
        author: {
            name: "Shariff Faleel",
            email: "shariff.mfa@outlook.com",
            link: process.env.SITE_URL
        }
    });

    posts.forEach(post => {
        feed.addItem({
            title: post.frontmatter.title,
            id: post.slug,
            link: `${process.env.SITE_URL}post/${post.slug}`,
            description: post.description,
            author: [
                {
                    name: "Shariff Faleel",
                    email: "shariff.mfa@outlook.com",
                    link: process.env.SITE_URL
                }
            ],
            date: slugToDate(post.slug),
            image: post.frontmatter.image
        })
    });

    fs.writeFile("public/posts.xml", feed.rss2(), (err) => {
        if (err)
            console.log(err);
        else {
            console.log("RSS feed written successfully.");
        }
    });
    // END generate RSS feed

    return {
        props: {
            posts
        },
    };
}

export default function Posts({ posts }) {
    const router = useRouter();

    var tags = null;
    var title = "Posts and Publications";
    var publicationsBtnTxt = "Publications Only";
    var publicatoinsBtnQuery = { pub: true };

    if ("tags" in router.query && router.query.tags !== null && router.query.tags !== undefined) {
        tags = router.query.tags;
        if (typeof tags === 'string' || tags instanceof String) {
            tags = [tags];
        }
        posts = posts.filter(({ frontmatter }) => {
            if (frontmatter.tags === null || frontmatter.tags === undefined)
                return false;
            else {
                const res = frontmatter.tags.reduce((prev, curr) => {
                    return tags.includes(curr.toLowerCase()) || prev;
                }, false)
                return res;
            }
        });
    }

    if ("pub" in router.query) {
        title = "Publications";
        publicationsBtnTxt = "All Posts";
        publicatoinsBtnQuery = {};
        posts = posts.filter(({ frontmatter }) => ("doi" in frontmatter));
    }

    const [showTags, setShowTags] = useState(tags === null ? false : true);

    return (
        <div>
            <div className='grid grid-cols-1 p-0 md:px-20 mt-10'>
                <h1 className='text-xl text-center text-slate-100'>{title}</h1>
                <hr className='m-2' />
                <div className='m-2 flex w-100 item-center content-center flex-row'>
                    <button className={"transition duration-100 shadow-none p-1 hover:shadow hover:bg-slate-600 rounded"} onClick={() => setShowTags(!showTags)}>
                        Tags
                        <svg fill="currentColor"
                            viewBox="0 0 20 20"
                            className={`inline w-4 h-4 m-1 transition-transform duration-200 transform md:-mt-1 ${showTags ? "rotate-180" : "rotate-0"}`}>
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                    </button>
                    {
                        tags !== null &&
                        <Link href="/posts"><a className='p-1 inline'>clear <div className='inline text-sm text-slate-900' >({tags.map((el => `#${el}`)).join(",")})</div></a></Link>
                    }
                    <button className={"ml-4 transition duration-100 shadow-none p-1 hover:shadow hover:bg-slate-600 rounded"} onClick={() => router.push({ "pathname": "/posts", "query": publicatoinsBtnQuery })}>
                        {publicationsBtnTxt}
                    </button>
                    <a href='/posts.xml' className='flex items-center flex-grow justify-end px-3'><SiRss size={20} className="fill-slate-500" /></a>
                </div>
                <AllTagsList link className={`mx-2 transition-all duration-200 ${showTags ? "scale-y-100 translate-y-0 opacity-100" : "h-0 scale-y-0 -translate-y-1/2 opacity-0"}`} />
                <PostsList posts={posts} />
            </div >
        </div>
    );
}
