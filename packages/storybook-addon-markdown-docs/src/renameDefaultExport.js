/** @typedef {import('@babel/core').types.File} File */
const { parse } = require('@babel/parser');
const {
  isExportDefaultDeclaration,
  isExpression,
  variableDeclaration,
  variableDeclarator,
  identifier,
} = require('@babel/core').types;
const { default: generate } = require('@babel/generator');

/**
 * @param {string} code
 * @returns {string}
 */
function renameDefaultExport(code) {
  if (!code) {
    throw new Error('TODO: code frame');
  }

  const file = parse(code, { sourceType: 'module' });
  // ensure there is a default export
  if (!file) {
    throw new Error('TODO: code frame');
  }

  const { body } = file.program;
  const [defaultExport] = body.filter(n => isExportDefaultDeclaration(n));
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
    variableDeclarator(identifier('__export_default__'), defaultExport.declaration),
  ]);
  body.splice(body.indexOf(defaultExport), 1, defaultExportReplacement);

  return generate(file).code;
}

module.exports = {
  renameDefaultExport,
};
