/** @typedef {import('./types').Story} Story */
/** @typedef {import('./types').MarkdownResult} MarkdownResult */

// import traverse from '@babel/traverse';
const { Parser: CmParser } = require('commonmark');
const merge = require('deepmerge')
const { processJs } = require('./processJs.js');
const { processStories } = require('./processStories.js');
// import { HtmlRenderer } from './HtmlRenderer.js';

class Parser {
  constructor(options = {}) {
    this.cmParser = new CmParser();
    this.options = merge({
      // defaultProcessors: [
      //   processJs,
      //   processStories
      // ],
      processStories: {}
    }, options);
  }

  /**
   * Converts a string into an object with
   *
   * @param {string} source
   * @returns {MarkdownResult}
   */
  parse(source) {
    /** @type {MarkdownResult} */
    let data = {
      mdAst: this.cmParser.parse(source),
    };
    data = processJs(data);
    data = processStories(data, this.options.processStories);

    // const jsAst = parseJs(data.jsCode, { sourceType: 'module' });
    // traverse(jsAst, {
    //   ImportDeclaration(path) {
    //     path.scope.rename(path.node.specifiers[0].local.name, 'IngInput');
    //     path.node.specifiers[0].imported.name = 'IngInput';
    //     path.node.source.value = 'ing-web/forms.js';
    //   }
    // });

    // const output = generate(jsAst, { /* options */ });
    // console.log(output);
    // const renderer = new HtmlRenderer();

    // const html = renderer.render(data.mdAst);

    return data;
  }
}

module.exports = {
  Parser,
};
