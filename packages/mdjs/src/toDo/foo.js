// const unified = require('unified');
// const markdown = require('remark-parse');
// const html = require('remark-html');

// /* eslint-disable */

// const input = [
//   '## Intro',
//   '```js',
//   'const foo = 1;',
//   '```',
//   '```js script',
//   'const bar = 22;',
//   '```',
// ].join('\n');

// unified()
//   .use(markdown)
//   .use(html)
//   // .use(function plugin() {
//   //   return transformer

//   //   function transformer(tree, file) {
//   //     console.log('tree', tree);
//   //     // tree = { a: 'aa', b: 'bb' };
//   //     tree.jsCode = 'foo';
//   //     return tree;
//   //   }
//   //   // return (a, b, c) => {
//   //   //   console.log({ a, b, c });
//   //   //   // a = {
//   //   //   //   foo: 'f',
//   //   //   //   bar: 'ba',
//   //   //   // };
//   //   //   return a;
//   //   // }
//   // })
//   // .use(function plugin() {
//   //   this.Compiler = function compiler(node, file) {
//   //     console.log('----');
//   //     console.log(node.jsCode);
//   //   }
//   // })
//   .process(input, function (err, file) {
//     console.log('EEENND');
//     console.error(err)
//     console.log(String(file))
//   })

// // unified()
// //   .use(markdown)
// //   .use(function plugin() {
// //     return transformer

// //     function transformer(tree, file) {
// //       console.log('tree', tree);
// //       // tree = { a: 'aa', b: 'bb' };
// //       tree.jsCode = 'foo';
// //       return tree;
// //     }
// //     // return (a, b, c) => {
// //     //   console.log({ a, b, c });
// //     //   // a = {
// //     //   //   foo: 'f',
// //     //   //   bar: 'ba',
// //     //   // };
// //     //   return a;
// //     // }
// //   })
// //   .use(function plugin() {
// //     this.Compiler = function compiler(node, file) {
// //       console.log('----');
// //       console.log(node.jsCode);
// //     }
// //   })
// //   .process(input, function (err, file) {
// //     console.log('EEENND');
// //     console.error(err)
// //     console.log(String(file))
// //   })
