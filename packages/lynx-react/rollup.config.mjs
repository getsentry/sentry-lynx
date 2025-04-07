import modulePackage from "node:module";
import fs from "node:fs";
import path from "node:path";

import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';

const packageDotJSON = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), './package.json'), { encoding: 'utf8' }));

export default defineConfig({
  input: 'src/index.ts',
  external: [...Object.keys(packageDotJSON.dependencies), ...modulePackage.builtinModules],
  plugins: [
    typescript({
      declaration: false,
      declarationMap: false,
    })
  ],
  output: {
    preserveModules: true,
    dir: "./dist/esm",
    format: "esm",
    exports: "named",
    sourcemap: true,
    entryFileNames: "[name].mjs",
  },
});
