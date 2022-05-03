import fs from 'fs';
import matter from 'gray-matter';
import { useRouter } from 'next/router';
/* import excerpt from 'gray-matter/lib/excerpt'; */
import PostsList from '../../components/PostsList'

// returns the first 4 lines of the contents
// function firstLine(file, options) {
//     excerpt(file, { excerpt: true })
//     if (file.excerpt.length === 0) {
//         file.excerpt = file.content
//                            .split('\n')
//                            // .filter(line => !(line.trimStart().startsWith("<") || line.trimStart().startsWith("![")))
//                            .slice(0, 1)
//                            .join(' ');
//         console.log("booo");
//     }
//     console.log(file.excerpt)
// }

export async function getStaticProps() {
    const files = fs.readdirSync('posts');
    var posts = files
        .reverse()//.slice(0, 4)
        .map((fileName) => {
            const slug = fileName.replace('.md', '');
            const readFile = fs.readFileSync(`posts/${fileName}`, 'utf-8');
            const { data: frontmatter, excerpt } = matter(readFile, { excerpt: false });
            return {
                slug,
                frontmatter,
                excerpt
            };
        })
        .filter(function({ frontmatter }) { return frontmatter.published !== false; });

    return {
        props: {
            posts
        },
    };
}

export default function Posts({ posts }) {
    const router = useRouter();

    if ("tags" in router.query && router.query.tags !== null && router.query.tags !== undefined) {
        var tags = router.query.tags;
        if (typeof tags === 'string' || tags instanceof String) {
            tags = [tags];
        }
        posts = posts.filter(({ frontmatter }) => {
            if (frontmatter.tags === null || frontmatter.tags === undefined)
                return false;
            else {
                const res = frontmatter.tags.reduce((prev, curr) => {
                    return tags.includes(curr) || prev;
                }, false)
                return res;
            }
        });
    }

    return (
        <div>
            <div className='grid grid-cols-1 p-0 md:px-20 mt-10'>
                <h1 className='text-xl text-center text-slate-100'>Blog posts</h1>
                <PostsList posts={posts} />
            </div >
        </div>
    );
}
