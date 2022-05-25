import * as mdOpt from 'markdown-it';
import { IoMdSchool } from 'react-icons/io';
import RoundedBox from './RoundedBox';
import SlugToDate from './SlugToDate';

/* const md = import('markdown-it');//.then(m => m({html:true})); */
const md = mdOpt({ html: true });

export default function PublicationsList({ slug, frontmatter, excerpt }) {
    return (
        <RoundedBox key={slug} href={`/post/${slug}`}>
            <div className='p-3 grow min-h-full prose dark:prose-invert prose-sm max-w-none prose-h1:text-base prose-h1:font-normal'>
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
                <div className='text-xs -mt-2 text-slate-400 flex flex-wrap gap-x-4'>
                    <div><SlugToDate slug={frontmatter.date} /></div>
                    <div>{frontmatter.venue}</div>
                    <div>{frontmatter.doi}</div>
                </div>
                {
                    excerpt.length > 0 &&
                    <div
                        dangerouslySetInnerHTML={{ __html: md.render(excerpt) }}></div>
                }
            </div>
            <div className='flex h-full bg-slate-500 p-3 content-center items-center '>
                <IoMdSchool className="fill-slate-100" size={20} />
            </div>
        </RoundedBox>
    );
}
