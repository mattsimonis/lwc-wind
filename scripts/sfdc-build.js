const path = require('path');
const fs = require('fs-extra');
const shell = require('shelljs');
const merge = require('deepmerge');
const { create } = require('xmlbuilder2');

const DEFAULT_OPTIONS = {
  exportDir: './sfdc',
  lwcRoot: './src/modules/c',
  labelsDir: './src/labels',
  labelFileName: 'CustomLabels.labels-meta.xml',
  labelLanguage: 'en_US',
  labelProtected: 'false',
  createLwcMetaXml: true,
  lwcMetaXml: `<?xml version="1.0" encoding="UTF-8"?>
  <LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
      <isExposed>false</isExposed>
  </LightningComponentBundle>
`,
  cssFile: './src/css/main.css',
  staticResourceName: 'lwdesign'
};

const buildConfig = () => {
  let combinedConfig = DEFAULT_OPTIONS;
  try {
    const configFile = path.resolve(process.cwd(), 'sfdc.config.js');
    const userConfig = require(configFile);
    combinedConfig = merge(DEFAULT_OPTIONS, userConfig);
    return combinedConfig;
  } catch (error) {
    console.error('Using default configuration! Error loading custom config');
    console.error(error);
  }
  return combinedConfig;
};

const config = buildConfig();

// Delete export dir if it already exists
if (fs.existsSync(config.exportDir)) {
  fs.rmSync(config.exportDir, { recursive: true });
}

// Create export dir
fs.mkdirSync(config.exportDir);

// Copy LWC's
const lwcDir = path.join(config.exportDir, 'lwc');
fs.mkdirSync(lwcDir);
fs.copySync(config.lwcRoot, lwcDir);

// Add xml config for each LWC
if (config.createLwcMetaXml) {
  fs.readdirSync(lwcDir).forEach((lwc) => {
    fs.writeFileSync(
      path.join(lwcDir, lwc, `${lwc}.js-meta.xml`),
      config.lwcMetaXml
    );
  });
}

// Create custom labels XML
const encodeXml = (input) => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

const labelContentRegex = /export\s+default\s+'(.*)';/;

// prettier-ignore
const customLabelsDoc = create({ version: '1.0', encoding: 'UTF-8' })
  .ele('CustomLabels', {
    xmlns: 'http://soap.sforce.com/2006/04/metadata'
  });

fs.readdirSync(config.labelsDir).forEach((label) => {
  const labelName = label.slice(0, -3).split('.')[1];
  const labelPath = path.join(config.labelsDir, label);
  const fileContents = fs.readFileSync(labelPath, 'UTF-8');
  const labelValue = fileContents.match(labelContentRegex)[1];

  // prettier-ignore
  customLabelsDoc.ele('labels')
    .ele('fullName').txt(labelName).up()
    .ele('language').txt(config.labelLanguage).up()
    .ele('protected').txt(config.labelProtected).up()
    .ele('value').txt(encodeXml(labelValue)).up()
    .ele('shortDescription').txt(labelName).up()
    .up();
});

const labelExportDir = path.join(config.exportDir, 'labels');
fs.mkdirSync(labelExportDir);

const xml = customLabelsDoc.end({ prettyPrint: true, indent: '    ' }) + '\n';
fs.writeFileSync(path.join(labelExportDir, config.labelFileName), xml);

// Static resource for design system
const staticResourcesDir = path.join(config.exportDir, 'staticresources');
fs.mkdirSync(staticResourcesDir);

fs.writeFileSync(
  path.join(
    staticResourcesDir,
    `${config.staticResourceName}.resource-meta.xml`
  ),
  `<?xml version="1.0" encoding="UTF-8"?>
<StaticResource xmlns="http://soap.sforce.com/2006/04/metadata">
    <cacheControl>Private</cacheControl>
    <contentType>application/zip</contentType>
</StaticResource>
`
);

const resourcesDir = path.join(staticResourcesDir, config.staticResourceName);
fs.mkdirSync(resourcesDir);

const cssExportDir = path.join(resourcesDir, 'css');
fs.mkdirSync(cssExportDir);

shell.exec(
  `tailwindcss -i ${config.cssFile} -o ${cssExportDir}/main.css --minify --content '${config.lwcRoot}/**/*.{html,js,css}'`
);
