/** @typedef {import('./types').MarkdownResult} MarkdownResult */

const { parse: parseJs } = require('@babel/parser');
const { traverse } = require('@babel/core');
const { Node } = require('commonmark');

function extractStoryData(code) {
  const codeAst = parseJs(code, { sourceType: 'module' });
  let key;
  let name;
  traverse(codeAst, {
    ExportNamedDeclaration(path) {
      key = path.node.declaration.declarations[0].id.name;
      // TODO: check if there is an override
      name = key;
    },
  });
  return { key, name, code };
}

function defaultStoryTag(name, i) {
  return `<mdjs-story name="${name}" id="mdjs-story-${i}"></mdjs-story>`;
}

function defaultPreviewStoryTag(name, i) {
  return `<mdjs-preview name="${name}" id="mdjs-story-${i}"></mdjs-preview>`;
}

/**
 * @param {MarkdownResult} data
 * @returns {MarkdownResult}
 */
function processStories(
  data,
  { storyTag = defaultStoryTag, previewStoryTag = defaultPreviewStoryTag } = {},
) {
  const stories = [];

  const walker = data.mdAst.walker();
  let event = walker.next();
  while (event) {
    const { node } = event;
    if (event.entering && node.type === 'code_block') {
      if (node.info === 'js story') {
        const storyData = extractStoryData(node.literal);
        const htmlBlock = new Node('html_block');
        htmlBlock.literal = storyTag(storyData.name, stories.length);
        node.insertAfter(htmlBlock);

        stories.push(storyData);
        node.unlink();
      }
      if (node.info === 'js preview-story') {
        const storyData = extractStoryData(node.literal);
        const htmlBlock = new Node('html_block');
        htmlBlock.literal = previewStoryTag(storyData.name, stories.length);
        node.insertAfter(htmlBlock);

        stories.push(storyData);
        node.unlink();
      }
    }
    event = walker.next();
  }

  return { ...data, stories };
}

module.exports = {
  processStories,
};
