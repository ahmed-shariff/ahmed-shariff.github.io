---
layout: post
comments: true
title: Personal website with nextjs and github pages
tags: ["javascript", "react", "next", "guide"]
tagline: Summery of how I went about setting up my personal website which with markdown blog on github pages using nextjs.
---
I had implemented my personal website using Jekyll and hosted it using github pages. I have been wanting to implement it using react. So I took the leap and spent a weekend porting my old website to use react. While I had worked with react, I've been hearing good things about Next.js. I've been wanting to try Next.js as well for some time now. So I figured I'll use this as an opportunity to learn a little bit of Next.js as well. Googling around how I can get started with using Next.js for a static markdown blog, I came across an article by [Chris Bongers on generating a Next.js markdown blog](https://blog.openreplay.com/creating-a-markdown-blog-powered-by-next-js-in-under-an-hour). This basically shows the steps to setup the markdown blog:

1. Initiate the project with `npm create-next-app .`
2. Setting up [Tailwind CSS](https://tailwindcss.com)
3. Setting up a base layout for the pages (See my [BaseLayout.jsx](https://github.com/ahmed-shariff/ahmed-shariff.github.io/blob/a29f5026a2b8b9726710385abe1c3a6f3eb30ae7/components/BaseLayout.jsx)).
4. Move all my markdown posts and realted images from the old Jekyll implementation.
   - The posts were all placed inside a `posts` directory in the root directory
   - The images were all moved to the directory `public/images` and the paths on the posts were also updated
5. Load and render all Markdown posts with [grey-matter](https://www.npmjs.com/package/gray-matter) and [markdown-it](https://github.com/markdown-it/markdown-it) both on their own pages and also as a list on the home page.

## Deploying using `react-gh-pages`
That allows me to locally run the site with `npm run dev`. But I need to export it to static a site and also figure out how to push it to github so that it can be deployed. I am using [react gh-pages](https://github.com/gitname/react-gh-pages). I followed the instructions there and updated the `project.json` file. That guide shows how to use deploy a react app. To make that compatible with Next.js I had to make the following changes:

1. Update `package.json`: use the `out` directory, make sure the dotfiles are also included and the build also runs `next export` so that the `out` directory is generated.
```json
"scripts": {
...
    "deploy": "gh-pages -d out -t",
...
    "build": "next build && next export",
```
2. To tell github not to use Jekyll, create an empty file named `.nojekyll` in the `public` directory. This file should be in the root of the generated static project. When `next export` is run, it copies all the files in the `public` directory to the `out` directory, hence why it's created there.

This allows me to have the site be deployed in the `gh-pages` branch (plus a fix for image loading, see below) and have the source code in the main branch of the repo.

### Images with `export`

When using `next export` Next.js requires an image loader to be used. At this point I wasn't interested in any of the optimizations, I wanted to load the images as is. Hence, I followed in instructions in the [discussion post in the Next.js repo](https://github.com/vercel/next.js/discussions/19065) and created an [`Image` component](https://github.com/ahmed-shariff/ahmed-shariff.github.io/blob/a29f5026a2b8b9726710385abe1c3a6f3eb30ae7/components/Image.js) to use when loading images. On top of that I had to set the `unoptimized` prop to `true` for it to work.

## Improve markdown rendering

Finally, there were a few other things I had to fix to render Markdown files similar to what I had working with Jekyll.

### Links to other posts

My old implementation linked to other posts using Liquid templates. Here, I used good old fashion regex to find these templates in the content once it's processed by `markdown-it` and replace it with an `<a>` tag:

```js
function replaceJekyllLinks(content) {
    const regex = /\[([^\]]*)\]\((\{\{ *site\.baseurl *\}\})*\{% post_url ([^\s]*) %\}\)/g;
    return content.replace(regex, (text, p1, p2, p3) => {
        return `<a href="${p3}">${p1}</a>`;
    })
}
```

Not the most efficient, but gets the job done.

### Math notation

To get the math notations rendered correctly I wound up using [katex](https://github.com/KaTeX/KaTeX):

1. Follow the [instructions](https://katex.org/docs/autorender.html) from katex and added the CDN links to the base layout I had written (again not efficient, but gets the job done).
2. Configure katex to export only html.
3. Similar to what I had done with links, I used regex replace to find and render any math notations after the markdown is rendered to html and links are processed.

```js
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
```

Who cares about performance....

### Footnotes

I used the [Footnote plug-in](https://github.com/markdown-it/markdown-it-footnote) for `markdown-it`.

### Comments

Previously I had used disqus for comments section in each post. This time around I wanted to use something a little less invasive. I went with [giscus](https://giscus.app). That was fairly easy to set up, just follow the instructions.

The complete code can be found in my [github repo](https://github.com/ahmed-shariff/ahmed-shariff.github.io) ([link to code which is relevant to this post](https://github.com/ahmed-shariff/ahmed-shariff.github.io/blob/a29f5026a2b8b9726710385abe1c3a6f3eb30ae7)).
