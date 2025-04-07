const replace = require('replace-in-file');

// Root package.json doesn't have a version field, so we need to read it from the core package.json
const pjson = require('../packages/lynx-react/package.json');

replace({
  files: [
    'packages/lynx-react/src/version.ts',
  ],
  from: /\d+\.\d+.\d+(?:-\w+(?:\.\w+)?)?/g,
  to: pjson.version,
})
  .then(matchedFiles => {
    const modifiedFiles =
      matchedFiles
        .filter(file => file.hasChanged)
        .map(file => file.file)
        .join(', ') || 'none';
    console.log('Modified files:', modifiedFiles);
  })
  .catch(error => {
    console.error('Error occurred:', error);
  });
  