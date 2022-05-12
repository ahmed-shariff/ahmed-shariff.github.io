import * as mdOpt from 'markdown-it';
import RoundedBox from './RoundedBox';
import SlugToDate from './SlugToDate';

/* const md = import('markdown-it');//.then(m => m({html:true})); */
const md = mdOpt({ html: true });

export default function PublicationsList({ slug, frontmatter, excerpt }) {
    return (
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
                <div className='text-xs -mt-2' dangerouslySetInnerHTML={{ __html: md.render(frontmatter.authors) }} />
                <div className='text-xs -mt-2 text-slate-400 flex flex-row space-x-4'>
                    <div><SlugToDate slug={frontmatter.date} /></div>
                    <div>{frontmatter.venue}</div>
                    <a href={frontmatter.paperurl}>{frontmatter.doi}</a>
                </div>
                {
                    excerpt.length > 0 &&
                    <div
                        dangerouslySetInnerHTML={{ __html: md.render(excerpt) }}></div>
                }
            </div>
        </RoundedBox>
    );
}
