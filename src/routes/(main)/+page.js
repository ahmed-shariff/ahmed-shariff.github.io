import { getAllPosts } from "$lib/allPosts";

export function load() {
    return getAllPosts().posts.then((posts) => {
        return {
            publications: posts.filter(post => post.meta.ispub).slice(0, 4),
            posts: posts.filter(post => post.meta.ispub === undefined || !post.meta.ispub).slice(0, 4)
        }
    });
}
