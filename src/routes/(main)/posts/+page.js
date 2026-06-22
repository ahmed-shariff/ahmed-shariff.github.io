import { getAllPosts } from "$lib/allPosts";

export async function load() {
    return await getAllPosts();
}
