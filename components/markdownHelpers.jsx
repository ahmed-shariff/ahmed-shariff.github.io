import mdOpt from 'markdown-it';
import mf from 'markdown-it-footnote';
import mh from 'markdown-it-highlightjs';
import katex from 'katex';


export function replaceJekyllLinks(content) {
    const regex = /\[([^\]]*)\]\((\{\{ *site\.baseurl *\}\})*\{% post_url ([^\s]*) %\}\)/g;
    return content.replace(regex, (text, p1, p2, p3) => {
        return `<a href="${p3}">${p1}</a>`;
    })
}

export function replaceMath(content) {
    const regex = /\$(.+?)\$/g;
    return content.replace(regex, (text, p1) => {
        return katex.renderToString(p1, {
            block: true,
            throwOnError: false,
            output: 'html'
        });
    });
}

export const md = mdOpt({
    html: true
})
    .use(mf).use(mh, {
        auto: true, code: false, ignoreIllegals: false
    });

