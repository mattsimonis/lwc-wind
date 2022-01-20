const fs = require('fs');
const config = require('../lwc.config.json');

const LABELS_DIR = './src/labels';
const LWC_CONFIG = './lwc.config.json';

const updatedConfig = { ...config };
updatedConfig.modules = updatedConfig.modules.filter(
  // Purge existing label configs
  (module) => !module?.name?.startsWith('@salesforce/label/')
);

// Add all labels from source dir
fs.readdirSync(LABELS_DIR).forEach((file) => {
  updatedConfig.modules.push({
    name: `@salesforce/label/${file.slice(0, -3)}`,
    path: `src/labels/${file}`
  });
});

// Write config back
fs.writeFileSync(LWC_CONFIG, JSON.stringify(updatedConfig, null, 2) + '\n');
