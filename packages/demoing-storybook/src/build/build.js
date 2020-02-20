const fs = require('fs-extra');
const path = require('path');
const createAssets = require('../shared/getAssets');
const toBrowserPath = require('../shared/toBrowserPath');
const { buildManager } = require('./rollup/buildManager');
const { buildPreview } = require('./rollup/buildPreview');

module.exports = async function build({
  storybookConfigDir,
  outputDir,
  managerPath,
  previewPath,
  storiesPatterns,
  rollupConfigDecorator,
  experimentalMdDocs,
}) {
  const managerPathRelative = `/${path.relative(process.cwd(), require.resolve(managerPath))}`;
  const managerImport = toBrowserPath(managerPathRelative);

  const assets = createAssets({
    storybookConfigDir,
    managerImport,
  });

  const previewConfigPath = path.join(process.cwd(), storybookConfigDir, 'preview.js');
  const previewConfigImport = fs.existsSync(previewConfigPath) ? previewConfigPath : undefined;

  await fs.remove(outputDir);
  await fs.mkdirp(outputDir);

  await buildManager({ outputDir, indexHTML: assets.indexHTML });
  await buildPreview({
    outputDir,
    iframeHTML: assets.iframeHTML,
    storiesPatterns,
    previewPath,
    previewConfigImport,
    experimentalMdDocs,
    rollupConfigDecorator,
  });
};
