/** @typedef {import('@babel/core').types.ExportNamedDeclaration} ExportNamedDeclaration */
/** @typedef {import('@babel/core').types.File} File */
/** @typedef {import('@babel/core').types.Program} Program */
/** @typedef {import('@babel/core').types.Node} Node */
/** @typedef {import('@babel/core').Visitor} Visitor */
/** @typedef {import('./types').Story} Story */
/** @typedef {import('./types').MarkdownToMdxVisitor} MarkdownToMdxVisitor */

const {
  isExportDefaultDeclaration,
  isVariableDeclaration,
  isVariableDeclarator,
  isObjectExpression,
  isExpression,
  isIdentifier,
  variableDeclaration,
  variableDeclarator,
  spreadElement,
  identifier,
} = require('@babel/core').types;
const { parse: parseJs } = require('@babel/parser');

/**
 * @param {Program} program
 * @param {File} file
 */
function injectCode(program, file) {
  // ensure there is a default export
  const code = file.program.body;
  const [defaultExport] = code.filter(n => isExportDefaultDeclaration(n));
  if (!defaultExport || !isExportDefaultDeclaration(defaultExport)) {
    throw new Error('TODO code frame');
    // throw new Error('Markdown must have a default export');
  }

  if (!isExpression(defaultExport.declaration)) {
    // TODO: Can we handle non-expressions?
    throw new Error('TODO code frame');
    // throw new Error('Default export should be an expression');
  }

  // replace the user's default export with a variable, so that we can add it to the storybook
  // default export later
  const defaultExportReplacement = variableDeclaration('const', [
    variableDeclarator(identifier('__userDefaultExport__'), defaultExport.declaration),
  ]);
  code.splice(code.indexOf(defaultExport), 1, defaultExportReplacement);

  // add the user's code on top in the correct order
  program.body.unshift(...code);

  // look for storybook addon docs' default export object
  const componentMeta = program.body.find(
    node =>
      isVariableDeclaration(node) &&
      isVariableDeclarator(node.declarations[0]) &&
      isIdentifier(node.declarations[0].id) &&
      node.declarations[0].id.name === 'componentMeta',
  );

  if (
    !componentMeta ||
    !isVariableDeclaration(componentMeta) ||
    !isVariableDeclarator(componentMeta.declarations[0]) ||
    !isObjectExpression(componentMeta.declarations[0].init)
  ) {
    throw new Error(
      'Something went wrong compiling to storybook docs, could not find component meta.',
    );
  }

  // add user's default export to storybook addon docs' default export
  componentMeta.declarations[0].init.properties.unshift(
    spreadElement(identifier('__userDefaultExport__')),
  );
}

/**
 * @param {Program} program
 * @param {Story[]} stories
 */
function injectStories(program, stories) {
  for (const story of stories.slice().reverse()) {
    const { key, name, codeAst, displayedCode } = story;
    program.body.unshift(
      ...parseJs(`
      ${key}.story = ${key}.story || {};
      ${name ? `${key}.story.name = ${JSON.stringify(name)};` : ''}
      ${key}.story.parameters = ${key}.story.parameters || {};
      ${key}.story.parameters.mdxSource = ${JSON.stringify(displayedCode.trim())};
    `).program.body,
    );
    program.body.unshift(...codeAst.program.body);
  }
}

/** @returns {{ visitor: MarkdownToMdxVisitor }} */
function babelPluginMdToCsf() {
  return {
    visitor: {
      Program(path, state) {
        const { jsAst, stories } = state.opts;
        injectStories(path.node, stories);
        injectCode(path.node, jsAst);
      },
    },
  };
}

module.exports = { babelPluginMdToCsf };
