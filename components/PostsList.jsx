import * as mdOpt from 'markdown-it';
import RoundedBox from './RoundedBox';

/* const md = import('markdown-it');//.then(m => m({html:true})); */
const md = mdOpt({ html: true });

export default function PostsList({ posts }) {
    return (posts.map(({ slug, frontmatter, excerpt }) => (
        <RoundedBox key={slug} href={`/post/${slug}`}>
            <div className='min-h-full prose dark:prose-invert prose-sm max-w-none prose-h1:text-base prose-h1:font-normal'>
                {/* {"socialImage" in frontmatter &&
                                <Image
                                    width={650}
                                    height={340}
                                    alt={frontmatter.title}
                                    src={`/${frontmatter.socialImage}`}
                                />
                            } */}
                <h1>{frontmatter.title}</h1>
                <div className='text-xs '>{frontmatter.tagline}</div>
                {
                    excerpt.length > 0 &&
                    <div
                        dangerouslySetInnerHTML={{ __html: md.render(excerpt) }}></div>
                }
            </div>
        </RoundedBox>
    )));
}
