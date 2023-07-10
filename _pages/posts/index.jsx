import { Feed } from 'feed';
import fs from 'fs';
import matter from 'gray-matter';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SiRss } from "react-icons/si";
import ReactPaginate from 'react-paginate';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
/* import excerpt from 'gray-matter/lib/excerpt'; */
import PostsList from '../../components/PostsList'
import { slugToDate } from '../../components/SlugToDate';
import { AllTagsList, tagList } from '../../components/Tags';
import { useEffect } from 'react';
import { NextSeo } from 'next-seo';

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

const paginationLiClassName = 'transition duration-100 bg-transparent shadow-md shadow-transparent rounded-lg hover:shadow-gray-900 hover:bg-gray-700 hover:underline hover:decoration-2 px-2 py-1 mt-1 mx-1 items-center inline-block text-base'

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

    const [tags, setTags] = useState([]);
    const [showTags, setShowTags] = useState(tags === null || tags.length === 0 ? false : true);
    const [ title, setTitle ] = useState("Posts and Publications");
    const [ publicationsBtnTxt, setPublicationsBtnTxt ] = useState("Publications Only");
    const [ pub, setPub ] = useState(false);
    const [ postsOffset, setPostsOffset] = useState(0);
    const [ page, setPage] = useState(0);
    const [ pageCount, setPageCount ] = useState(1);
    const [ currentPosts, setCurrentPosts ] = useState(posts);
    const postsPerPage = 7;

    // Processing query parameters
    useEffect(() => {
        var newTags = []
        if ("tags" in router.query && router.query.tags !== null && router.query.tags !== undefined) {
            newTags = router.query.tags;
            if (typeof newTags === 'string' || newTags instanceof String) {
                if (newTags === "") {
                    newTags = [];
                } else {
                    newTags = [newTags];
                }
            }
        }

        // Test if the provided tags are different from the one already there.
        // take from https://stackoverflow.com/a/19746771/5449891
        newTags = newTags.slice().sort();
        if (tags.length !== newTags.length || !tags.slice().sort().every((value, index) => { value === newTags[index] })) {
            setTags(newTags);
        }

        if ("pub" in router.query) {
            setPub(router.query.pub === "true");
        }

        if ("page" in router.query) {
            setPage(Math.abs(parseInt(router.query.page)) - 1);
        }
    }, [router]);

    useEffect(() => {
        if (pub === true) {
            setTitle("Publications");
            setPublicationsBtnTxt("All Posts");
        } else {
            setTitle("Posts and Publications");
            setPublicationsBtnTxt("Publications Only");
        }
    }, [pub]);

    // Filtering posts.
    useEffect(() => {
        const endOffset = postsOffset + postsPerPage;
        const filteredPosts = posts.filter(({ frontmatter }) => {
            var isValid = true;
            if (tags.length > 0) {
                if (frontmatter.tags === null || frontmatter.tags === undefined)
                    isValid = false;
                else {
                    const res = frontmatter.tags.reduce((prev, curr) => {
                        return tags.includes(curr.toLowerCase()) || prev;
                    }, false)
                    isValid = res;
                }
            }

            if (pub === true && isValid === true && !("doi" in frontmatter)) {
                isValid = false;
            }

            return isValid;
        });
        
        setPageCount(Math.ceil(filteredPosts.length / postsPerPage));
        setCurrentPosts(filteredPosts.slice(postsOffset, endOffset));

    }, [tags, pub, postsOffset]);

    useEffect(() => {
        setPostsOffset(page * postsPerPage);
    }, [page]);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        router.push({ "pathname": "/posts", "query": { page: event.selected + 1 } });
    };

    return (
        <>
            <NextSeo
                title="Posts in Shariff Faleel's website."
                description="List of posts published by Shariff Faleel."
                canonical="https://shariff-faleel.com/posts"
            />
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
                            (tags.length > 0) &&
                            <Link href={{ "pathname": "/posts", "query": { tags: [] } }}>
                                <a className='p-1 inline'>clear <div className='inline text-sm text-slate-900' >({tags.map((el => `#${el}`)).join(",")})</div></a>
                            </Link>
                        }
                        <button className={"ml-4 transition duration-100 shadow-none p-1 hover:shadow hover:bg-slate-600 rounded"} onClick={() => router.push({ "pathname": "/posts", "query": { pub: !pub } })}>
                            {publicationsBtnTxt}
                        </button>
                        <a href='/posts.xml' className='flex items-center flex-grow justify-end px-3'><SiRss size={20} className="fill-slate-500" /></a>
                    </div>
                    <AllTagsList link className={`mx-2 transition-all duration-200 ${showTags ? "scale-y-100 translate-y-0 opacity-100" : "h-0 scale-y-0 -translate-y-1/2 opacity-0"}`} />
                    <PostsList posts={currentPosts} />
                    <div className='flex place-content-center m-2 text-stone-200 bg-gray-800'>
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel={<BiChevronRight size={30} className="fill-stone-200" />}
                            onPageChange={handlePageClick}
                            forcePage={page}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
                            previousLabel={<BiChevronLeft size={30} className="fill-stone-200" />}
                            renderOnZeroPageCount={null}
                            containerClassName="items-stretch justify-center inline-flex items"
                            pageLinkClassName={paginationLiClassName}
                            previousLinkClassName={paginationLiClassName}
                            nextLinkClassName={paginationLiClassName}
                            breakLinkClassName={paginationLiClassName}
                            activeLinkClassName="bg-gray-600"
                        />
                    </div>
                </div >
            </div>
        </>
    );
}
