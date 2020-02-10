const visit = require('unist-util-visit');
const { init, parse } = require('es-module-lexer');

function extractStoryData(code) {
  const parsed = parse(code);
  const key = parsed[1][0];
  const name = key;
  return { key, name, code };
}

function defaultStoryTag(name, i) {
  return `<mdjs-story name="${name}" id="mdjs-story-${i}"></mdjs-story>`;
}

function defaultPreviewStoryTag(name, i) {
  return `<mdjs-preview name="${name}" id="mdjs-story-${i}"></mdjs-preview>`;
}

function mdjsStoryParse({
  storyTag = defaultStoryTag,
  previewStoryTag = defaultPreviewStoryTag,
} = {}) {
  const stories = [];

  return async (tree, file) => {
    // unifiedjs expects node changes to be made on the given node...
    /* eslint-disable no-param-reassign */
    await init;
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
  };
}

module.exports = {
  mdjsStoryParse,
};
