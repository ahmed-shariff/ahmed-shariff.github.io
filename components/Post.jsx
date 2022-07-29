import RoundedBox from './RoundedBox';
import SlugToDate from './SlugToDate';
import TagsList from './Tags';
import { md } from "./markdownHelpers";

export default function Post({ slug, frontmatter, excerpt }) {
    return (
        <RoundedBox key={slug} href={`/post/${slug}`}>
            <div className='p-3 min-h-full prose dark:prose-invert prose-sm max-w-none prose-h1:text-base prose-h1:font-normal'>
                {/* {"socialImage" in frontmatter &&
                                <Image
                                    width={650}
                                    height={340}
                                    alt={frontmatter.title}
                                    src={`/${frontmatter.socialImage}`}
                                />
                            } */}
                <h1>
                    {
                        frontmatter.published === false &&
                        <div className='inline text-red-400'>[DRAFT] </div>
                    }
                    {frontmatter.title}
                </h1>
                <div className='text-xs -mt-2 text-slate-400'>
                    <SlugToDate slug={slug} />
                    <TagsList tags={frontmatter.tags} />
                </div>
                <div className='text-xs '>{frontmatter.tagline}</div>
                {
                    excerpt.length > 0 &&
                    <div
                        dangerouslySetInnerHTML={{ __html: md.render(excerpt) }}></div>
                }
            </div>
        </RoundedBox>
    );
}
