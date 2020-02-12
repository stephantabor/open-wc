# Markdown JavaScript Format

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

## Format

The format is meant to allow using JavaScript with Markdown.
It does so by "annotating" JavaScript that should be execute in Markdown.

All you need to do is have a code block with `js script`.

````md
```js script
// execute me
```
````

### Web Components

One very good use case for that can be web components.
HTML already works in markdown so all you need is to load a web components definition file.

You could even do so within the same markdown file.

````md
## This is my-el

<my-el></my-el>

```js script
import { LitElement, html } from 'https://unpkg.com/lit-element?module';

customElements.define(
  'my-el',
  class extends LitElement {
    render() {
      this.innerHTML = '<p style="color: red">I am alive</p>';
    }
  },
);
```
````

### Usage

mdjs is build to be integrated within the [unifiedjs](https://unifiedjs.com/) system.

```js
const unified = require('unified');
const markdown = require('remark-parse');
const htmlStringify = require('remark-html');

const parser = unified()
  .use(markdown)
  .use(mdjsParse)
  .use(htmlStringify);
const result = await parser.process(body);
const { jsCode } = result.data;
console.log(result.contents);
// <h1>This is my-el></h1>
// <my-el></my-el>
console.log(jsCode);
// customElements.define('my-el', class extends HTMLElement {
// ...
```

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/mdjs/src/README.md';
      }
    }
  }
</script>
