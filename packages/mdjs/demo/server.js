const unified = require('unified');
const markdown = require('remark-parse');
const remark2rehype = require('remark-rehype');
const raw = require('rehype-raw');
const htmlStringify = require('rehype-stringify');
const htmlSlug = require('rehype-slug');
const htmlHeading = require('rehype-autolink-headings');

const { mdjsParse, mdjsStoryParse } = require('../index.js');

module.exports = {
  nodeResolve: true,
  open: 'packages/mdjs/demo/README.md',
  watch: true,
  responseTransformers: [
    async function mdJsTransformer({ url, body }) {
      if (url.endsWith('.md')) {
        const parser = unified()
          .use(markdown)
          .use(mdjsParse)
          .use(mdjsStoryParse)
          .use(remark2rehype, { allowDangerousHTML: true })
          .use(raw)
          .use(htmlSlug)
          .use(htmlHeading)
          .use(htmlStringify);
        const result = await parser.process(body);

        const { stories, jsCode } = result.data;
        const storiesCode = stories.map(story => story.code).join('\n');
        const storiesKeys = stories.map(story => story.key);

        const html = `
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="/node_modules/github-markdown-css/github-markdown.css">
          <style>
            .markdown-body {
              box-sizing: border-box;
              min-width: 200px;
              max-width: 980px;
              margin: 0 auto;
              padding: 45px;
              border: 1px solid #e1e4e8;
              border-bottom-right-radius: 2px;
              border-bottom-left-radius: 2px;
            }
    
            @media (max-width: 767px) {
              .markdown-body {
                padding: 15px;
              }
            }
          </style>
          <script type="module">
            import '/packages/mdjs/mdjs-story.js';
            ${jsCode}
            ${storiesCode}
            const stories = [${storiesKeys.join(',')}];
            stories.forEach((story, i) => {
              document.getElementById('mdjs-story-' + i).story = story;
            });
          </script>
          <div class="markdown-body">
            ${result.contents}
          </div>
        `;
        return {
          body: html,
          contentType: 'text/html',
        };
      }
      return null;
    },
  ],
};
