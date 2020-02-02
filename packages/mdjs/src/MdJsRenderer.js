/** @typedef {import('commonmark').Node} Node */
/** @typedef {import('./types').MarkdownResult} MarkdownResult */

const { HtmlRenderer } = require('./HtmlRenderer.js');

class MdJsRenderer extends HtmlRenderer {

  /**
   * @override so we can add an id to the headline by default
   *
   * @param {Node} node Current node walking over
   * @param {boolean} entering Entering a node or leaving it?
   */
  heading(node, entering) {
    const tagname = `h${node.level}`;
    if (entering) {
      const attrs = this.attrs(node);
      const id = this.getHeadlineId(node.firstChild.literal);
      if (node.firstChild) {
        attrs.push(['id', id]);
      }
      this.cr();
      this.tag(tagname, attrs);
      this.buffer += `
        <a class="anchor" aria-hidden="true" href="#${id}">
          <svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
            <path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path>
          </svg>
        </a>
      `;
    } else {
      this.tag(`/${tagname}`);
      this.cr();
    }
  }

  /**
   * @override
   *
   * @param {MarkdownResult} mdJsData
   */
  render(mdJsData) {
    const { stories, jsCode, mdAst } = mdJsData;
    const storiesJsCode = stories.map(story => story.codeString).join('\n');
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
        ${storiesJsCode}
        const stories = [${storiesKeys.join(',')}];
        stories.forEach((story, i) => {
          document.getElementById('mdjs-story-' + i).story = story;
        });
      </script>
      <div class="markdown-body">
        ${super.render(mdAst)}
      </div>
    `;
    return html;
  }
}

// const templateStories = [${templateStories.join(',')}];
// templateStories.forEach((template, i) => {
//   render(template, document.getElementById(\`story-$\{i}\`));
// });
// const fnStories = [${fnStories.join(',')}];
// fnStories.forEach((templateFn, i) => {
//   render(templateFn(), document.getElementById(\`fn-story-$\{i}\`));
// });

module.exports = {
  MdJsRenderer,
};
