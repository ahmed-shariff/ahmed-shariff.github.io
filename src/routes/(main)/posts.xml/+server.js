export const prerender = true;

import { getAllPosts } from '$lib/allPosts'
import { parse } from 'fecha';
import { Feed } from 'feed';

const base_url = "https://shariff-faleel.com"

export async function GET() {
    let posts = await getAllPosts();
    posts = await posts.posts;
    // Generate RSS feed
    const feed = new Feed({
        title: "Shariff AM Faleel",
        description: "My personal feed.",
        id: base_url,
        link: base_url,
        language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
        image: "https://s.gravatar.com/avatar/5ebdf4aac1cb0791ce87210238ec9919?s=600",
        favicon: `${base_url}/favicon.png`,
        copyright: "All rights reserved 2023, Shariff Faleel",
        generator: "awesome", // optional, default = 'Feed for Node.js'
        author: {
            name: "Shariff AM Faleel",
            email: "shariff.mfa@outlook.com",
            link: base_url
        }
    });

    posts.forEach(post => {
        feed.addItem({
            title: post.meta.title,
            id: post.slug,
            link: `${base_url}/post/${post.slug.slice(0, -3)}`,
            description: post.meta.description,
            author: [
                {
                    name: "Shariff Faleel",
                    email: "shariff.mfa@outlook.com",
                    link: base_url
                }
            ],
            date: parse(post.date, "YYYY MMMM D"),
            image: post.meta.image
        })
    });

    const options = {
        headers: {
            'Cache-Control': 'max-age=0, s-maxage=3600',
            'Content-Type': 'application/xml'
        }
    };

    const body = feed.rss2();

    return new Response(body, options);
}
