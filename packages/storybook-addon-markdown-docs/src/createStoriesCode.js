/** @typedef {import('@mdjs/core').Story} Story */

/**
 * @param {Story[]} stories
 * @returns {string}
 */
function createStoriesCode(stories) {
  let code = '';
  for (const story of stories.slice().reverse()) {
    const { key, name, displayedCode } = story;
    code += displayedCode;
    code +=
      `${key}.story = ${key}.story || {};\n` +
      `${name ? `${key}.story.name = ${JSON.stringify(name)};` : ''}\n` +
      `${key}.story.parameters = ${key}.story.parameters || {};\n` +
      `${key}.story.parameters.mdxSource = ${JSON.stringify(displayedCode.trim())};\n`;
  }
  return code;
}

module.exports = {
  createStoriesCode,
};
