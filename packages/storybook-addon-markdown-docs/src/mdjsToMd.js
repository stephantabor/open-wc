/** @typedef {import('@mdjs/core').MarkdownResult} MarkdownResult */

const { Parser } = require('../../mdjs/index.js');
const { HtmlRenderer } = require('../../mdjs/index.js');

class KeepCodeBlocksHtmlRenderer extends HtmlRenderer {
  // eslint-disable-next-line camelcase
  code_block(node) {
    this.cr();
    this.lit(`\n\`\`\`${node.info}\n`);
    this.lit(`${node.literal}\`\`\`\n`);
    this.cr();
  }
}

/**
 * @param {MarkdownResult} markdownResult
 */
function mdToPartialHtml(markdownResult) {
  return new KeepCodeBlocksHtmlRenderer().render(markdownResult.mdAst);
}

/**
 * @param {string} markdown
 * @returns {MarkdownResult}
 */
function mdjsToMd(markdown) {
  const parser = new Parser({
    processStories: {
      storyTag: name => `<Story name="${name}"></Story>`,
      previewStoryTag: name => `<Preview><Story name="${name}"></Story></Preview>`,
    },
  });
  const markdownResult = parser.parse(markdown);
  markdownResult.html = mdToPartialHtml(markdownResult);

  return markdownResult;
}

module.exports = { mdjsToMd };
