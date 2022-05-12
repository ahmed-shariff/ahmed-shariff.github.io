import Publication from "./Publication";

export default function PublicationsList({ posts }) {
    return (posts.map(({ slug, frontmatter, excerpt }) => {
        if ("doi" in frontmatter)
            return (<Publication slug={slug} frontmatter={frontmatter} excerpt={excerpt} />);
        else
            return null;
    }));
}
