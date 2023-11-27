import { parse, format } from 'fecha';

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

    const sortedPosts = allPosts.then((posts) => posts.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    }));

    return { posts: sortedPosts };
}
