import fs from 'fs';
import matter from 'gray-matter';
import mdOpt from 'markdown-it';
import mf from 'markdown-it-footnote';
import katex from 'katex';
import Giscus from '@giscus/react';
import SlugToDate from '../../components/SlugToDate';


const md = mdOpt({ html: true }).use(mf);

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
            slug,
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

function replaceMath(content) {
    const regex = /\$(.+?)\$/g;
    return content.replace(regex, (text, p1) => {
        return katex.renderToString(p1, {
            block: true,
            throwOnError: false,
            output: 'html'
        });
    });
}

export default function PostPage({ slug,frontmatter, content }) {
    return (
        <div className='prose dark:prose-invert text-justify mx-auto max-w-screen-xl prose-img:block prose-img:m-auto prose-img:max-h-96 prose-p:w-full'>
            <div className='text-xs text-slate-400'>
                <SlugToDate slug={slug}/>
            </div>
            <h1>{frontmatter.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: replaceMath(replaceJekyllLinks(md.render(content))) }} />
            <Giscus
                id="comments"
                repo="ahmed-shariff/ahmed-shariff.github.io"
                repoId="MDEwOlJlcG9zaXRvcnkxMjU3MDU3Nzc="
                category="Announcements"
                categoryId="DIC_kwDOB34eMc4COpxh"
                mapping="pathname"
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="top"
                theme="light"
                lang="en"
                loading="lazy"
                crossorigin="anonymous"
            />
        </div>
    );
}
