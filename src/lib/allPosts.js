import { parse, format } from 'fecha';
import { dev } from '$app/environment';

export function slugToDate(slug) {
    return parse(slug.substring(0, 10), "YYYY-MM-DD");
}

export function getAllPosts() {
    const allPostFiles = import.meta.glob('/src/posts/*.md');
    const iterablePostFiles = Object.entries(allPostFiles);

    const allPosts = Promise.all(
        iterablePostFiles.map(async ([path, resolver]) => {
            const { metadata } = await resolver();
            const postPath = path.split("/").at(-1).split(".md").at(0);
            const date = format(slugToDate(postPath.slice(0, 10)), "MMMM D, YYYY");

            return {
                meta: metadata,
                path: postPath,
                date: date
            };
        })
    );

    const filteredPosts = allPosts.then((posts) => posts.filter(post => (dev || post.meta.published === undefined || post.meta.publised)));

    const sortedPosts = filteredPosts.then((posts) => posts.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    }));

    const tags = sortedPosts.then((posts) => {
        const tagsList = posts.map(post => post.meta.tags);
        const filteredTags = tagsList.filter(tags => tags !== undefined).flat();
        return [...new Set(filteredTags)].filter(tag => tag !== null);
    });

    return { posts: sortedPosts, tags: tags };
}
