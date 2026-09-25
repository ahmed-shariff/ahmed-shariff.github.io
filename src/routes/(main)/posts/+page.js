import { getAllPosts } from "$lib/allPosts";

export async function load() {
    const { posts, tags } = getAllPosts();

    return {
        posts: await posts,
        tags: await tags
    };
}
