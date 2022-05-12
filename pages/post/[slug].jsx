import fs from 'fs';
import matter from 'gray-matter';
import Giscus from '@giscus/react';
import SlugToDate from '../../components/SlugToDate';
import TagsList from '../../components/Tags';
import { md, replaceJekyllLinks, replaceMath } from '../../components/markdownHelpers';

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

function Information({keyStr, valueStr}) {
    return (
        <div className='flex space-x-4 mt-2'>
            <div className='text-gray-400'>{keyStr}:</div>
            <div className='prose-p:m-0'>{valueStr}</div>
        </div>
    );
}


function PublicationPage({ frontmatter, content }) {
    return (
        <div className='prose dark:prose-invert text-justify mx-auto max-w-screen-xl prose-img:block prose-img:m-auto prose-img:max-h-96 prose-p:w-full'>
            <h1>{frontmatter.title}</h1>
            <Information keyStr="Journal" valueStr={frontmatter.type} />
            <Information
                keyStr="Authors"
                valueStr={(<div dangerouslySetInnerHTML={{ __html: md.render(frontmatter.authors) }} />)} />
            <Information keyStr="Venue" valueStr={frontmatter.venue} />
            <Information keyStr="Date of publication" valueStr={<SlugToDate slug={frontmatter.date} />} />
            <Information keyStr="URL" valueStr={(<a href={frontmatter.paperurl}>{frontmatter.doi}</a>)} />
            <Information
                keyStr="Abstract"
                valueStr={(<div dangerouslySetInnerHTML={{ __html: replaceMath(replaceJekyllLinks(md.render(frontmatter.abstract))) }} />)} />

            <Information
                keyStr="Citation"
                valueStr={(<div dangerouslySetInnerHTML={{ __html: replaceMath(md.render(frontmatter.citation)) }} />)} />


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
        </div >
    );
}


function PostPage({ slug, frontmatter, content }) {
    return (
        <div className='prose dark:prose-invert text-justify mx-auto max-w-screen-xl prose-img:block prose-img:m-auto prose-img:max-h-96 prose-p:w-full'>
            <div className='text-xs text-slate-400'>
                <SlugToDate slug={slug} />
                <TagsList tags={frontmatter.tags} link />
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

export default function Page({slug, frontmatter, content}) {
    if ("doi" in frontmatter) {
        return (<PublicationPage frontmatter={frontmatter} content={content} />);
    } else {
        return (<PostPage slug={slug} frontmatter={frontmatter} content={content} />);
    }
}
