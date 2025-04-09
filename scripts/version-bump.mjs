import { dirname, resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { replaceInFile } from 'replace-in-file';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const lernaJson = await readFile(resolve(__dirname, '../lerna.json'), { encoding: 'utf-8' });
const { version } = JSON.parse(lernaJson);

try {
  const matchedFiles = await replaceInFile({
    files: [
      'packages/lynx-react/src/version.ts',
    ],
    from: /\d+\.\d+.\d+(?:-\w+(?:\.\w+)?)?/g,
    to: version,
  });

  const modifiedFiles =
    matchedFiles
      .filter(file => file.hasChanged)
      .map(file => file.file)
      .join(', ') || 'none';
  console.log('Modified files:', modifiedFiles);
} catch (error) {
  console.error('Error occurred:', error);
}
