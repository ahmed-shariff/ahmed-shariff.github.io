import fs from 'fs';
import matter from 'gray-matter';
import mdOpt from 'markdown-it';

const md = mdOpt({ html: true });

export async function getStaticPaths() {
    const files = fs.readdirSync('posts');
    const paths = files.map((fileName) => ({
        params: {
            slug: fileName.replace('.md', ''),
        },
    }));
    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params: { slug } }) {
    const fileName = fs.readFileSync(`posts/${slug}.md`, 'utf-8');
    const { data: frontmatter, content } = matter(fileName);
    return {
        props: {
            frontmatter,
            content,
        },
    };
}

function replaceJekyllLinks(content) {
    const regex = /\[([^\]]*)\]\((\{\{ *site\.baseurl *\}\})*\{% post_url ([^\s]*) %\}\)/g;
    return content.replace(regex, (text, p1, p2, p3) => {
        return `<a href="${p3}">${p1}</a>`;
    })
}

export default function PostPage({ frontmatter, content }) {
    return (
        <div className='prose text-justify mx-auto max-w-screen-xl prose-img:block prose-img:m-auto prose-img:max-h-96 prose-p:w-full'>
            <h1>{frontmatter.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: replaceJekyllLinks(md.render(content)) }} />
        </div>
    );
}
