const { init, parse } = require('es-module-lexer');

/**
 * @param {string} code
 * @param {string} replacement
 * @param {number} start
 * @param {number} end
 */
function replaceCode(code = '', replacement, start, end) {
  const before = code.substring(0, start);
  const after = code.substring(end);
  return `${before}${replacement}${after}`;
}

/**
 *
 * @param {string} pkgImport
 * @param {string} fallbackName
 */
function getPkgMetaFromImport(pkgImport, fallbackName = '') {
  if (pkgImport.startsWith('./')) {
    return {
      name: fallbackName,
      path: pkgImport.substring(1),
    };
  }

  let scope = '';
  let nameAndPath = pkgImport;
  if (pkgImport.startsWith('@')) {
    const scopeParts = pkgImport.split('@');
    [scope, nameAndPath] = scopeParts;
  }
  const pathParts = nameAndPath.split('/');
  const name = scope + pathParts[0];
  const path = pathParts.length > 1 ? `/${pathParts.splice(1).join('/')}` : '';
  return { name, path };
}

/**
 *
 * @param {string} code
 * @param {object} pkgJson
 */
async function resolveToUnpkg(code, pkgJson) {
  await init;
  const [imports] = parse(code);

  const versions = {
    ...pkgJson.dependencies,
    ...pkgJson.devDependencies,
  };
  versions[pkgJson.name] = pkgJson.version;

  let result = code;
  for (const importMeta of imports.reverse()) {
    const importPath = code.substring(importMeta.s, importMeta.e);
    const pkgMeta = getPkgMetaFromImport(importPath, pkgJson.name);
    const version = versions[pkgMeta.name];
    const newImport = `https://unpkg.com/${pkgMeta.name}@${version}${pkgMeta.path}?module`;
    result = replaceCode(result, newImport, importMeta.s, importMeta.e);
  }

  return result;
}

module.exports = {
  resolveToUnpkg,
};
