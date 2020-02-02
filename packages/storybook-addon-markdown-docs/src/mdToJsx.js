const mdx = require('@mdx-js/mdx');
const mdxToJsx = require('@mdx-js/mdx/mdx-hast-to-jsx');

/**
 * Turns MD into JSX using the MDX compiler. This is necessary because most of the
 * regular storybook docs functionality relies on JSX and MDX specifics
 *
 * @param {string} html
 * @param {string} filepath
 * @returns {Promise<string>}
 */
function mdToJsx(html, filepath) {
  return mdx(
    `import { Story, Preview } from 'storybook-prebuilt/addon-docs/blocks.js';\n\n${html}`,
    {
      compilers: [
        // custom mdx compiler which ensures mdx doesn't add a default export,
        // we don't need it because we are adding our own
        function mdxCompiler() {
          // @ts-ignore
          this.Compiler = tree => mdxToJsx.toJSX(tree, {}, { skipExport: true });
        },
      ],
      filepath,
    },
  );
}

module.exports = { mdToJsx };
