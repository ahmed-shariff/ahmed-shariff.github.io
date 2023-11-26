import { error } from '@sveltejs/kit';

export async function load({ params }) {
    const post = await import(`../../../posts/${params.slug}.md`);

    if (!post) throw error(404);

    const { title, } = post.metadata;
    const content = post.default;

    return {
        content, title
    };
}
