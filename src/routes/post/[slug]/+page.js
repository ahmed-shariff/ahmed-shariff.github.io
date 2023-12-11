import { error } from '@sveltejs/kit';
import { slugToDate } from '$lib/allPosts';
import { format } from 'fecha';

export async function load({ params }) {
    const slug = params.slug;
    const post = await import(`../../../posts/${slug}.md`);

    if (!post) throw error(404);

    const postPath = params.slug.split("/").at(-1).split(".md").at(0);
    const date = format(slugToDate(postPath.slice(0, 10)), "YYYY MMMM D");

    const { title, } = post.metadata;
    const meta = post.metadata;
    const content = post.default;
    const published = post.metadata.published !== undefined && !post.metadata.published;

    return {
        content, title, published, meta, date, slug
    };
}
