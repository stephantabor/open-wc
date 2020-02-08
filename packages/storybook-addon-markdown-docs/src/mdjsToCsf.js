const { mdjsToMd } = require('./mdjsToMd');
const { renameDefaultExport } = require('./renameDefaultExport');
const { createStoriesCode } = require('./createStoriesCode');
const { mdToJsx } = require('./mdToJsx');
const { jsxToJs } = require('./jsxToJs');

/**
 * @param {string} filePath
 * @param {string} markdown
 * @returns {Promise<string>}
 */
async function mdjsToCsf(filePath, markdown) {
  const markdownResult = mdjsToMd(filePath, markdown);

  const jsCode = renameDefaultExport(markdownResult.jsCode);
  const storiesCode = createStoriesCode(markdownResult.stories);
  const docsJsx = await mdToJsx(filePath, markdownResult);
  const docs = await jsxToJs(docsJsx, filePath);

  return `${jsCode}\n${storiesCode}\n${docs}`;
}

module.exports = {
  mdjsToCsf,
};
