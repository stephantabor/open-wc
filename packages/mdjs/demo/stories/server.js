const { mdjsDocPage } = require('../../index.js');

module.exports = {
  nodeResolve: true,
  open: 'packages/mdjs/demo/stories/README.md',
  watch: true,
  responseTransformers: [
    async function mdJsTransformer({ url, body }) {
      if (url.endsWith('.md')) {
        return {
          body: await mdjsDocPage(body),
          contentType: 'text/html',
        };
      }
      return null;
    },
  ],
};
