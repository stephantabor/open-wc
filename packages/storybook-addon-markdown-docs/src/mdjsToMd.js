/** @typedef {import('@mdjs/core').MarkdownResult} MarkdownResult */

const unified = require('unified');
const markdown = require('remark-parse');
const mdSlug = require('remark-slug');
const mdStringify = require('remark-html');
const detab = require('detab');
const u = require('unist-builder');

const { mdjsParse, mdjsStoryParse } = require('@mdjs/core');

function code(h, node) {
  const value = node.value ? detab(node.value) : '';
  const raw = ['', `\`\`\`${node.lang}`, value, '```'].join('\n');
  return h.augment(node, u('raw', raw));
}

/**
 * @param {string} markdownText
 * @returns {Promise<MarkdownResult>}
 */
async function mdjsToMd(markdownText) {
  const parser = unified()
    .use(markdown)
    .use(mdjsParse)
    .use(mdjsStoryParse, {
      storyTag: name => `<Story name="${name}"></Story>`,
      previewStoryTag: name => `<Preview><Story name="${name}"></Story></Preview>`,
    })
    .use(mdSlug)
    .use(mdStringify, {
      handlers: {
        code,
      },
    });
  const result = await parser.process(markdownText);

  return {
    html: result.contents,
    jsCode: result.data.jsCode,
    stories: result.data.stories,
  };
}

module.exports = { mdjsToMd };
