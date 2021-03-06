const { jestConfig } = require('lwc-services/lib/config/jestConfig');

const setupFilesAfterEnv = jestConfig.setupFilesAfterEnv || [];
setupFilesAfterEnv.push('<rootDir>/jest-sa11y-setup.js');

const testPathIgnorePatterns = ['<rootDir>/sfdc/'];

module.exports = {
  ...jestConfig,
  setupFilesAfterEnv,
  testPathIgnorePatterns
};
