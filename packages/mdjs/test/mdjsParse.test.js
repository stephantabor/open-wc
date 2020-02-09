/* eslint-disable no-template-curly-in-string */

const unified = require('unified');
const markdown = require('remark-parse');
const html = require('remark-html');

const chai = require('chai');
const { mdjsParse } = require('../src/mdjsParse.js');

const { expect } = chai;

describe('mdjsParse', () => {
  it('extracts only "js script" code blocks', (done) => {
    const input = [
      '## Intro',
      '```js',
      'const foo = 1;',
      '```',
      '```js script',
      'const bar = 22;',
      '```',
    ].join('\n');
    unified()
      .use(markdown)
      .use(mdjsParse)
      .use(html)
      .process(input, (err, file) => {
        expect(file.contents).to.equal('<h2>Intro</h2>\n<pre><code class="language-js">const foo = 1;\n</code></pre>\n');
        // expect(file.node.children.length).to.equal(2);
        expect(file.data.jsCode).to.equal('const bar = 22;');
        done();
      });
  });
});
