const visit = require('unist-util-visit');
const { parse: parseJs } = require('@babel/parser');
const { traverse } = require('@babel/core');

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

function mdjsStoryParse({ storyTag = defaultStoryTag, previewStoryTag = defaultPreviewStoryTag } = {}) {
  const stories = [];

  return (tree, file) => {
    // unifiedjs expects node changes to be made on the given node...
    /* eslint-disable no-param-reassign */
    visit(tree, 'code', node => {
      if (node.lang === 'js' && node.meta === 'story') {
        const storyData = extractStoryData(node.value);
        node.type = 'html';
        node.value = storyTag(storyData.name, stories.length);
        stories.push(storyData);
      }
      if (node.lang === 'js' && node.meta === 'preview-story') {
        const storyData = extractStoryData(node.value);
        node.type = 'html';
        node.value = previewStoryTag(storyData.name, stories.length);
        stories.push(storyData);
      }
    });
    // we can only return/modify the tree but stories should not be part of the tree
    // so we attach it globally to the file.data
    file.data.stories = stories;

    return tree;
    /* eslint-enable no-param-reassign */
  }
}

module.exports = {
  mdjsStoryParse
}
