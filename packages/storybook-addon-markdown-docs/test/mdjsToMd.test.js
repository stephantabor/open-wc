const { expect } = require('chai');

const { mdjsToMd } = require('../src/mdjsToMd');

/**
 * @param {string} output
 * @returns {string[]}
 */
function transformOutput(output) {
  return output.split('\n').map(line => line.trim());
}

describe('mdjsToMd', () => {
  it('transforms mdjs to html', () => {
    const input = [
      //
      '# Title',
      '',
      'Lorem ipsum',
      '',
      '## Subtitle',
      '',
      '- A',
      '- B',
    ].join('\n');

    const output = transformOutput(mdjsToMd(input).html);

    expect(output).to.eql([
      '<h1 id="title">Title</h1>',
      '<p>Lorem ipsum</p>',
      '<h2 id="subtitle">Subtitle</h2>',
      '<ul>',
      '<li>A</li>',
      '<li>B</li>',
      '</ul>',
      '',
    ]);
  });

  it('preserves codeblocks', () => {
    const input = [
      //
      '# Title',
      '',
      '```js',
      "const foo = 'bar'",
      '```',
      '',
      '```html',
      '<my-element foo="bar"></my-element>',
      '```',
    ].join('\n');

    const output = transformOutput(mdjsToMd(input).html);

    expect(output).to.eql([
      //
      '<h1 id="title">Title</h1>',
      '',
      '```js',
      "const foo = 'bar'",
      '```',
      '',
      '',
      '```html',
      '<my-element foo="bar"></my-element>',
      '```',
      '',
      '',
    ]);
  });

  it('turns story and preview codeblocks into jsx elements', () => {
    const input = [
      //
      '# Title',
      '```js story',
      'export const MyStory = () => html`<div>Hello world></div>`',
      '```',
      '',
      '```js preview-story',
      'export const YourStory = () => html`<div>Goodbye world></div>`',
      '```',
    ].join('\n');

    const output = transformOutput(mdjsToMd(input).html);

    expect(output).to.eql([
      //
      '<h1 id="title">Title</h1>',
      '<Story name="MyStory"></Story>',
      '<Preview><Story name="YourStory"></Story></Preview>',
      '',
    ]);
  });

  it('extracts code from stories', () => {
    const input = [
      //
      '# Title',
      '```js story',
      'export const MyStory = () => html`<div>Hello world></div>`',
      '```',
      '',
      '```js preview-story',
      'export const YourStory = () => html`<div>Goodbye world></div>`',
      '```',
    ].join('\n');

    const output = mdjsToMd(input);

    expect(output.stories).to.eql([
      {
        code: 'export const MyStory = () => html`<div>Hello world></div>`\n',
        key: 'MyStory',
        name: 'MyStory',
      },
      {
        code: 'export const YourStory = () => html`<div>Goodbye world></div>`\n',
        key: 'YourStory',
        name: 'YourStory',
      },
    ]);
  });
});
