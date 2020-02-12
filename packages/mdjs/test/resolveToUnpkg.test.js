/* eslint-disable no-template-curly-in-string */

const unified = require('unified');
const markdown = require('remark-parse');
const html = require('remark-html');

const chai = require('chai');
const { resolveToUnpkg } = require('../src/resolveToUnpkg.js');

const { expect } = chai;

describe('resolveToUnpkg', () => {
  it('resolves bare imports', async () => {
    const input = [
      "import 'lit-html';",
      "import { LitElement } from 'lit-element';",
      "import { parser } from 'es-module-lexer/dist/lexer.js';",
      "import './my-el.js';",
    ].join('\n');
    const pkgJson = {
      name: 'my-el',
      version: '3.3.3',
      dependencies: {
        'lit-html': '~1.1.1',
        'lit-element': '~2.2.2',
        'es-module-lexer': '4.4.4',
      },
    };
    const result = await resolveToUnpkg(input, pkgJson);
    expect(result.split('\n')).to.deep.equal([
      "import 'https://unpkg.com/lit-html@~1.1.1?module';",
      "import { LitElement } from 'https://unpkg.com/lit-element@~2.2.2?module';",
      "import { parser } from 'https://unpkg.com/es-module-lexer@4.4.4/dist/lexer.js?module';",
      "import 'https://unpkg.com/my-el@3.3.3/my-el.js?module';",
    ]);
  });
});
