/** @typedef {import('@mdjs/core').MarkdownResult} MarkdownResult */

const { parse } = require('@babel/parser');
const { mdToCsf } = require('./mdToCsf');

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
 * @param {string} markdown
 */
function mdjsToMd(markdown) {
  const parser = new Parser({
    processStories: {
      storyTag: name => `<Story name="${name}"></Story>`,
      previewStoryTag: name => `<Preview><Story name="${name}"></Story></Preview>`,
    },
  });
  return parser.parse(markdown);
}

/**
 * @param {MarkdownResult} markdownResult
 */
function mdToPartialHtml(markdownResult) {
  return new KeepCodeBlocksHtmlRenderer().render(markdownResult.mdAst);
}

/**
 * @param {string} filePath
 * @param {string} markdown
 */
async function mdjsToCsf(filePath, markdown) {
  const markdownResult = mdjsToMd(markdown);
  markdownResult.jsAst = parse(markdownResult.jsCode, { sourceType: 'module' });
  markdownResult.html = mdToPartialHtml(markdownResult);

  return mdToCsf(filePath, markdownResult);
}

module.exports = {
  mdjsToCsf,
  // exports for testing only
  mdjsToMd,
  mdToPartialHtml,
};
