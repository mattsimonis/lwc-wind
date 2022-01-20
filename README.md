# lwc-wind

<img src="./static/logo.svg" alt="lwc-wind logo" width="140">

> LWC OSS + Tailwind CSS

lwc-wind is a starter project combining Lightning Web Components with Tailwind CSS. Current features include:

- Base component that includes Tailwind CSS for extending
- CSS purge for unused classes across components
- Support for custom labels
- Script for building to export to the Salesforce platform (custom labels file, meta-xml files, and static resource bundle)

## Local Development

1. Clone the `lwc-wind` repository:

```
git clone https://github.com/mattsimonis/lwc-wind
cd lwc-wind
```

2. Install project dependencies using `npm`.

```
npm install
```

3. Start the app in watch mode.

```
npm run watch
```

Use the `c/hello` component as an example LWC that uses the `lwBaseElement` component, including Tailwind CSS.

## Building for Salesforce

Run the `sfdc:build` command.

```bash
npm run sfdc:build
```

### Configuration options

When building for Salesforce, options can be specified via an `sfdc.config.js` file in the project root.

Default options:

```js
{
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
```
