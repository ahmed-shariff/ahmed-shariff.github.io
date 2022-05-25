import Post from './Post';
import Publication from './Publication';

export default function PostsList({ posts }) {
    return (posts.map(({ slug, frontmatter, excerpt }) => {
        if ("doi" in frontmatter)
            return (<Publication key={slug} slug={slug} frontmatter={frontmatter} excerpt={excerpt} />);
        else
            return (<Post key={slug} slug={slug} frontmatter={frontmatter} excerpt={excerpt} />);
    }));
}
