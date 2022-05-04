import fs from 'fs';
import matter from 'gray-matter';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
/* import excerpt from 'gray-matter/lib/excerpt'; */
import PublicationsList from '../../components/PublicationsList'
import { AllTagsList } from '../../components/Tags';

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
    const files = fs.readdirSync('publications');
    var publications = files
        .reverse()//.slice(0, 4)
        .map((fileName) => {
            const slug = fileName.replace('.md', '');
            const readFile = fs.readFileSync(`publications/${fileName}`, 'utf-8');
            const { data: frontmatter, excerpt } = matter(readFile, { excerpt: false });
            return {
                slug,
                frontmatter,
                excerpt
            };
        })

    return {
        props: {
            publications
        },
    };
}

export default function Publications({ publications }) {
    return (
        <div>
            <div className='grid grid-cols-1 p-0 md:px-20 mt-10'>
                <h1 className='text-xl text-center text-slate-100'>Publications</h1>
                <hr className='m-2' />
                <PublicationsList publications={publications} />
            </div >
        </div>
    );
}
