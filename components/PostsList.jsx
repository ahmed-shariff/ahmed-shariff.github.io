import Post from './Post';
import Publication from './Publication';

export default function PostsList({ posts }) {
    return (posts.map(({ slug, frontmatter, excerpt }) => {
        if ("doi" in frontmatter)
            return (<Publication slug={slug} frontmatter={frontmatter} excerpt={excerpt} />);
        else
            return (<Post slug={slug} frontmatter={frontmatter} excerpt={excerpt} />);
    }));
}
