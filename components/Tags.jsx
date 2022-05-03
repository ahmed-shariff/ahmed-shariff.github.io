import Link from "next/link";

export const tagList = {
    'oculus': "text-gray-400",
    'vr': "text-gray-400",
    'guide': "text-gray-400",
    'javascript': "text-gray-400",
    'react': "text-gray-400",
    'next': "text-gray-400",
    'course': "text-gray-400",
    'hci': "text-gray-400",
    'emacs': "text-gray-400",
    'org': "text-gray-400",
    'machine learning': "text-gray-400",
    'deep learning': "text-gray-400",
    'nlp': "text-gray-400",
    'random thoughts': "text-gray-400"
}

// FIXME: Very questionable way of testing.......
export function TestTags(tags) {
    const unlistedTags = new Set();
    tags.map((tags) => {
        if (Array.isArray(tags)) {
            tags.forEach((tag) => {
                if (!(tag.toLowerCase() in tagList)) {
                    unlistedTags.add(tag);
                }
            })
        } else if (typeof tags === 'string' || tags instanceof String) {
            if (!(tag.toLowerCase() in tagList)) {
                unlistedTags.add(tags);
            }
        } // don't care about others
    });

    if (unlistedTags.size > 0) {
        console.log("Unlisted tags:", unlistedTags);
        throw new Error(`There are unlisted tags`);
    }
}

export function Tag({tag, link}) {
    tag = tag.toLowerCase();

    if (link) {
        return (
            <Link href={{ "pathname": "/posts", "query": { tags: tag } }} ><a className={`${tagList[tag]}`}>{`#${tag}`}</a></Link >
        );
    } else {
        return (
            <div className={`${tagList[tag]}`}>{`#${tag}`}</div>
        );
    }
}

export function AllTagsList({ className, link }) {
    return (
        <TagsList tags={Object.keys(tagList)} className={className} link={link}/>
    );
}

export default function TagsList({ tags, className, link }) {
    if (tags === null || tags === undefined) {
        return "";
    }

    return (
        <div className={`${className} flex space-x-1`}>
            {
                tags.map((tag, index) => <Tag key={index} tag={tag} link={link} />)
            }
        </div>
    );
}
