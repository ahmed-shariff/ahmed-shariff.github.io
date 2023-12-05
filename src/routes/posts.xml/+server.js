import { getAllPosts } from '$lib/allPosts'
import { Feed } from 'feed';

export async function GET() {
    let posts = await getAllPosts();
    posts = await posts.posts;
    // Generate RSS feed
    const feed = new Feed({
        title: "Shariff AM Faleel",
        description: "My personal feed.",
        id: process.env.SITE_URL,
        link: process.env.SITE_URL,
        language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
        image: "https://s.gravatar.com/avatar/5ebdf4aac1cb0791ce87210238ec9919?s=600",
        favicon: `${process.env.SITE_URL}favicon.ico`,
        copyright: "All rights reserved 2023, Shariff Faleel",
        generator: "awesome", // optional, default = 'Feed for Node.js'
        feedLinks: {
            json: `${process.env.SITE_URL}json`,
            atom: `${process.env.SITE_URL}atom`
        },
        author: {
            name: "Shariff AM Faleel",
            email: "shariff.mfa@outlook.com",
            link: process.env.SITE_URL
        }
    });

    posts.forEach(post => {
        feed.addItem({
            title: post.meta.title,
            id: post.slug,
            link: `${process.env.SITE_URL}post/${post.slug}`,
            description: post.meta.description,
            author: [
                {
                    name: "Shariff Faleel",
                    email: "shariff.mfa@outlook.com",
                    link: process.env.SITE_URL
                }
            ],
            date: post.date,
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
