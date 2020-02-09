/** @typedef {import('./src/types').MarkdownResult} MarkdownResult */
/** @typedef {import('./src/types').Story} Story */

const { mdjsParse } = require('./src/mdjsParse.js');
const { mdjsStoryParse } = require('./src/mdjsStoryParse.js');

module.exports = {
  mdjsParse,
  mdjsStoryParse,
};
